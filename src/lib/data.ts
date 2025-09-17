

export const aiReports = [

  {
    title: "Eficiência Hídrica Global",
    type: "efficiency",
    period: "Último mês",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    description: "Eficiência média dos 6 irrigadores inteligentes"
  },
  {
    title: "Economia por IA",
    type: "ai-savings",
    period: "Março 2024",
    value: "3.240L",
    change: "+18.7%",
    trend: "up",
    description: "Água economizada pelas decisões inteligentes da IA"
  },
  {
    title: "Precisão das Decisões",
    type: "accuracy",
    period: "Safra atual",
    value: "96.8%",
    change: "+4.2%",
    trend: "up",
    description: "Acurácia das decisões de irrigação da IA"
  }
];

export const cultureAnalysis = [
  {
    culture: "Milho",
    irrigators: 2,
    patternsLearned: 161,
    efficiency: "94.5%",
    waterSaved: "460L/semana",
    aiStatus: "Otimizado"
  },
  {
    culture: "Soja",
    irrigators: 2,
    patternsLearned: 89,
    efficiency: "89.1%",
    waterSaved: "280L/semana",
    aiStatus: "Aprendendo"
  },
  {
    culture: "Feijão",
    irrigators: 1,
    patternsLearned: 156,
    efficiency: "92.7%",
    waterSaved: "420L/semana",
    aiStatus: "Otimizado"
  },
  {
    culture: "Verduras",
    irrigators: 1,
    patternsLearned: 203,
    efficiency: "94.8%",
    waterSaved: "380L/semana",
    aiStatus: "Especialista"
  }
];

export const learningEvolutionData = [
  { month: "Jan", "Padrões": 150, "Eficiência (%)": 85.2 },
  { month: "Fev", "Padrões": 280, "Eficiência (%)": 88.9 },
  { month: "Mar", "Padrões": 410, "Eficiência (%)": 92.1 },
  { month: "Abr", "Padrões": 550, "Eficiência (%)": 95.6 },
  { month: "Mai", "Padrões": 615, "Eficiência (%)": 97.6 },
];


// Dados para o Histórico (HistoryDashboard.tsx)

export const productivityData = [
    { period: "Mês 1", traditional: 100, withAI: 118, increase: 18 },
    { period: "Mês 2", traditional: 100, withAI: 125, increase: 25 },
    { period: "Mês 3", traditional: 100, withAI: 134, increase: 34 },
    { period: "Mês 4", traditional: 100, withAI: 142, increase: 42 },
    { period: "Mês 5", traditional: 100, withAI: 147, increase: 47 },
    { period: "Mês 6", traditional: 100, withAI: 156, increase: 56 },
    { period: "Mês 7", traditional: 100, withAI: 164, increase: 64 },
    { period: "Mês 8", traditional: 100, withAI: 171, increase: 71 },
    { period: "Mês 9", traditional: 100, withAI: 178, increase: 78 },
    { period: "Mês 10", traditional: 100, withAI: 184, increase: 84 },
    { period: "Mês 11", traditional: 100, withAI: 189, increase: 89 },
    { period: "Mês 12", traditional: 100, withAI: 195, increase: 95 }
];

export const decisionFlowData = [
    {
      time: "06:00",
      waterLevel: 85,
      isRaining: false,
      soilMoisture: 45,
      ph: 6.2,
      temperature: 22,
      sunIntensity: 15,
      decision: "Irrigar",
      duration: 35
    },
    {
      time: "08:00",
      waterLevel: 78,
      isRaining: false,
      soilMoisture: 62,
      ph: 6.4,
      temperature: 26,
      sunIntensity: 45,
      decision: "Aguardar",
      duration: 0
    },
    {
      time: "12:00",
      waterLevel: 75,
      isRaining: true,
      soilMoisture: 58,
      ph: 6.1,
      temperature: 24,
      sunIntensity: 25,
      decision: "Pausar - Chuva",
      duration: 0
    },
    {
      time: "16:00",
      waterLevel: 73,
      isRaining: false,
      soilMoisture: 72,
      ph: 6.3,
      temperature: 28,
      sunIntensity: 65,
      decision: "Aguardar",
      duration: 0
    },
    {
      time: "18:00",
      waterLevel: 70,
      isRaining: false,
      soilMoisture: 48,
      ph: 6.0,
      temperature: 26,
      sunIntensity: 20,
      decision: "Irrigar",
      duration: 28
    }
];

export const environmentalCorrelation = [
  { hour: "06", sunIntensity: 10, temperature: 20, soilMoisture: 65, ph: 6.2 },
  { hour: "08", sunIntensity: 30, temperature: 24, soilMoisture: 58, ph: 6.3 },
  { hour: "10", sunIntensity: 60, temperature: 28, soilMoisture: 52, ph: 6.1 },
  { hour: "12", sunIntensity: 85, temperature: 32, soilMoisture: 45, ph: 5.9 },
  { hour: "14", sunIntensity: 90, temperature: 34, soilMoisture: 42, ph: 5.8 },
  { hour: "16", sunIntensity: 70, temperature: 31, soilMoisture: 38, ph: 5.9 },
  { hour: "18", sunIntensity: 25, temperature: 27, soilMoisture: 48, ph: 6.1 },
  { hour: "20", sunIntensity: 5, temperature: 23, soilMoisture: 55, ph: 6.2 }
];

export const getImprovements = (selectedPeriod: string) => {
    const baseImprovements = [
      { metric: "Produtividade", before: "100%", after: "156%", improvement: "+56%", period6: "+56%", period12: "+95%" },
      { metric: "Economia de Água", before: "0%", after: "34%", improvement: "+34%", period6: "+34%", period12: "+52%" },
      { metric: "Eficiência pH", before: "70%", after: "94%", improvement: "+24%", period6: "+24%", period12: "+38%" },
      { metric: "Aproveitamento Solar", before: "N/A", after: "87%", improvement: "Novo", period6: "Novo", period12: "Implementado" },
      { metric: "Prevenção Chuva", before: "Manual", after: "100%", improvement: "Automático", period6: "Automático", period12: "Otimizado" },
      { metric: "Controle Umidade", before: "±15%", after: "±3%", improvement: "+400%", period6: "+400%", period12: "+650%" }
    ];

    return baseImprovements.map(item => ({
      ...item,
      improvement: selectedPeriod === "12months" ? item.period12 : item.period6,
      after: selectedPeriod === "12months" && item.metric === "Produtividade" ? "195%" :
             selectedPeriod === "12months" && item.metric === "Economia de Água" ? "52%" :
             selectedPeriod === "12months" && item.metric === "Eficiência pH" ? "97%" : item.after
    }));
};

// Dados para o Painel de Configuração de ML (MLConfigPanel.tsx)

export const defaultMLConfig = {
    // Configurações Gerais
    autoLearning: true,
    adaptiveMode: true,
    confidenceThreshold: [85],
    learningRate: [0.01],

    // Algoritmos
    primaryAlgorithm: "neural_network",
    predictionModel: "lstm",
    optimizationTarget: "water_efficiency",

    // Sensores e Dados
    soilMoistureSensitivity: [75],
    temperatureWeight: [60],
    humidityWeight: [40],
    windWeight: [30],

    // Padrões de Irrigação
    minIrrigationDuration: [10],
    maxIrrigationDuration: [45],
    cooldownPeriod: [2],

    // Alertas ML
    lowConfidenceAlert: true,
    patternChangeAlert: true,
    anomalyDetection: true,

    // Backup e Segurança
    autoBackup: true,
    failsafeMode: true,
    manualOverride: true
};