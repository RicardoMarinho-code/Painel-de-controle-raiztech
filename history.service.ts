import MedicaoLog, { IMedicaoLog } from '../models/MedicaoLog.model';

/**
 * Busca as medições das últimas 24 horas no MongoDB e as agrupa por hora.
 * Esta função substitui a query SQL que fazia o mesmo no MySQL.
 */
async function getCorrelacoes24h() {
  const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 1. Busca todos os logs de medição das últimas 24 horas no MongoDB
  const medicoes: IMedicaoLog[] = await MedicaoLog.find({
    timestamp: { $gte: vinteQuatroHorasAtras }
  }).sort({ timestamp: 'asc' });

  // 2. Processa e agrupa os dados na aplicação (prática comum com NoSQL)
  const medicoesPorHora: { [hour: number]: { [type: string]: number[] } } = {};

  for (const medicao of medicoes) {
    const hour = new Date(medicao.timestamp).getHours();
    if (!medicoesPorHora[hour]) {
      medicoesPorHora[hour] = {};
    }
    if (!medicoesPorHora[hour][medicao.tipo]) {
      medicoesPorHora[hour][medicao.tipo] = [];
    }
    medicoesPorHora[hour][medicao.tipo].push(medicao.valor);
  }

  // 3. Calcula a média para cada tipo de medição e formata a saída
  const resultadoFinal = Object.entries(medicoesPorHora).map(([hour, tipos]) => {
    const medias: { [key: string]: number | null } = {};
    for (const [tipo, valores] of Object.entries(tipos)) {
      const soma = valores.reduce((acc, val) => acc + val, 0);
      medias[tipo.toLowerCase()] = soma / valores.length;
    }
    return {
      hour: parseInt(hour, 10),
      temperature: medias.temperatura || null,
      soilMoisture: medias.umidade || null,
      sunIntensity: medias.luzsolar ? medias.luzsolar / 10 : null, // Ajuste de escala
      ph: medias.ph ? medias.ph * 10 : null, // Ajuste de escala
    };
  });

  return resultadoFinal.sort((a, b) => a.hour - b.hour);
}

export const historyService = {
  getCorrelacoes24h,
};