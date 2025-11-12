import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Conexão com o MySQL
 * Cria um pool de conexões para reutilização e melhor performance.
 */
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Conexão com o MongoDB
 * Utiliza Mongoose para gerenciar a conexão.
 */
const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao Mongo
  }
};

export { mysqlPool, connectToMongo };