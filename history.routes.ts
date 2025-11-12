import { Router } from 'express';
import { historyController } from '../controllers/history.controller';

const router = Router();

// Mapeia a rota GET /correlacoes para a função do controller
router.get('/correlacoes', historyController.getCorrelacoes);

export default router;