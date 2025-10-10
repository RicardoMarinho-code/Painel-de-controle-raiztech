const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importa nosso pool de conexões

const app = express();
const port = 3001; // Porta que a API vai rodar

app.use(cors()); // Permite que o frontend (em outra porta) acesse a API
app.use(express.json()); // Permite que a API entenda JSON

/**
 * Rota para buscar as decisões da IA.
 * Vamos fazer um JOIN para pegar informações de outras tabelas.
 */
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

app.listen(port, () => {
  console.log(`🚀 Servidor da API rodando em http://localhost:${port}`);
});