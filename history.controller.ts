import { Request, Response } from 'express';
import { historyService } from '../services/history.service';

async function getCorrelacoes(req: Request, res: Response) {
  try {
    const correlacoes = await historyService.getCorrelacoes24h();
    res.status(200).json(correlacoes);
  } catch (error) {
    console.error('Erro no controller ao buscar correlações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export const historyController = {
  getCorrelacoes,
};