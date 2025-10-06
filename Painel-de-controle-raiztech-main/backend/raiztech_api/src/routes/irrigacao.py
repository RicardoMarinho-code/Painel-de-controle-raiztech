from flask import Blueprint, request, jsonify
from src.database.mysql_config import mysql_db

irrigacao_bp = Blueprint('irrigacao', __name__)

@irrigacao_bp.before_request
def ensure_db_connection():
    """Garante que o banco de dados esteja conectado antes de cada requisição."""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()

@irrigacao_bp.route('/zonas', methods=['GET'])
def get_zonas():
    """Busca todas as zonas de irrigação"""
    query = """
        SELECT z.*, p.nome as propriedade_nome
        FROM Zona z
        JOIN PropriedadeRural p ON z.ID_propriedade_fk = p.ID_propriedade
    """
    result = mysql_db.execute_query(query)
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar zonas"}), 500

@irrigacao_bp.route('/irrigadores', methods=['GET'])
def get_irrigadores():
    """Busca todos os irrigadores"""
    query = """
        SELECT i.*, z.nome as zona_nome
        FROM Irrigador i
        JOIN Zona z ON i.ID_zona_fk = z.ID_zona
    """
    result = mysql_db.execute_query(query)
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar irrigadores"}), 500

@irrigacao_bp.route('/irrigadores/<int:id>/status', methods=['PUT'])
def update_irrigador_status(id):
    """Atualiza o status de um irrigador"""
    data = request.get_json()
    
    if 'status_' not in data:
        return jsonify({"error": "Status é obrigatório"}), 400
    
    valid_status = ['Ativo', 'Ocioso', 'Manutenção']
    if data['status_'] not in valid_status:
        return jsonify({"error": f"Status deve ser um dos: {valid_status}"}), 400
    
    query = "UPDATE Irrigador SET status_ = %s WHERE ID_irrigador = %s"
    
    if mysql_db.execute_update(query, (data['status_'], id)):
        return jsonify({"message": "Status do irrigador atualizado com sucesso"}), 200
    else:
        return jsonify({"error": "Erro ao atualizar status do irrigador"}), 500

@irrigacao_bp.route('/setores', methods=['GET'])
def get_setores():
    """Busca todos os setores"""
    query = """
        SELECT s.*, p.nome as propriedade_nome
        FROM Setor s
        JOIN PropriedadeRural p ON s.ID_propriedade_fk = p.ID_propriedade
    """
    result = mysql_db.execute_query(query)
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar setores"}), 500

@irrigacao_bp.route('/setores/<int:id>/irrigacao', methods=['POST'])
def programar_irrigacao(id):
    """Programa irrigação para um setor"""
    data = request.get_json()
    
    if 'duracao_irrigacao' not in data:
        return jsonify({"error": "Duração da irrigação é obrigatória"}), 400
    
    # Atualiza o setor com nova programação
    query = """
        UPDATE Setor 
        SET duracao_irrigacao = %s,
            ultima_irrigacao = NOW(),
            proxima_irrigacao = DATE_ADD(NOW(), INTERVAL %s HOUR)
        WHERE ID_setor = %s
    """
    
    duracao = data['duracao_irrigacao']
    intervalo = data.get('intervalo_horas', 24)  # Padrão: irrigar a cada 24h
    
    if mysql_db.execute_update(query, (duracao, intervalo, id)):
        return jsonify({"message": "Irrigação programada com sucesso"}), 200
    else:
        return jsonify({"error": "Erro ao programar irrigação"}), 500

@irrigacao_bp.route('/decisoes-ia', methods=['GET'])
def get_decisoes_ia():
    """Busca decisões da IA relacionadas à irrigação"""
    limit = request.args.get('limit', 20, type=int)
    
    query = """
        SELECT d.*, z.nome as zona_nome
        FROM DecisaoIA d
        JOIN Zona z ON d.ID_zona_fk = z.ID_zona
        ORDER BY d.data_hora DESC
        LIMIT %s
    """
    result = mysql_db.execute_query(query, (limit,))
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar decisões da IA"}), 500

@irrigacao_bp.route('/dashboard/irrigacao-resumo', methods=['GET'])
def get_irrigacao_resumo():
    """Retorna resumo da irrigação para dashboard"""
    # Status dos irrigadores
    query_irrigadores = """
        SELECT status_, COUNT(*) as quantidade
        FROM Irrigador
        GROUP BY status_
    """
    
    # Próximas irrigações
    query_proximas = """
        SELECT nome, proxima_irrigacao, cultura
        FROM Setor
        WHERE proxima_irrigacao > NOW()
        ORDER BY proxima_irrigacao ASC
        LIMIT 5
    """
    
    # Economia total
    query_economia = """
        SELECT SUM(economia) as economia_total
        FROM Zona
    """
    
    irrigadores_result = mysql_db.execute_query(query_irrigadores)
    proximas_result = mysql_db.execute_query(query_proximas)
    economia_result = mysql_db.execute_query(query_economia)
    
    if all(r is not None for r in [irrigadores_result, proximas_result, economia_result]):
        return jsonify({
            "status_irrigadores": irrigadores_result,
            "proximas_irrigacoes": proximas_result,
            "economia_total": economia_result[0]['economia_total'] if economia_result else 0
        }), 200
    else:
        return jsonify({"error": "Erro ao buscar resumo da irrigação"}), 500

@irrigacao_bp.route('/dashboard/ai-summary', methods=['GET'])
def get_ai_summary():
    """Retorna resumo das decisões da IA para o dashboard principal."""
    # Resumo dos cards
    # Resumo dos cards
    query_summary = """
        SELECT
            (SELECT COUNT(*) FROM DecisaoIA WHERE DATE(data_hora) = CURDATE()) as decisionsToday,
            (SELECT SUM(volume_economizado) FROM DecisaoIA WHERE DATE(data_hora) = CURDATE()) as waterSavedToday,
            (SELECT AVG(confianca) FROM DecisaoIA) as averageConfidence
    """

    # Decisões recentes
    query_recent = """
        SELECT
            d.ID_decisao as id,
            TIME_FORMAT(d.data_hora, '%H:%i') as timestamp,
            z.nome as zone,
            d.descricao as decision,
            d.confianca as confidence,
            d.tipo as reasoning,
            CASE
                WHEN d.tipo = 'Otimização' THEN 'success'
                WHEN d.tipo = 'Economia' THEN 'success'
                WHEN d.tipo = 'Prevenção' THEN 'pending'
                WHEN d.tipo = 'Alerta' THEN 'warning'
                ELSE 'pending'
            END as outcome,
            d.volume_economizado as waterSaved
        FROM DecisaoIA d
        JOIN Zona z ON d.ID_zona_fk = z.ID_zona
        ORDER BY d.data_hora DESC
        LIMIT 4
    """

    summary_result = mysql_db.execute_query(query_summary)
    recent_result = mysql_db.execute_query(query_recent)

    if summary_result is not None and recent_result is not None:
        # Formata os dados para o frontend
        summary = summary_result[0] if summary_result else {
            'decisionsToday': 0, 'waterSavedToday': 0, 'averageConfidence': 0
        }
        summary['waterSavedToday'] = int(summary.get('waterSavedToday') or 0)
        summary['averageConfidence'] = round(float(summary.get('averageConfidence') or 0), 1)

        return jsonify({
            "summary": summary,
            "recentDecisions": recent_result
        }), 200
    else:
        return jsonify({"error": "Erro ao buscar resumo da IA"}), 500

@irrigacao_bp.route('/dashboard/farm-stats', methods=['GET'])
def get_farm_stats():
    """Retorna estatísticas gerais da fazenda para o dashboard principal."""
    query = """
        SELECT
            (SELECT COUNT(*) FROM Irrigador WHERE status_ = 'Ativo') as activeIrrigators,
            (SELECT COUNT(*) FROM Irrigador) as totalIrrigators,
            (SELECT AVG(C.eficiencia) FROM Cultura C) as waterEfficiency,
            (SELECT COUNT(*) FROM Cultura WHERE statusIA = 'Aprendendo') as learningCultures,
            (SELECT SUM(Z.area) FROM Zona Z) as totalCoverage
    """
    result = mysql_db.execute_query(query)

    if result is None or not result:
        return jsonify({"error": "Erro ao buscar estatísticas da fazenda"}), 500

    stats = result[0]
    
    response_data = {
        "activeIrrigators": {
            "value": int(stats.get('activeIrrigators') or 0),
            "unit": f"/{int(stats.get('totalIrrigators') or 0)}"
        },
        "waterEfficiency": {
            "value": round(float(stats.get('waterEfficiency') or 0), 1),
            "unit": "%"
        },
        "learningCultures": {
            "value": int(stats.get('learningCultures') or 0),
            "unit": " culturas"
        },
        "totalCoverage": {
            "value": round(float(stats.get('totalCoverage') or 0), 1),
            "unit": " hectares"
        }
    }

    return jsonify(response_data), 200

@irrigacao_bp.route('/dashboard/irrigators-summary', methods=['GET'])
def get_irrigators_summary():
    """Busca um resumo dos irrigadores para o dashboard."""
    query = """
        SELECT 
            I.ID_irrigador as id,
            CONCAT('Irrigador ', I.nome) as name,
            S.cultura as culture,
            Z.nome as zone,
            C.statusIA as aiStatus,
            C.eficiencia as efficiency
        FROM Irrigador I
        JOIN Zona Z ON I.ID_zona_fk = Z.ID_zona
        LEFT JOIN Setor S ON Z.ID_propriedade_fk = S.ID_propriedade_fk AND Z.nome LIKE CONCAT('%', S.cultura, '%')
        LEFT JOIN Cultura C ON S.ID_setor = C.ID_setor_fk
        ORDER BY I.ID_irrigador
        LIMIT 3;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar resumo dos irrigadores"}), 500

    # Formatação para o frontend
    for row in result:
        row['aiStatus'] = row.get('aiStatus') or 'Básico'
        row['efficiency'] = f"{row.get('efficiency') or 0}%"
        # Mock de dados não presentes no banco para manter a UI
        row['lastDecision'] = "Analisando dados..."
        row['nextAction'] = "Aguardando IA"

    return jsonify(result), 200

@irrigacao_bp.route('/irrigators/summary-stats', methods=['GET'])
def get_irrigators_summary_stats():
    """Retorna estatísticas de resumo para a página de Irrigadores."""
    query = """
        SELECT
            (SELECT COUNT(*) FROM Irrigador WHERE status_ = 'Ativo') as activeIrrigators,
            (SELECT COUNT(*) FROM Irrigador) as totalIrrigators,
            (SELECT AVG(C.eficiencia) FROM Cultura C JOIN Setor S ON C.ID_setor_fk = S.ID_setor JOIN Zona Z ON S.ID_propriedade_fk = Z.ID_propriedade_fk JOIN Irrigador I ON Z.ID_zona = I.ID_zona_fk WHERE I.status_ = 'Ativo') as averageEfficiency,
            (SELECT SUM(Z.area) FROM Zona Z JOIN Irrigador I ON Z.ID_zona = I.ID_zona_fk WHERE I.status_ = 'Ativo') as totalCoverage,
            (SELECT SUM(C.economia) FROM Cultura C JOIN Setor S ON C.ID_setor_fk = S.ID_setor JOIN Zona Z ON S.ID_propriedade_fk = Z.ID_propriedade_fk JOIN Irrigador I ON Z.ID_zona = I.ID_zona_fk WHERE I.status_ = 'Ativo') as weeklySavings,
            (SELECT AVG(confianca) FROM DecisaoIA) as averageConfidence
    """
    result = mysql_db.execute_query(query)

    if result is None or not result:
        return jsonify({"error": "Erro ao buscar estatísticas dos irrigadores"}), 500

    stats = result[0]

    response_data = {
        "activeIrrigators": int(stats.get('activeIrrigators') or 0),
        "totalIrrigators": int(stats.get('totalIrrigators') or 0),
        "averageEfficiency": round(float(stats.get('averageEfficiency') or 0), 1),
        "totalCoverage": round(float(stats.get('totalCoverage') or 0), 1),
        "weeklySavings": int(stats.get('weeklySavings') or 0),
        "averageConfidence": round(float(stats.get('averageConfidence') or 0), 1)
    }

    return jsonify(response_data), 200

@irrigacao_bp.route('/irrigators/details', methods=['GET'])
def get_irrigators_details():
    """Busca detalhes de todos os irrigadores para a página de Sensores."""
    query = """
        SELECT 
            I.ID_irrigador as id,
            CONCAT('Irrigador Inteligente ', I.nome) as name,
            Z.nome as zone,
            S.cultura as culture,
            I.status_ as status,
            C.statusIA as aiStatus,
            C.eficiencia as efficiency,
            Z.area as coverage,
            C.padroes_ml as patternsLearned,
            C.economia as waterSaved,
            (SELECT valor_medicao FROM Medicao M JOIN Sensor SN ON M.ID_sensor_fk = SN.ID_sensor WHERE SN.tipo = 'Umidade' AND M.ID_zona_fk = I.ID_zona_fk ORDER BY M.data_hora DESC LIMIT 1) as soilMoisture
        FROM Irrigador I
        JOIN Zona Z ON I.ID_zona_fk = Z.ID_zona
        LEFT JOIN Setor S ON Z.ID_propriedade_fk = S.ID_propriedade_fk AND Z.nome LIKE CONCAT('%', S.cultura, '%')
        LEFT JOIN Cultura C ON S.ID_setor = C.ID_setor_fk
        ORDER BY I.ID_irrigador;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar detalhes dos irrigadores"}), 500

    # Formatação e adição de dados mockados para manter a UI
    for row in result:
        # Mapeia o status do irrigador para o status da IA exibido
        if row['status'] == 'Manutenção':
            row['aiStatus'] = 'Manutenção'
            row['efficiency'] = 0
            row['soilMoisture'] = 'N/A'
        else:
            row['aiStatus'] = row.get('aiStatus') or 'Básico'
            row['efficiency'] = row.get('efficiency') or 0
            row['soilMoisture'] = f"{int(row.get('soilMoisture') or 60)}%"

        row['efficiency'] = f"{row['efficiency']}%"
        row['coverage'] = f"{row['coverage']} hectares"
        row['patternsLearned'] = int(row.get('patternsLearned') or 0)
        row['waterSaved'] = f"{int(row.get('waterSaved') or 0)}L esta semana"

        # Mock de dados não existentes no banco
        row['battery'] = f"{100 - row['id'] * 5}%" if row['status'] != 'Manutenção' else "15%"
        row['connectivity'] = "Excelente" if row['id'] % 2 != 0 else "Boa"
        if row['status'] == 'Manutenção':
            row['connectivity'] = "Sem sinal"
        
        # Mock de decisão baseado no status
        decisions = {
            "Otimizado": "Irrigação otimizada",
            "Aprendendo": "Aguardou previsão de chuva",
            "Manutenção": "Aguardando manutenção"
        }
        row['lastDecision'] = decisions.get(row['aiStatus'], "Analisando dados")

    return jsonify(result), 200
