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

@history_bp.route('/history/culture-analysis', methods=['GET'])
def get_culture_analysis():
    """Busca dados de análise de IA por cultura."""
    # Esta query é uma aproximação. Ela conta irrigadores por zona que tem o nome da cultura.
    # Uma modelagem mais direta entre Irrigador e Cultura/Setor seria mais precisa.
    query = """
        SELECT 
            C.nome AS culture,
            (SELECT COUNT(I.ID_irrigador) FROM Irrigador I JOIN Zona Z ON I.ID_zona_fk = Z.ID_zona WHERE Z.nome LIKE CONCAT('%', C.nome, '%')) as irrigators,
            C.padroes_ml as patternsLearned,
            C.eficiencia as efficiency,
            C.economia as waterSaved, -- Assumindo que a economia na tabela Cultura é por semana
            C.statusIA as aiStatus
        FROM Cultura C
        JOIN Setor S ON C.ID_setor_fk = S.ID_setor
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
    # NOTA: O schema atual não possui uma tabela para "Padrões Aprendidos" detalhados.
    # Esta rota retorna dados mockados estruturados, simulando o que viria do banco.
    # Para uma implementação real, seria necessária uma nova tabela (ex: PadroesAprendidos).
    mock_patterns = [
        {"pattern": "Correlação Clima-Solo", "description": "IA identifica padrões entre previsão meteorológica e necessidade hídrica", "culturesAffected": ["Milho", "Soja"], "efficiency": "+12%", "learned": "há 2 semanas"},
        {"pattern": "Otimização Horário-Temperatura", "description": "Irrigação noturna mais eficiente para reduzir evaporação", "culturesAffected": ["Soja", "Feijão"], "efficiency": "+8%", "learned": "há 1 semana"},
        {"pattern": "Micro-irrigação Verduras", "description": "Pequenas doses frequentes para culturas sensíveis", "culturesAffected": ["Verduras"], "efficiency": "+18%", "learned": "há 3 dias"}
    ]
    return jsonify(mock_patterns), 200