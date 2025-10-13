import dotenv from 'dotenv';
// Carrega as variáveis de ambiente do arquivo .env ANTES de tudo.
dotenv.config();

import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const port = 3001; // Porta que a API vai rodar

app.use(cors()); // Permite que o frontend (em outra porta) acesse a API
app.use(express.json()); // Permite que a API entenda JSON

//Rota para buscar as decisões da IA.
app.get('/api/decisoes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.ID_decisao as id,
        i.nome as irrigator,
        z.nome as zone,
        d.tipo as decision,
        d.descricao as reason,
        TIME_FORMAT(d.data_hora, '%H:%i') as time,
        d.confianca as confidence,
        d.volume_economizado as waterSaved,
        'scheduled' as status, -- Status fixo por enquanto, pode ser melhorado
        c.statusIA as aiModel
      FROM DecisaoIA d
      JOIN Zona z ON d.ID_zona_fk = z.ID_zona
      JOIN Irrigador i ON i.ID_zona_fk = z.ID_zona
      JOIN Setor s ON s.ID_propriedade_fk = z.ID_propriedade_fk
      JOIN Cultura c ON c.ID_setor_fk = s.ID_setor
      ORDER BY d.data_hora DESC
      LIMIT 10;
    `);

    // Formata os dados para o frontend
    const formattedRows = rows.map(row => ({
      ...row,
      confidence: `${row.confidence}%`,
      waterSaved: `${row.waterSaved}L`
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Erro ao buscar decisões da IA:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar o histórico de medições para o gráfico de correlações.
 * Agrupa as medições das últimas 24 horas por tipo de sensor.
 */
app.get('/api/historico/correlacoes', async (req, res) => {
  try {
    // Esta query é um bom exemplo de como pivotar dados no SQL.
    const [rows] = await pool.query(`
      SELECT 
        HOUR(m.data_hora) as hour,
        AVG(CASE WHEN s.tipo = 'Temperatura' THEN m.valor_medicao ELSE NULL END) as temperature,
        AVG(CASE WHEN s.tipo = 'Umidade' THEN m.valor_medicao ELSE NULL END) as soilMoisture,
        AVG(CASE WHEN s.tipo = 'LuzSolar' THEN m.valor_medicao / 10 ELSE NULL END) as sunIntensity, -- Ajustando escala para o gráfico
        AVG(CASE WHEN s.tipo = 'pH' THEN m.valor_medicao * 10 ELSE NULL END) as ph -- Ajustando escala para o gráfico
      FROM Medicao m
      JOIN Sensor s ON m.ID_sensor_fk = s.ID_sensor
      WHERE m.data_hora >= NOW() - INTERVAL 24 HOUR
      GROUP BY HOUR(m.data_hora)
      ORDER BY hour;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar correlações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar o total de medições (registros) no banco.
 */
app.get('/api/historico/registros', async (req, res) => {
  try {
    // Usamos COUNT(*) para uma contagem eficiente.
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM Medicao');
    // Formata o número para o padrão brasileiro (ex: 1.234)
    const formattedTotal = new Intl.NumberFormat('pt-BR').format(total);
    res.json({ total: formattedTotal });
  } catch (error) {
    console.error('Erro ao buscar total de registros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar o status e a contagem dos sensores por tipo.
 */
app.get('/api/historico/status-sensores', async (req, res) => {
  try {
    // Agrupa os sensores por tipo e conta quantos existem de cada.
    const [rows] = await pool.query(`
      SELECT 
        tipo, 
        COUNT(*) as count 
      FROM Sensor 
      GROUP BY tipo
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar status dos sensores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar os dados para o Centro de Decisões da IA.
 * Retorna as decisões recentes e estatísticas do dia.
 */
app.get('/api/decisoes/centro', async (req, res) => {
  try {
    // Busca as 4 decisões mais recentes
    const [recentDecisions] = await pool.query(`
      SELECT
        ID_decisao as id,
        TIME_FORMAT(data_hora, '%H:%i') as timestamp,
        z.nome as zone,
        tipo as decision,
        confianca as confidence,
        descricao as reasoning,
        CASE
          WHEN tipo = 'Alerta' THEN 'warning'
          WHEN volume_economizado > 0 THEN 'success'
          ELSE 'pending'
        END as outcome,
        volume_economizado as waterSaved
      FROM DecisaoIA
      JOIN Zona z ON DecisaoIA.ID_zona_fk = z.ID_zona
      ORDER BY data_hora DESC
      LIMIT 4;
    `);

    // Busca as estatísticas do dia
    const [[stats]] = await pool.query(`
      SELECT
        COUNT(*) as totalDecisions,
        SUM(volume_economizado) as totalWaterSaved,
        AVG(confianca) as averageConfidence
      FROM DecisaoIA
      WHERE DATE(data_hora) = CURDATE();
    `);

    // Formata os dados para o frontend
    const formattedDecisions = recentDecisions.map(d => ({
      ...d,
      waterSaved: d.waterSaved > 0 ? `${d.waterSaved}L` : undefined,
    }));

    res.json({ recentDecisions: formattedDecisions, stats });
  } catch (error) {
    console.error('Erro ao buscar dados do centro de decisões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar as estatísticas principais do Dashboard (Index.tsx).
 * Executa várias consultas para agregar os dados.
 */
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Usamos Promise.all para executar todas as consultas em paralelo
    const [
      [[irrigatorsStats]],
      [[efficiencyStats]],
      [[learningStats]],
      [[coverageStats]]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as total, (SELECT COUNT(*) FROM Irrigador WHERE status_ != 'Manutenção') as active FROM Irrigador;"),
      pool.query("SELECT AVG(eficiencia_hidrica) as avgEfficiency FROM Irrigador WHERE status_ != 'Manutenção';"),
      pool.query("SELECT COUNT(*) as learningCultures FROM Cultura WHERE statusIA = 'Aprendendo';"),
      pool.query("SELECT SUM(hectares) as totalCoverage FROM Zona;")
    ]);

    res.json({
      irrigators: {
        active: irrigatorsStats.active,
        total: irrigatorsStats.total,
      },
      efficiency: efficiencyStats.avgEfficiency,
      learningCultures: learningStats.learningCultures,
      coverage: coverageStats.totalCoverage,
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar o status dos irrigadores para o Dashboard (Index.tsx).
 */
app.get('/api/dashboard/irrigators-status', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.ID_irrigador as id,
        i.nome as name,
        c.nome as culture,
        z.nome as zone,
        cu.statusIA as aiStatus,
        i.eficiencia_hidrica as efficiency,
        (SELECT descricao FROM DecisaoIA WHERE ID_zona_fk = z.ID_zona ORDER BY data_hora DESC LIMIT 1) as lastDecision,
        s.proxima_irrigacao as nextAction,
        s.umidade_atual as soilMoisture,
        z.hectares as coverage
      FROM Irrigador i
      JOIN Zona z ON i.ID_zona_fk = z.ID_zona
      JOIN Setor s ON z.ID_propriedade_fk = s.ID_propriedade_fk
      JOIN Cultura cu ON s.ID_setor_fk = cu.ID_setor
      JOIN Cultura c ON s.ID_setor_fk = c.ID_setor_fk
      GROUP BY i.ID_irrigador
      LIMIT 3;
    `);

    // Formata os dados para o frontend
    const formattedRows = rows.map(row => ({
      ...row,
      efficiency: `${row.efficiency}%`,
      nextAction: `Irrigação programada ${new Date(row.nextAction).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      soilMoisture: `${row.soilMoisture}%`,
      coverage: `${row.coverage} hectares`
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Erro ao buscar status dos irrigadores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar os dados para a página de Relatórios (Reports.tsx)
 */
app.get('/api/reports/stats', async (req, res) => {
  try {
    const [
      [[patterns]],
      [[efficiency]],
      [[economy]],
      [[precision]]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as value FROM Cultura WHERE statusIA != 'Aprendendo';"),
      pool.query("SELECT AVG(eficiencia_hidrica) as value FROM Irrigador WHERE status_ = 'Ativo';"),
      pool.query("SELECT SUM(economia) as value FROM Zona;"),
      pool.query("SELECT AVG(confianca) as value FROM DecisaoIA;")
    ]);

    res.json({
      patternsLearned: patterns.value,
      avgEfficiency: efficiency.value,
      monthlySavings: economy.value, // Simplificação, idealmente seria filtrado por mês
      decisionPrecision: precision.value
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas dos relatórios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/reports/culture-analysis', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.nome as culture,
        (SELECT COUNT(*) FROM Irrigador i JOIN Zona z ON i.ID_zona_fk = z.ID_zona JOIN Setor s ON z.ID_propriedade_fk = s.ID_propriedade_fk WHERE s.ID_setor = c.ID_setor_fk) as irrigators,
        c.padroes_ml as patternsLearned,
        c.eficiencia as efficiency,
        c.economia as waterSaved,
        c.statusIA as aiStatus
      FROM Cultura c
      ORDER BY c.eficiencia DESC;
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      efficiency: `${parseFloat(row.efficiency).toFixed(1)}%`,
      waterSaved: `${parseFloat(row.waterSaved).toFixed(0)}L`
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('Erro ao buscar análise de culturas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/reports/learning-evolution', async (req, res) => {
  try {
    // Query de exemplo para evolução. No mundo real, seria mais complexa,
    // talvez agregando dados mensais de uma tabela de histórico.
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(data_hora, '%Y-%m') as month,
        COUNT(DISTINCT ID_decisao) as 'Padrões',
        AVG(confianca) as 'Eficiência (%)'
      FROM DecisaoIA
      GROUP BY month
      ORDER BY month ASC
      LIMIT 6;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar evolução do aprendizado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar as estatísticas da página de Irrigadores (Sensors.tsx)
 */
app.get('/api/sensors/stats', async (req, res) => {
  try {
    const [
      [[{ active, total }]],
      [[{ avgEfficiency }]],
      [[{ totalCoverage }]],
      [[{ weeklySavings }]],
      [[{ avgConfidence }]]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as total, SUM(CASE WHEN status_ = 'Ativo' THEN 1 ELSE 0 END) as active FROM Irrigador;"),
      pool.query("SELECT AVG(eficiencia_hidrica) as avgEfficiency FROM Irrigador WHERE status_ = 'Ativo';"),
      pool.query("SELECT SUM(hectares) as totalCoverage FROM Zona z JOIN Irrigador i ON i.ID_zona_fk = z.ID_zona WHERE i.status_ = 'Ativo';"),
      pool.query("SELECT SUM(volume_economizado) as weeklySavings FROM DecisaoIA WHERE data_hora >= NOW() - INTERVAL 7 DAY;"),
      pool.query("SELECT AVG(confianca) as avgConfidence FROM DecisaoIA WHERE data_hora >= NOW() - INTERVAL 7 DAY;")
    ]);

    res.json({
      activeIrrigators: active,
      totalIrrigators: total,
      avgEfficiency: avgEfficiency,
      totalCoverage: totalCoverage,
      weeklySavings: weeklySavings,
      avgConfidence: avgConfidence
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas dos sensores/irrigadores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar a lista detalhada de Irrigadores (Sensors.tsx)
 */
app.get('/api/sensors/irrigators', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.ID_irrigador as id,
        i.nome as name,
        z.nome as zone,
        c.nome as culture,
        c.statusIA as aiStatus,
        i.eficiencia_hidrica as efficiency,
        z.hectares as coverage,
        s.umidade_atual as soilMoisture,
        i.bateria as battery,
        (SELECT descricao FROM DecisaoIA WHERE ID_zona_fk = z.ID_zona ORDER BY data_hora DESC LIMIT 1) as lastDecision,
        c.padroes_ml as patternsLearned,
        i.economia as waterSaved,
        i.status_ as status
      FROM Irrigador i
      JOIN Zona z ON i.ID_zona_fk = z.ID_zona
      JOIN Setor s ON z.ID_propriedade_fk = s.ID_propriedade_fk
      JOIN Cultura c ON s.ID_setor_fk = c.ID_setor_fk
      GROUP BY i.ID_irrigador;
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar lista de irrigadores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar as estatísticas da página de Irrigação (Irrigation.tsx)
 */
app.get('/api/irrigation/stats', async (req, res) => {
  try {
    const [
      [[{ activeSectors, totalSectors }]],
      [[{ nextIrrigationMinutes }]],
      [[{ avgEfficiency }]]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as totalSectors, SUM(CASE WHEN s.proxima_irrigacao > NOW() AND s.ultima_irrigacao < NOW() THEN 1 ELSE 0 END) as activeSectors FROM Setor s;"),
      pool.query("SELECT TIMESTAMPDIFF(MINUTE, NOW(), MIN(proxima_irrigacao)) as nextIrrigationMinutes FROM Setor WHERE proxima_irrigacao > NOW();"),
      pool.query("SELECT AVG(z.eficiencia) as avgEfficiency FROM Zona z JOIN PropriedadeRural p ON z.ID_propriedade_fk = p.ID_propriedade JOIN Setor s ON s.ID_propriedade_fk = p.ID_propriedade;")
    ]);

    // O consumo diário é mais complexo, vamos usar um valor estático por enquanto
    const dailyConsumption = 2450;

    res.json({
      activeSectors,
      totalSectors,
      dailyConsumption,
      nextIrrigationMinutes,
      avgEfficiency
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de irrigação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar a lista de setores de irrigação (Irrigation.tsx)
 */
app.get('/api/irrigation/zones', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.ID_setor as id,
        s.nome as name,
        CASE 
          WHEN NOW() BETWEEN s.ultima_irrigacao AND s.ultima_irrigacao + INTERVAL s.duracao_irrigacao MINUTE THEN 'active'
          WHEN s.proxima_irrigacao > NOW() THEN 'scheduled'
          ELSE 'paused'
        END as status,
        s.umidade_atual as humidity,
        TIMESTAMPDIFF(MINUTE, NOW(), s.proxima_irrigacao) as nextIrrigationMinutes,
        TIMESTAMPDIFF(HOUR, s.ultima_irrigacao, NOW()) as lastIrrigationHours,
        s.duracao_irrigacao as duration
      FROM Setor s
      ORDER BY s.ID_setor;
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar zonas de irrigação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar as estatísticas da página de Zonas (Areas.tsx)
 */
app.get('/api/areas/stats', async (req, res) => {
  try {
    const [
      [[{ activeZones, totalZones }]],
      [[{ totalCoverage }]],
      [[{ avgEfficiency }]],
      [[{ weeklySavings }]]
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as totalZones, (SELECT COUNT(DISTINCT i.ID_zona_fk) FROM Irrigador i WHERE i.status_ = 'Ativo') as activeZones FROM Zona;"),
      pool.query("SELECT SUM(hectares) as totalCoverage FROM Zona;"),
      pool.query("SELECT AVG(eficiencia) as avgEfficiency FROM Zona;"),
      pool.query("SELECT SUM(volume_economizado) as weeklySavings FROM DecisaoIA WHERE data_hora >= NOW() - INTERVAL 7 DAY;")
    ]);

    res.json({
      activeZones,
      totalZones,
      totalCoverage,
      avgEfficiency,
      weeklySavings
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas das áreas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar a lista detalhada de Zonas (Areas.tsx)
 */
app.get('/api/areas/zones', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        z.ID_zona as id,
        z.nome as name,
        c.nome as crop,
        z.hectares as area,
        i.nome as irrigator,
        c.statusIA as aiStatus,
        z.eficiencia as efficiency,
        s.umidade_atual as soilMoisture,
        c.padroes_ml as patternsLearned,
        z.economia as waterSaved,
        i.status_ as status
      FROM Zona z
      LEFT JOIN Irrigador i ON z.ID_zona = i.ID_zona_fk
      LEFT JOIN PropriedadeRural p ON z.ID_propriedade_fk = p.ID_propriedade
      LEFT JOIN Setor s ON p.ID_propriedade = s.ID_propriedade_fk
      LEFT JOIN Cultura c ON s.ID_setor_fk = c.ID_setor
      GROUP BY z.ID_zona;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar lista de zonas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para buscar as condições climáticas atuais (Weather.tsx)
 */
app.get('/api/weather/current', async (req, res) => {
  try {
    const [
      [[{ value: temperature }]],
      [[{ value: humidity }]],
    ] = await Promise.all([
      pool.query("SELECT AVG(valor_medicao) as value FROM Medicao m JOIN Sensor s ON m.ID_sensor_fk = s.ID_sensor WHERE s.tipo = 'Temperatura' AND m.data_hora >= NOW() - INTERVAL 1 HOUR;"),
      pool.query("SELECT AVG(valor_medicao) as value FROM Medicao m JOIN Sensor s ON m.ID_sensor_fk = s.ID_sensor WHERE s.tipo = 'Umidade' AND m.data_hora >= NOW() - INTERVAL 1 HOUR;"),
    ]);

    // Dados estáticos para completar a UI
    res.json({
      temperature: temperature ? `${parseFloat(temperature).toFixed(1)}°C` : 'N/A',
      humidity: humidity ? `${parseFloat(humidity).toFixed(1)}%` : 'N/A',
      windSpeed: "15 km/h", // Estático
      condition: "Parcialmente nublado", // Estático
      rainChance: "20%" // Estático
    });
  } catch (error) {
    console.error('Erro ao buscar condições climáticas atuais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * Rota para gerar recomendações de irrigação (Weather.tsx)
 */
app.get('/api/weather/recommendations', async (req, res) => {
  try {
    const [sectors] = await pool.query(`
      SELECT 
        s.nome as sector,
        s.umidade_atual as humidity,
        s.proxima_irrigacao as nextIrrigation
      FROM Setor s
      ORDER BY s.ID_setor;
    `);

    const recommendations = sectors.map(sector => {
      if (sector.humidity > 75) {
        return {
          sector: sector.name,
          recommendation: "Adiar irrigação",
          reason: "Umidade do solo está alta",
          action: "delay",
          savings: "~500L"
        };
      }
      return {
        sector: sector.name,
        recommendation: "Irrigar normalmente",
        reason: "Condições ideais para a cultura",
        action: "continue",
        savings: null
      };
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Erro ao buscar recomendações de irrigação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor da API rodando em http://localhost:${port}`);
});