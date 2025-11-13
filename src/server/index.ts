/**
 * ARQUIVO DE ENTRADA PRINCIPAL DA API (BACKEND)
 * ---------------------------------------------
 * Este arquivo é o ponto de partida do servidor. Ele configura e inicia
 * a aplicação Express, estabelece a conexão com os bancos de dados e
 * define as rotas que o frontend irá consumir.
 */

// Importa a biblioteca 'dotenv' para carregar variáveis de ambiente de um arquivo .env.
// Isso permite configurar dados sensíveis (como senhas de banco) fora do código-fonte.
import dotenv from 'dotenv';

// Importa o framework 'express', que é a base para criar o servidor e gerenciar as rotas da API.
import express, { Express, Request, Response } from 'express';

// Importa a biblioteca 'cors' para habilitar o Cross-Origin Resource Sharing (CORS).
// É essencial para permitir que o frontend (rodando em http://localhost:8080)
// possa fazer requisições para esta API (rodando em http://localhost:3001).
import cors from 'cors';

// Importa as funções de conexão com os bancos de dados (MySQL e MongoDB) do arquivo de configuração.
// Esta é uma boa prática para centralizar a lógica de banco de dados.
import { mysqlPool, connectToMongo } from './config/db';

// Importa os roteadores que contêm as lógicas para cada conjunto de endpoints da API.
import historyRoutes from './routes/history.routes';
import authRoutes from './routes/auth.routes';

// Executa a função config() do dotenv para carregar as variáveis do arquivo .env para 'process.env'.
// Deve ser chamado o mais cedo possível no código.
dotenv.config();

// Cria a instância principal da aplicação Express, que será usada para configurar o servidor.
const app: Express = express();

// Define a porta do servidor. Ele busca a variável de ambiente 'PORT' e, se não encontrar,
// usa a porta 3001 como padrão. Isso torna a aplicação flexível para ambientes de produção.
const port = process.env.PORT || 3001;

// --- CONFIGURAÇÃO DE MIDDLEWARES ---
// Middlewares são funções que executam em todas ou em algumas requisições antes de chegarem às rotas finais.

// Habilita o middleware do CORS para todas as rotas, permitindo requisições de outras origens.
app.use(cors());

// Habilita o middleware nativo do Express para interpretar corpos de requisição no formato JSON.
// Isso é crucial para receber dados em requisições POST e PUT.
app.use(express.json());

// --- ROTAS DA APLICAÇÃO ---

// Rota de "health check": um endpoint simples para verificar se a API está online e respondendo.
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Direciona todas as requisições que começam com '/api/historico' para o roteador 'historyRoutes'.
app.use('/api/historico', historyRoutes);
// Direciona todas as requisições que começam com '/api/auth' para o roteador 'authRoutes'.
app.use('/api/auth', authRoutes);

/**
 * Função principal assíncrona para iniciar o servidor.
 * A abordagem 'async' é usada aqui para garantir que a conexão com o banco de dados
 * seja estabelecida com sucesso ANTES que o servidor comece a aceitar requisições.
 */
const startServer = async () => {
  try {
    // Tenta conectar ao MongoDB. O 'await' pausa a execução aqui até que a conexão seja concluída ou falhe.
    await connectToMongo();
    // A conexão com o pool do MySQL ('mysqlPool') geralmente não precisa de uma chamada de conexão explícita aqui,
    // pois o pool gerencia as conexões conforme elas são requisitadas.

    // Após conectar ao banco, o servidor Express começa a "escutar" por requisições na porta definida.
    app.listen(port, () => {
      console.log(`🚀 Servidor da API (TypeScript) rodando em http://localhost:${port}`);
    });

  } catch (error) {
    // Se a conexão com o banco de dados falhar, o erro é capturado aqui.
    console.error("❌ Falha ao iniciar o servidor. Não foi possível conectar ao banco de dados.", error);
    // O 'process.exit(1)' encerra a aplicação, pois ela não pode funcionar sem o banco de dados.
    process.exit(1);
  }
};

// Chama a função principal para iniciar todo o processo.
startServer();
