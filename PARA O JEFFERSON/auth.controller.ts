import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const { token, userName } = await authService.login(email, password);
    res.status(200).json({ token, userName });
  } catch (error: any) {
    // Diferencia erros de "não encontrado/senha errada" de erros internos
    res.status(401).json({ message: error.message || 'Credenciais inválidas' });
  }
}

export const authController = {
  login,
};