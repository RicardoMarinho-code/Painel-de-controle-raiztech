/**
 * ROTEADOR DE HISTÓRICO - history.routes.ts
 * ------------------------------------------
 * Este arquivo define um "roteador" do Express. A ideia de usar roteadores
 * é modularizar a aplicação. Em vez de declarar todas as rotas no arquivo
 * principal (`index.ts`), nós as agrupamos por funcionalidade.
 *
 * Este roteador lida com todas as rotas sob o prefixo `/api/historico`.
 */

// Importa o construtor `Router` do Express para criar um novo objeto de roteador.
import { Router } from 'express';
// Importa o objeto `historyController` que contém as funções lógicas para cada rota.
import { historyController } from '../controllers/history.controller';

// Cria uma nova instância do roteador.
const router = Router();

// Define uma rota `GET` para o caminho `/correlacoes`.
// Quando uma requisição `GET` chegar em `/api/historico/correlacoes` (o prefixo é definido em `index.ts`),
// o Express irá invocar a função `historyController.getCorrelacoes`.
router.get('/correlacoes', historyController.getCorrelacoes);

// Exporta o roteador configurado para que ele possa ser importado e usado no arquivo principal da aplicação.
export default router;