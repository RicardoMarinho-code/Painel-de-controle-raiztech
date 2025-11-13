/**
 * CONFIGURAÇÃO DE BANCO DE DADOS - db.ts
 * ---------------------------------------
 * Este arquivo centraliza a lógica de conexão com todos os bancos de dados
 * utilizados pela aplicação (MySQL e MongoDB). Manter essa lógica isolada
 * facilita a manutenção, a reutilização e a configuração do ambiente.
 */

// Importa o driver 'mysql2' com suporte a Promises, que é mais moderno e
// facilita o uso de async/await para queries no banco de dados relacional.
import mysql from 'mysql2/promise';
// Importa a biblioteca 'mongoose', que é um ODM (Object Data Modeling) para MongoDB.
// Ela simplifica a interação com o banco NoSQL, permitindo a definição de schemas e modelos.
import mongoose from 'mongoose';
// Importa a biblioteca 'dotenv' para carregar as variáveis de ambiente.
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente definidas no arquivo .env na raiz do projeto.
// Isso torna as credenciais e outras configurações acessíveis via `process.env`.
dotenv.config();

/**
 * Conexão com o MySQL
 * --------------------
 * Em vez de criar uma nova conexão para cada query, o que é ineficiente,
 * criamos um "pool de conexões". O pool gerencia um conjunto de conexões
 * abertas que podem ser reutilizadas pela aplicação, melhorando a performance
 * e a escalabilidade.
 */
const mysqlPool = mysql.createPool({
  // O host do servidor MySQL (ex: 'localhost' ou um endereço IP).
  host: process.env.DB_HOST,
  // O nome de usuário para autenticação no banco.
  user: process.env.DB_USER,
  // A senha para o usuário do banco.
  password: process.env.DB_PASSWORD,
  // O nome do banco de dados específico a ser utilizado.
  database: process.env.DB_DATABASE,
  // `waitForConnections: true`: Se todas as conexões do pool estiverem em uso,
  // a aplicação aguardará uma conexão ficar livre em vez de retornar um erro imediatamente.
  waitForConnections: true,
  // `connectionLimit`: O número máximo de conexões a serem mantidas no pool.
  connectionLimit: 10,
  // `queueLimit: 0`: Se o limite de conexões for atingido e `waitForConnections` for true,
  // a fila de espera por uma conexão não terá um limite, evitando erros de "fila cheia".
  queueLimit: 0
});

/**
 * Conexão com o MongoDB
 * ---------------------
 * Esta função assíncrona usa o Mongoose para estabelecer a conexão com o MongoDB.
 * A URI de conexão é obtida das variáveis de ambiente.
 */
const connectToMongo = async () => {
  try {
    // Tenta conectar ao MongoDB usando a URI. O `await` garante que a aplicação
    // espere a conclusão desta operação antes de continuar.
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error) {
    // Se a conexão falhar, um erro é capturado e exibido no console.
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    // `process.exit(1)` encerra a aplicação. Isso é uma medida de segurança,
    // pois a aplicação não pode funcionar corretamente sem a conexão com o banco de dados.
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao Mongo
  }
};

// Exporta o pool de conexões do MySQL e a função de conexão do MongoDB
// para que possam ser utilizados em outras partes da aplicação (como no `index.ts`).
export { mysqlPool, connectToMongo };