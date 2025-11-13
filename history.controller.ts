/**
 * CONTROLLER DE HISTÓRICO - history.controller.ts
 * ------------------------------------------------
 * O "Controller" é a camada responsável por intermediar a comunicação entre
 * o cliente (que faz a requisição HTTP) e a lógica de negócio da aplicação (o "Service").
 *
 * Suas principais responsabilidades são:
 * 1. Receber e extrair dados da requisição (`req`), como parâmetros de URL, query strings ou corpo da requisição.
 * 2. Chamar a função apropriada no "Service" para executar a lógica de negócio.
 * 3. Lidar com a resposta (`res`), enviando de volta ao cliente os dados obtidos do service ou uma mensagem de erro.
 * 4. Tratar erros que possam ocorrer durante o processo e retornar um status HTTP apropriado.
 */

// Importa os tipos `Request` e `Response` do Express para tipagem.
import { Request, Response } from 'express';
// Importa o `historyService`, que contém a lógica de negócio real.
import { historyService } from '../services/history.service';

/**
 * Função `getCorrelacoes`
 *
 * Responsável por lidar com a requisição `GET /api/historico/correlacoes`.
 * Ela chama o serviço para buscar e processar os dados de correlação das últimas 24 horas
 * e os retorna como uma resposta JSON.
 */
async function getCorrelacoes(req: Request, res: Response) {
  try {
    // Chama a função `getCorrelacoes24h` do serviço. O `await` aguarda a conclusão da busca e processamento dos dados.
    const correlacoes = await historyService.getCorrelacoes24h();
    // Se a operação for bem-sucedida, envia uma resposta com status 200 (OK) e os dados em formato JSON.
    res.status(200).json(correlacoes);
  } catch (error) {
    // Se ocorrer qualquer erro no bloco `try` (seja no service ou em outro lugar), ele é capturado aqui.
    console.error('Erro no controller ao buscar correlações:', error);
    // Envia uma resposta de erro genérica com status 500 (Internal Server Error) para o cliente.
    // É uma boa prática não expor detalhes do erro ao cliente em produção.
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

// Exporta um objeto contendo todas as funções do controller para serem usadas pelo roteador.
export const historyController = {
  getCorrelacoes,
};