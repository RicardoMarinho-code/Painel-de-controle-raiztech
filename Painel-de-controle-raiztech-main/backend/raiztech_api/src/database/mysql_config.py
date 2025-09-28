import mysql.connector
from mysql.connector import Error
import os

class MySQLConnection:
    def __init__(self):
        self.host = os.getenv('MYSQL_HOST', 'localhost')
        self.database = os.getenv('MYSQL_DATABASE', 'AgroTech')
        self.user = os.getenv('MYSQL_USER', 'root')
        self.password = os.getenv('MYSQL_PASSWORD', '')
        self.port = os.getenv('MYSQL_PORT', 3306)
        self.connection = None

    def connect(self):
        """Estabelece conexão com o banco MySQL"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password,
                port=self.port,
                autocommit=True
            )
            if self.connection.is_connected():
                print(f"Conectado ao MySQL Server versão {self.connection.get_server_info()}")
                return True
        except Error as e:
            print(f"Erro ao conectar ao MySQL: {e}")
            return False

    def disconnect(self):
        """Fecha a conexão com o banco"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Conexão MySQL fechada")

    def execute_query(self, query, params=None):
        """Executa uma query SELECT e retorna os resultados"""
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params)
            result = cursor.fetchall()
            cursor.close()
            return result
        except Error as e:
            print(f"Erro ao executar query: {e}")
            return None

    def execute_update(self, query, params=None):
        """Executa queries INSERT, UPDATE, DELETE"""
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            cursor.close()
            return True
        except Error as e:
            print(f"Erro ao executar update: {e}")
            return False

# Instância global da conexão
mysql_db = MySQLConnection()

