from flask import Blueprint, request, jsonify
from src.database.mysql_config import mysql_db

agricultor_bp = Blueprint('agricultor', __name__)

@agricultor_bp.route('/agricultores', methods=['GET'])
def get_agricultores():
    """Busca todos os agricultores"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = "SELECT * FROM Agricultor"
    result = mysql_db.execute_query(query)
    
    if result is not None:
        return jsonify(result), 200
    else:
        return jsonify({"error": "Erro ao buscar agricultores"}), 500

@agricultor_bp.route('/agricultores/<int:id>', methods=['GET'])
def get_agricultor(id):
    """Busca um agricultor específico"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = "SELECT * FROM Agricultor WHERE ID_agricultor = %s"
    result = mysql_db.execute_query(query, (id,))
    
    if result:
        return jsonify(result[0]), 200
    else:
        return jsonify({"error": "Agricultor não encontrado"}), 404

@agricultor_bp.route('/agricultores', methods=['POST'])
def create_agricultor():
    """Cria um novo agricultor"""
    data = request.get_json()
    
    if not all(key in data for key in ['nome', 'CPF', 'data_nascimento', 'telefones_de_conato']):
        return jsonify({"error": "Dados obrigatórios faltando"}), 400
    
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    query = """
        INSERT INTO Agricultor (nome, CPF, data_nascimento, telefones_de_conato) 
        VALUES (%s, %s, %s, %s)
    """
    params = (data['nome'], data['CPF'], data['data_nascimento'], data['telefones_de_conato'])
    
    if mysql_db.execute_update(query, params):
        return jsonify({"message": "Agricultor criado com sucesso"}), 201
    else:
        return jsonify({"error": "Erro ao criar agricultor"}), 500

@agricultor_bp.route('/agricultores/<int:id>', methods=['PUT'])
def update_agricultor(id):
    """Atualiza um agricultor existente"""
    data = request.get_json()
    
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    # Verifica se o agricultor existe
    check_query = "SELECT ID_agricultor FROM Agricultor WHERE ID_agricultor = %s"
    if not mysql_db.execute_query(check_query, (id,)):
        return jsonify({"error": "Agricultor não encontrado"}), 404
    
    # Constrói a query de update dinamicamente
    update_fields = []
    params = []
    
    for field in ['nome', 'CPF', 'data_nascimento', 'telefones_de_conato']:
        if field in data:
            update_fields.append(f"{field} = %s")
            params.append(data[field])
    
    if not update_fields:
        return jsonify({"error": "Nenhum campo para atualizar"}), 400
    
    params.append(id)
    query = f"UPDATE Agricultor SET {', '.join(update_fields)} WHERE ID_agricultor = %s"
    
    if mysql_db.execute_update(query, params):
        return jsonify({"message": "Agricultor atualizado com sucesso"}), 200
    else:
        return jsonify({"error": "Erro ao atualizar agricultor"}), 500

@agricultor_bp.route('/agricultores/<int:id>', methods=['DELETE'])
def delete_agricultor(id):
    """Remove um agricultor"""
    if not mysql_db.connection or not mysql_db.connection.is_connected():
        mysql_db.connect()
    
    # Verifica se o agricultor existe
    check_query = "SELECT ID_agricultor FROM Agricultor WHERE ID_agricultor = %s"
    if not mysql_db.execute_query(check_query, (id,)):
        return jsonify({"error": "Agricultor não encontrado"}), 404
    
    query = "DELETE FROM Agricultor WHERE ID_agricultor = %s"
    
    if mysql_db.execute_update(query, (id,)):
        return jsonify({"message": "Agricultor removido com sucesso"}), 200
    else:
        return jsonify({"error": "Erro ao remover agricultor"}), 500

