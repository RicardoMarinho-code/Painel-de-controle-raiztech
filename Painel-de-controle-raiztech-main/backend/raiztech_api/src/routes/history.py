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
    query = """
        SELECT 
            DIA.ID_decisao, 
            DIA.data_hora, 
            Z.nome AS zone_name, 
            DIA.descricao AS decision_description, 
            DIA.confianca, 
            DIA.volume_economizado
        FROM DecisaoIA DIA
        JOIN Zona Z ON DIA.ID_zona_fk = Z.ID_zona
        ORDER BY DIA.data_hora DESC
        LIMIT 5;
    """
    result = mysql_db.execute_query(query)

    if result is None:
        return jsonify({"error": "Erro ao buscar dados de fluxo de decisão da IA"}), 500

    decision_flow_data = []
    for row in result:
        # Para simplificar, os dados ambientais (waterLevel, isRaining, etc.)
        # serão mockados aqui, pois buscar o contexto exato de sensores para cada
        # decisão passada exigiria uma lógica de consulta mais complexa.
        decision_flow_data.append({
            "time": row['data_hora'].strftime('%H:%M'),
            "waterLevel": 70,
            "isRaining": False,
            "soilMoisture": 60,
            "ph": 6.5,
            "temperature": 25,
            "sunIntensity": 50,
            "decision": row['decision_description'],
            "duration": 30
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
        LEFT JOIN Cultura c ON z.ID_zona = c.ID_setor_fk -- Simplificando a lógica de JOIN
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