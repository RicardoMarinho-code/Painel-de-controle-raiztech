from flask import Blueprint, request, jsonify
from src.database.mysql_config import mysql_db

sensores_bp = Blueprint('sensores', __name__)

@sensores_bp.route('/sensores', methods=['GET'])
def get_sensores():
    """Busca todos os sensores"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = """
        SELECT s.*, p.nome as propriedade_nome 
        FROM Sensor s 
        JOIN PropriedadeRural p ON s.ID_PropriedadeRural_fk = p.ID_propriedade
    """
    result = mysql_db.execute_query(query)
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar sensores"}), 500

@sensores_bp.route('/sensores/<int:id>/medicoes', methods=['GET'])
def get_medicoes_sensor(id):
    """Busca medições de um sensor específico"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    # Parâmetros de paginação e filtro
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    query = """
        SELECT m.*, s.tipo as sensor_tipo, s.fabricante
        FROM Medicao m 
        JOIN Sensor s ON m.ID_sensor_fk = s.ID_sensor
        WHERE m.ID_sensor_fk = %s
        ORDER BY m.data_hora DESC
        LIMIT %s OFFSET %s
    """
    result = mysql_db.execute_query(query, (id, limit, offset))
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar medições"}), 500

@sensores_bp.route('/medicoes', methods=['POST'])
def create_medicao():
    """Cria uma nova medição"""
    data = request.get_json()
    
    required_fields = ['ID_sensor_fk', 'ID_propriedade_fk', 'valor_medicao']
    if not all(key in data for key in required_fields):
        return jsonify({"error": "Dados obrigatórios faltando"}), 400
    
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = """
        INSERT INTO Medicao (data_hora, valor_medicao, ID_sensor_fk, ID_propriedade_fk) 
        VALUES (NOW(), %s, %s, %s)
    """
    params = (data['valor_medicao'], data['ID_sensor_fk'], data['ID_propriedade_fk'])
    
    if mysql_db.execute_update(query, params):
        return jsonify({"message": "Medição criada com sucesso"}), 201
    else:
        return jsonify({"error": "Erro ao criar medição"}), 500

@sensores_bp.route('/sensores/tipos/<tipo>/medicoes-recentes', methods=['GET'])
def get_medicoes_recentes_por_tipo(tipo):
    """Busca medições mais recentes por tipo de sensor"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = """
        SELECT m.*, s.fabricante, p.nome as propriedade_nome
        FROM Medicao m
        JOIN Sensor s ON m.ID_sensor_fk = s.ID_sensor
        JOIN PropriedadeRural p ON m.ID_propriedade_fk = p.ID_propriedade
        WHERE s.tipo = %s
        AND m.data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ORDER BY m.data_hora DESC
    """
    result = mysql_db.execute_query(query, (tipo,))
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar medições"}), 500

@sensores_bp.route('/dashboard/sensores-resumo', methods=['GET'])
def get_sensores_resumo():
    """Retorna resumo dos sensores para dashboard"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    # Conta sensores por tipo
    query_tipos = """
        SELECT tipo, COUNT(*) as quantidade
        FROM Sensor
        GROUP BY tipo
    """
    
    # Últimas medições por tipo
    query_ultimas = """
        SELECT s.tipo, 
               AVG(m.valor_medicao) as valor_medio,
               MAX(m.data_hora) as ultima_medicao
        FROM Sensor s
        LEFT JOIN Medicao m ON s.ID_sensor = m.ID_sensor_fk
        WHERE m.data_hora >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        GROUP BY s.tipo
    """
    
    tipos_result = mysql_db.execute_query(query_tipos)
    ultimas_result = mysql_db.execute_query(query_ultimas)
    
    if tipos_result is not None and ultimas_result is not None:
        return jsonify({
            "sensores_por_tipo": tipos_result,
            "ultimas_medicoes": ultimas_result
        }), 200
    else:
        return jsonify({"error": "Erro ao buscar resumo dos sensores"}), 500

