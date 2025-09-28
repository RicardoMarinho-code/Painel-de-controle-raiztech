from flask import Blueprint, request, jsonify
from src.database.mysql_config import mysql_db

irrigacao_bp = Blueprint('irrigacao', __name__)

@irrigacao_bp.route('/zonas', methods=['GET'])
def get_zonas():
    """Busca todas as zonas de irrigação"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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
    
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = "UPDATE Irrigador SET status_ = %s WHERE ID_irrigador = %s"
    
    if mysql_db.execute_update(query, (data['status_'], id)):
        return jsonify({"message": "Status do irrigador atualizado com sucesso"}), 200
    else:
        return jsonify({"error": "Erro ao atualizar status do irrigador"}), 500

@irrigacao_bp.route('/setores', methods=['GET'])
def get_setores():
    """Busca todos os setores"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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
    
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
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

