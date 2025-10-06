from flask import Blueprint, jsonify
from src.database.mysql_config import mysql_db
from datetime import datetime, timedelta

history_bp = Blueprint('history', __name__)

@history_bp.before_request
def ensure_db_connection():
    """Garante que o banco de dados esteja conectado antes de cada requisição."""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()

@history_bp.route('/history/decision-flow', methods=['GET'])
def get_decision_flow_data():
    """Busca dados de fluxo de decisão da IA."""
    # Busca as últimas 5 decisões, juntando com Zona para obter o nome da zona
    # e subqueries para buscar dados de sensores próximos ao horário da decisão.
    query = """
        SELECT 
            DIA.ID_decisao, 
            DIA.data_hora, 
            Z.nome AS zone_name, 
            P.ID_propriedade,
            DIA.descricao AS decision_description, 
            DIA.confianca, 
            DIA.volume_economizado
        FROM DecisaoIA DIA
        JOIN Zona Z ON DIA.ID_zona_fk = Z.ID_zona
        JOIN PropriedadeRural P ON Z.ID_propriedade_fk = P.ID_propriedade
        ORDER BY DIA.data_hora DESC
        LIMIT 5;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar dados de fluxo de decisão da IA"}), 500

    decision_flow_data = []
    for row in result:
        # Busca as medições mais próximas (até 15 min antes) da decisão para a propriedade
        sensor_query = """
            SELECT 
                AVG(CASE WHEN S.tipo = 'Reservatorio' THEN M.valor_medicao ELSE NULL END) as waterLevel,
                AVG(CASE WHEN S.tipo = 'Umidade' THEN M.valor_medicao ELSE NULL END) as soilMoisture,
                AVG(CASE WHEN S.tipo = 'pH' THEN M.valor_medicao ELSE NULL END) as ph,
                AVG(CASE WHEN S.tipo = 'Temperatura' THEN M.valor_medicao ELSE NULL END) as temperature,
                AVG(CASE WHEN S.tipo = 'LuzSolar' THEN M.valor_medicao ELSE NULL END) as sunIntensity
            FROM Medicao M
            JOIN Sensor S ON M.ID_sensor_fk = S.ID_sensor
            WHERE M.ID_propriedade_fk = %s AND M.data_hora BETWEEN (%s - INTERVAL 15 MINUTE) AND %s
        """
        sensor_data = mysql_db.execute_query(sensor_query, (row['ID_propriedade'], row['data_hora'], row['data_hora']))
        
        env_data = sensor_data[0] if sensor_data and sensor_data[0] else {}

        decision_flow_data.append({
            "time": row['data_hora'].strftime('%H:%M'),
            "waterLevel": round(float(env_data.get('waterLevel') or 70)),
            "isRaining": False, # Mockado, pois não há sensor de chuva no schema
            "soilMoisture": round(float(env_data.get('soilMoisture') or 60)),
            "ph": round(float(env_data.get('ph') or 6.5), 1),
            "temperature": round(float(env_data.get('temperature') or 25)),
            "sunIntensity": round(float(env_data.get('sunIntensity') or 500) / 10), # Ajustando para %
            "decision": row['decision_description'],
            "duration": 30 # Mockado, pois não há essa informação no schema
        })
    
    # Inverte a ordem para que as decisões mais antigas apareçam primeiro,
    # correspondendo à estrutura do mock original do frontend.
    return jsonify(decision_flow_data[::-1]), 200

@history_bp.route('/history/environmental-correlation', methods=['GET'])
def get_environmental_correlation_data():
    """Busca dados de correlação ambiental (sensores) para as últimas 24 horas."""
    end_time = datetime.now()
    start_time = end_time - timedelta(hours=24)

    # Consulta para obter valores médios de sensores por hora para tipos relevantes
    query = """
        SELECT
            HOUR(M.data_hora) AS hour_of_day,
            AVG(CASE WHEN S.tipo = 'LuzSolar' THEN M.valor_medicao ELSE NULL END) AS sunIntensity,
            AVG(CASE WHEN S.tipo = 'Temperatura' THEN M.valor_medicao ELSE NULL END) AS temperature,
            AVG(CASE WHEN S.tipo = 'Umidade' THEN M.valor_medicao ELSE NULL END) AS soilMoisture,
            AVG(CASE WHEN S.tipo = 'pH' THEN M.valor_medicao ELSE NULL END) AS ph
        FROM Medicao M
        JOIN Sensor S ON M.ID_sensor_fk = S.ID_sensor
        WHERE M.data_hora BETWEEN %s AND %s
          AND S.tipo IN ('LuzSolar', 'Temperatura', 'Umidade', 'pH')
        GROUP BY hour_of_day
        ORDER BY hour_of_day;
    """
    result = mysql_db.execute_query(query, (start_time, end_time))

    if result is None:
        return jsonify({"error": "Erro ao buscar dados de correlação ambiental"}), 500

    environmental_data = []
    for row in result:
        environmental_data.append({
            "hour": f"{int(row['hour_of_day']):02d}", # Formata a hora como "06", "08"
            "sunIntensity": round(float(row['sunIntensity'])) if row['sunIntensity'] is not None else 0,
            "temperature": round(float(row['temperature'])) if row['temperature'] is not None else 0,
            "soilMoisture": round(float(row['soilMoisture'])) if row['soilMoisture'] is not None else 0,
            "ph": round(float(row['ph']), 1) if row['ph'] is not None else 0.0
        })
    
    return jsonify(environmental_data), 200
    
@history_bp.route('/schedule/ai-decisions', methods=['GET'])
def get_schedule_ai_decisions():
    """Busca as decisões da IA para a página de agendamentos."""
    query = """
        SELECT 
            d.ID_decisao as id,
            i.nome as irrigator,
            z.nome as zone,
            d.descricao as decision,
            d.tipo as reason, -- Usando 'tipo' como base para a razão
            TIME(d.data_hora) as time,
            d.confianca as confidence,
            d.volume_economizado as waterSaved,
            c.statusIA as aiModel,
            CASE 
                WHEN d.tipo = 'Otimização' THEN 'executed'
                WHEN d.tipo = 'Economia' THEN 'active'
                WHEN d.tipo = 'Prevenção' THEN 'scheduled'
                WHEN d.tipo = 'Alerta' THEN 'warning'
                ELSE 'pending'
            END as status
        FROM DecisaoIA d
        JOIN Zona z ON d.ID_zona_fk = z.ID_zona
        LEFT JOIN Irrigador i ON z.ID_zona = i.ID_zona_fk
        LEFT JOIN Setor s ON z.ID_propriedade_fk = s.ID_propriedade_fk AND z.nome LIKE CONCAT('%', s.cultura, '%') -- Heurística para ligar Zona ao Setor
        LEFT JOIN Cultura c ON s.ID_setor = c.ID_setor_fk
        ORDER BY d.data_hora DESC;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar decisões da IA"}), 500

    # Formata os dados para o frontend
    for row in result:
        row['aiModel'] = row.get('aiModel') or 'Básico' # Garante que aiModel nunca seja nulo
        row['time'] = str(row['time'])
        row['confidence'] = f"{row['confidence']}%"
        row['waterSaved'] = f"{row['waterSaved']}L" if row['waterSaved'] > 0 else "0L"

    return jsonify(result), 200

def _get_ai_summary_data():
    """Função auxiliar para buscar e formatar o resumo de performance da IA."""
    query = """
        SELECT
            (SELECT SUM(padroes_ml) FROM Cultura) as learnedPatterns,
            (SELECT AVG(eficiencia) FROM Cultura) as averageEfficiency,
            (SELECT SUM(volume_economizado) FROM DecisaoIA WHERE MONTH(data_hora) = MONTH(CURDATE())) as monthlySavings,
            (SELECT AVG(confianca) FROM DecisaoIA) as decisionAccuracy
    """
    result = mysql_db.execute_query(query)

    if result is None or not result:
        return None

    summary = result[0]
    return {
        "learnedPatterns": int(summary.get('learnedPatterns') or 0),
        "averageEfficiency": round(float(summary.get('averageEfficiency') or 0), 1),
        "monthlySavings": int(summary.get('monthlySavings') or 0),
        "decisionAccuracy": round(float(summary.get('decisionAccuracy') or 0), 1)
    }

@history_bp.route('/history/ai-performance-summary', methods=['GET'])
def get_ai_performance_summary():
    """Busca um resumo da performance da IA para os cards do dashboard de relatórios."""
    summary_data = _get_ai_summary_data()
    if summary_data is None:
        return jsonify({"error": "Erro ao buscar resumo de performance da IA"}), 500
    
    # Renomeia a chave para corresponder à expectativa do frontend
    summary_data['waterSaved'] = summary_data.pop('monthlySavings')
    return jsonify(summary_data), 200

@history_bp.route('/history/ai-reports', methods=['GET'])
def get_ai_reports():
    """Busca dados para os cards de relatórios de IA."""
    query = """
        SELECT
            (SELECT SUM(padroes_ml) FROM Cultura) as totalPatterns,
            (SELECT COUNT(*) FROM DecisaoIA WHERE data_hora >= NOW() - INTERVAL 7 DAY) as newPatternsLastWeek,
            (SELECT AVG(eficiencia) FROM Cultura) as globalEfficiency,
            (SELECT SUM(volume_economizado) FROM DecisaoIA WHERE MONTH(data_hora) = MONTH(CURDATE())) as monthlySavings,
            (SELECT AVG(confianca) FROM DecisaoIA) as decisionAccuracy
    """
    result = mysql_db.execute_query(query)

    if result is None or not result:
        return jsonify({"error": "Erro ao buscar dados para relatórios de IA"}), 500

    stats = result[0]

    reports = [
        {
            "title": "Padrões de Aprendizado da IA",
            "type": "ai-learning",
            "period": "Última semana",
            "value": f"{int(stats.get('newPatternsLastWeek') or 0)} novos",
            "change": "+15%", # Mockado, pois não há histórico para comparar
            "trend": "up",
            "description": "Novos padrões identificados pelo machine learning"
        },
        {
            "title": "Eficiência Hídrica Global",
            "type": "efficiency",
            "period": "Média geral",
            "value": f"{round(float(stats.get('globalEfficiency') or 0), 1)}%",
            "change": "+1.8%", # Mockado
            "trend": "up",
            "description": "Eficiência média de todas as culturas com IA"
        },
        {
            "title": "Economia por IA",
            "type": "ai-savings",
            "period": "Este mês",
            "value": f"{int(stats.get('monthlySavings') or 0)}L",
            "change": "+18.7%", # Mockado
            "trend": "up",
            "description": "Água economizada pelas decisões inteligentes da IA"
        },
        {
            "title": "Precisão das Decisões",
            "type": "accuracy",
            "period": "Média geral",
            "value": f"{round(float(stats.get('decisionAccuracy') or 0), 1)}%",
            "change": "+4.2%", # Mockado
            "trend": "up",
            "description": "Acurácia das decisões de irrigação da IA"
        }
    ]

    return jsonify(reports), 200

@history_bp.route('/history/culture-analysis', methods=['GET'])
def get_culture_analysis():
    """Busca dados de análise de IA por cultura."""
    # Esta query é uma aproximação. Ela conta irrigadores por zona que tem o nome da cultura.
    # Uma modelagem mais direta entre Irrigador e Cultura/Setor seria mais precisa.
    query = """
        SELECT 
            C.nome AS culture,
            (SELECT COUNT(I.ID_irrigador) FROM Irrigador I JOIN Zona Z ON I.ID_zona_fk = Z.ID_zona WHERE Z.nome LIKE CONCAT('%', C.nome, '%')) as irrigators,
            COUNT(DISTINCT I.ID_irrigador) as irrigators,
            C.padroes_ml as patternsLearned,
            C.eficiencia as efficiency,
            C.economia as waterSaved, -- Assumindo que a economia na tabela Cultura é por semana
            C.statusIA as aiStatus
        FROM Cultura C
        JOIN Setor S ON C.ID_setor_fk = S.ID_setor
        JOIN PropriedadeRural P ON S.ID_propriedade_fk = P.ID_propriedade
        JOIN Zona Z ON P.ID_propriedade = Z.ID_propriedade_fk
        LEFT JOIN Irrigador I ON Z.ID_zona = I.ID_zona_fk
        GROUP BY C.ID_cultura, C.nome, C.padroes_ml, C.eficiencia, C.economia, C.statusIA
        ORDER BY C.nome;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar análise por cultura"}), 500

    # Formata a saída para corresponder ao que o frontend espera
    for row in result:
        row['efficiency'] = f"{row['efficiency']}%"
        row['waterSaved'] = f"{int(row['waterSaved'])}L/semana"
        # Converte os tipos para o frontend se necessário
        row['irrigators'] = int(row['irrigators'])
        row['patternsLearned'] = int(row['patternsLearned'])

    return jsonify(result), 200

@history_bp.route('/schedule/ai-summary-stats', methods=['GET'])
def get_schedule_summary_stats():
    """Busca os dados de resumo para os cards da página de agendamentos."""
    summary_data = _get_ai_summary_data()
    if summary_data is None:
        return jsonify({"error": "Erro ao buscar resumo para agendamentos"}), 500
    
    # Renomeia a chave para corresponder à expectativa do frontend
    summary_data['waterEfficiency'] = summary_data.pop('averageEfficiency')
    return jsonify(summary_data), 200

@history_bp.route('/schedule/recent-patterns', methods=['GET'])
def get_recent_patterns():
    """Retorna uma lista de padrões de aprendizado recentes da IA."""
    query = """
        SELECT 
            nome as pattern,
            descricao as description,
            culturas_afetadas as culturesAffected,
            ganho_eficiencia as efficiency,
            data_aprendizado as learned
        FROM PadroesAprendidos
        ORDER BY data_aprendizado DESC
        LIMIT 3;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar padrões de aprendizado"}), 500

    for row in result:
        row['culturesAffected'] = row['culturesAffected'].split(',')
        row['efficiency'] = f"+{row['efficiency']}%"
        row['learned'] = f"há {abs((datetime.now().date() - row['learned']).days)} dias"

    return jsonify(result), 200

@history_bp.route('/history/sensor-database-stats', methods=['GET'])
def get_sensor_database_stats():
    """Busca estatísticas do banco de dados de sensores."""
    query = """
        SELECT
            (SELECT COUNT(*) FROM Medicao) as totalRecords,
            (SELECT COUNT(*) FROM Medicao WHERE data_hora >= NOW() - INTERVAL 24 HOUR) as recordsToday,
            (SELECT COUNT(*) FROM Sensor WHERE tipo = 'Umidade') as humiditySensors,
            (SELECT COUNT(*) FROM Sensor WHERE tipo = 'pH') as phSensors,
            (SELECT COUNT(*) FROM Sensor WHERE tipo = 'Temperatura') as tempSensors,
            (SELECT COUNT(*) FROM Sensor WHERE tipo = 'LuzSolar') as lightSensors,
            (SELECT COUNT(*) FROM Sensor WHERE tipo = 'Reservatorio') as reservoirSensors
    """
    result = mysql_db.execute_query(query)

    if result is None or not result:
        return jsonify({"error": "Erro ao buscar estatísticas do banco de dados de sensores"}), 500

    stats = result[0]

    # Calcula medições por dia (aproximado)
    records_today = int(stats.get('recordsToday') or 0)
    measurements_per_day = records_today if records_today > 0 else 2880 # Fallback para o valor mockado

    response_data = {
        "totalRecords": int(stats.get('totalRecords') or 0),
        "measurementsPerDay": measurements_per_day,
        "sensorAccuracy": 98.7, # Mockado, pois não há como calcular
        "storageUsed": 847, # Mockado, pois depende do SGBD
        "sensorStatus": [
            {"name": f"Nível de Água ({stats.get('reservoirSensors', 0)} sensores)", "status": "100% Online"},
            {"name": f"Umidade do Solo ({stats.get('humiditySensors', 0)} sensores)", "status": "100% Online"},
            {"name": f"pH do Solo ({stats.get('phSensors', 0)} sensores)", "status": "Calibrando"}, # Mockado
            {"name": f"Temperatura ({stats.get('tempSensors', 0)} sensores)", "status": "100% Online"},
            {"name": f"Intensidade Solar ({stats.get('lightSensors', 0)} sensores)", "status": "100% Online"}
        ]
    }
    return jsonify(response_data), 200

@history_bp.route('/history/productivity-evolution', methods=['GET'])
def get_productivity_evolution():
    """Busca dados da evolução da produtividade e melhorias."""
    period_months = request.args.get('months', 6, type=int)

    # Query para o gráfico de produtividade
    query_chart = """
        SELECT 
            DATE_FORMAT(mes_ano, '%%b/%%y') as period,
            100 as traditional,
            produtividade_ia as withAI,
            (produtividade_ia - 100) as increase
        FROM HistoricoProdutividade
        ORDER BY mes_ano ASC
        LIMIT %s;
    """
    chart_data = mysql_db.execute_query(query_chart, (period_months,))

    # Query para os cards de melhorias (usando o último registro do período)
    query_improvements = """
        SELECT 
            produtividade_ia,
            economia_agua_ia,
            eficiencia_ph_ia
        FROM HistoricoProdutividade
        ORDER BY mes_ano DESC
        LIMIT 1;
    """
    latest_data = mysql_db.execute_query(query_improvements)

    if chart_data is None or latest_data is None:
        return jsonify({"error": "Erro ao buscar dados de produtividade"}), 500

    stats = latest_data[0] if latest_data else {}
    
    improvements_data = [
        {"metric": "Produtividade", "before": "100%", "after": f"{stats.get('produtividade_ia', 0)}%", "improvement": f"+{stats.get('produtividade_ia', 0) - 100}%"},
        {"metric": "Economia de Água", "before": "0%", "after": f"{stats.get('economia_agua_ia', 0)}%", "improvement": f"+{stats.get('economia_agua_ia', 0)}%"},
        {"metric": "Eficiência pH", "before": "70%", "after": f"{stats.get('eficiencia_ph_ia', 0)}%", "improvement": f"+{stats.get('eficiencia_ph_ia', 0) - 70}%"},
        {"metric": "Aproveitamento Solar", "before": "N/A", "after": "87%", "improvement": "Novo"}, # Mockado
        {"metric": "Prevenção Chuva", "before": "Manual", "after": "100%", "improvement": "Automático"}, # Mockado
        {"metric": "Controle Umidade", "before": "±15%", "after": "±3%", "improvement": "+400%"} # Mockado
    ]

    return jsonify({"chartData": chart_data, "improvements": improvements_data}), 200