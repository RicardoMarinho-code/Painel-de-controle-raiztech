import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Mapeia a rota POST /login para a função do controller
router.post('/login', authController.login);

export default router;