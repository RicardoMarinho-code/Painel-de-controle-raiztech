import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
//import { connectToMongo } from './config/db';
import { mysqlPool, connectToMongo } from './config/db';
import historyRoutes from './routes/history.routes';
import authRoutes from './routes/auth.routes'; // Importa as rotas de autenticação

const app: Express = express();
const port = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors()); // Permite requisições de origens diferentes (nosso frontend)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de "health check" para verificar se a API está no ar
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Configuração das rotas da API
app.use('/api/historico', historyRoutes);
app.use('/api/auth', authRoutes); // Usa o roteador para /api/auth

/**
 * Função principal para iniciar o servidor.
 * Primeiro conecta ao banco de dados e depois sobe o servidor Express.
 */
const startServer = async () => {
  await connectToMongo(); // Conecta ao MongoDB ANTES de iniciar o servidor

  app.listen(port, () => {
    console.log(`🚀 Servidor da API (TypeScript) rodando em http://localhost:${port}`);
  });
};

// Inicia a aplicação
startServer();
