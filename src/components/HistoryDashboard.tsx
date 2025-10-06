import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { Calendar, TrendingUp, Droplets, Thermometer, Sun, Zap, Database, CloudRain, TestTube, Activity, Loader2 } from "lucide-react";

export const HistoryDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [decisionFlowData, setDecisionFlowData] = useState([]);
  const [environmentalCorrelation, setEnvironmentalCorrelation] = useState([]);
  const [loadingDecisionFlow, setLoadingDecisionFlow] = useState(true);
  const [errorDecisionFlow, setErrorDecisionFlow] = useState<string | null>(null);
  const [loadingEnvironmental, setLoadingEnvironmental] = useState(true);
  const [errorEnvironmental, setErrorEnvironmental] = useState<string | null>(null);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loadingDbStats, setLoadingDbStats] = useState(true);
  const [errorDbStats, setErrorDbStats] = useState<string | null>(null);

  const [productivityData, setProductivityData] = useState({ chartData: [], improvements: [] });
  const [loadingProductivity, setLoadingProductivity] = useState(true);
  const [errorProductivity, setErrorProductivity] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecisionFlow = async () => {
      try {
        setLoadingDecisionFlow(true);
        // A URL base VITE_API_BASE_URL=http://localhost:5000/api deve estar no seu .env
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/history/decision-flow`);
        if (!response.ok) throw new Error('Falha ao buscar fluxo de decisão da IA');
        const data = await response.json();
        setDecisionFlowData(data);
      } catch (err: any) {
        setErrorDecisionFlow(err.message);
      } finally {
        setLoadingDecisionFlow(false);
      }
    };

    const fetchEnvironmentalCorrelation = async () => {
      try {
        setLoadingEnvironmental(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/history/environmental-correlation`);
        if (!response.ok) throw new Error('Falha ao buscar correlação ambiental');
        const data = await response.json();
        setEnvironmentalCorrelation(data);
      } catch (err: any) {
        setErrorEnvironmental(err.message);
      } finally {
        setLoadingEnvironmental(false);
      }
    };

    const fetchDbStats = async () => {
      try {
        setLoadingDbStats(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/history/sensor-database-stats`);
        if (!response.ok) throw new Error('Falha ao buscar estatísticas do banco de dados');
        const data = await response.json();
        setDbStats(data);
      } catch (err: any) {
        setErrorDbStats(err.message);
      } finally {
        setLoadingDbStats(false);
      }
    };

    const fetchProductivityData = async () => {
      const months = selectedPeriod === "3months" ? 3 : selectedPeriod === "6months" ? 6 : 12;
      try {
        setLoadingProductivity(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/history/productivity-evolution?months=${months}`);
        if (!response.ok) throw new Error('Falha ao buscar dados de produtividade');
        const data = await response.json();
        setProductivityData(data);
      } catch (err: any) {
        setErrorProductivity(err.message);
      } finally {
        setLoadingProductivity(false);
      }
    };

    fetchDecisionFlow();
    fetchEnvironmentalCorrelation();
    fetchDbStats();
    fetchProductivityData();
  }, [selectedPeriod]);

  // Filtra dados baseado no período selecionado
  const getFilteredData = () => {
    const monthsToShow = selectedPeriod === "3months" ? 3 : selectedPeriod === "6months" ? 6 : 12;
    return productivityData.chartData.slice(0, monthsToShow);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Histórico e Evolução da IA</h2>
        </div>
        <div className="flex gap-2">
          <Button variant={selectedPeriod === "3months" ? "default" : "outline"} size="sm" onClick={() => setSelectedPeriod("3months")}>
            3 Meses
          </Button>
          <Button variant={selectedPeriod === "6months" ? "default" : "outline"} size="sm" onClick={() => setSelectedPeriod("6months")}>
            6 Meses
          </Button>
          <Button variant={selectedPeriod === "12months" ? "default" : "outline"} size="sm" onClick={() => setSelectedPeriod("12months")}>
            12 Meses
          </Button>
        </div>
      </div>

      <Tabs defaultValue="productivity" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
          <TabsTrigger value="decisions">Fluxo de Decisões</TabsTrigger>
          <TabsTrigger value="environmental">Correlações Ambientais</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="space-y-6">
          {/* Gráfico de Evolução da Produtividade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Evolução da Produtividade com IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProductivity && (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {errorProductivity && (
                <p className="text-destructive text-center h-[400px] flex items-center justify-center">{errorProductivity}</p>
              )}
              {!loadingProductivity && !errorProductivity && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="traditional" stroke="#94a3b8" strokeWidth={2} name="Sistema Tradicional" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="withAI" stroke="#22c55e" strokeWidth={3} name="Sistema com IA" />
                </LineChart>
              </ResponsiveContainer>
              )}
              
              {!loadingProductivity && getFilteredData().length > 0 && (
              <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-success">
                    +{getFilteredData().slice(-1)[0]?.increase}% de Aumento
                  </h3>
                  <p className="text-success/80">
                    na produtividade em {selectedPeriod === "3months" ? "3" : selectedPeriod === "6months" ? "6" : "12"} meses
                  </p>
                </div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo de Melhorias */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Melhorias Implementadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingProductivity && <p>Carregando melhorias...</p>}
                {errorProductivity && <p className="text-destructive">{errorProductivity}</p>}
                {!loadingProductivity && productivityData.improvements.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg bg-card">
                    <h4 className="font-semibold mb-2">{item.metric}</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Antes:</span>
                      <span>{item.before}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Agora:</span>
                      <span className="font-medium">{item.after}</span>
                    </div>
                    <Badge variant="default" className="w-full justify-center bg-success text-success-foreground">
                      {item.improvement}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          {/* Fluxo de Decisões da IA (baseado na descrição do sócio) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Fluxo de Decisões da IA - Hoje
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Sequência: Nível água → Chuva → Umidade solo → pH/Temperatura/Sol → Decisão → Irrigação
              </p>
              {loadingDecisionFlow && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando fluxo de decisão...</span>
                </div>
              )}
              {errorDecisionFlow && (
                <p className="text-sm text-destructive">Erro: {errorDecisionFlow}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {decisionFlowData.map((entry, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{entry.time}</span>
                        <Badge variant={entry.decision.includes("Irrigar") ? "default" : entry.decision.includes("Chuva") ? "secondary" : "outline"}>
                          {entry.decision}
                        </Badge>
                      </div>
                      {entry.duration > 0 && (
                        <span className="text-sm text-muted-foreground">{entry.duration} min</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>Água: {entry.waterLevel}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-4 w-4 text-blue-600" />
                        <span>Chuva: {entry.isRaining ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-green-500" />
                        <span>Solo: {entry.soilMoisture}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TestTube className="h-4 w-4 text-purple-500" />
                        <span>pH: {entry.ph}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span>{entry.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span>Sol: {entry.sunIntensity}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          {/* Correlações Ambientais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-warning" />
                Correlação: Sol → Temperatura → Umidade → pH
              </CardTitle>
              {loadingEnvironmental && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando correlações ambientais...</span>
                </div>
              )}
              {errorEnvironmental && (
                <p className="text-sm text-destructive">Erro: {errorEnvironmental}</p>
              )}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={environmentalCorrelation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="sunIntensity" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Intensidade Solar %" />
                  <Area type="monotone" dataKey="temperature" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Temperatura °C" />
                  <Area type="monotone" dataKey="soilMoisture" stackId="3" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Umidade Solo %" />
                  <Area type="monotone" dataKey="ph" stackId="4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="pH × 10" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Insights da IA sobre Correlações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">☀️ Intensidade Solar vs pH</h4>
                <p className="text-sm">IA detectou que alta intensidade solar (&gt;70%) reduz pH do solo em 0.3-0.4 pontos, exigindo correção automática.</p>
              </div>
              <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                <h4 className="font-semibold text-success mb-2">🌡️ Temperatura vs Umidade</h4>
                <p className="text-sm">Correlação inversa perfeita: cada +1°C reduz umidade do solo em ~2%. IA ajusta frequência de irrigação automaticamente.</p>
              </div>
              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-warning mb-2">💧 Padrão de Irrigação Otimizado</h4>
                <p className="text-sm">IA aprendeu que irrigação às 6h e 18h maximiza eficiência, evitando evaporação do meio-dia.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          {/* Banco de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Banco de Dados de Sensores
              </CardTitle>
              {loadingDbStats && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando estatísticas...</span>
                </div>
              )}
              {errorDbStats && (
                <p className="text-sm text-destructive">Erro: {errorDbStats}</p>
              )}
            </CardHeader>
            {dbStats && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold">Registros Totais</h4>
                    <p className="text-2xl font-bold text-primary">
                      {dbStats.totalRecords.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Desde o início
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold">Medições/Dia</h4>
                    <p className="text-2xl font-bold text-success">{dbStats.measurementsPerDay.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold">Precisão Sensores</h4>
                    <p className="text-2xl font-bold text-warning">{dbStats.sensorAccuracy}%</p>
                    <p className="text-xs text-muted-foreground">Taxa de acerto (estimada)</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-semibold">Armazenamento</h4>
                    <p className="text-2xl font-bold text-destructive">{dbStats.storageUsed} MB</p>
                    <p className="text-xs text-muted-foreground">Dados históricos (estimado)</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold">Status dos Sensores</h4>
                  <div className="space-y-2">
                    {dbStats.sensorStatus.map((sensor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{sensor.name}</span>
                        <Badge variant={sensor.status === '100% Online' ? 'default' : 'secondary'}>{sensor.status}</Badge>
                      </div>
                    ))}
                     <div className="flex items-center justify-between">
                      <span className="text-sm">Detecção de Chuva (0 sensores)</span>
                      <Badge variant="outline">Não instalado</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};