import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import { Calendar, TrendingUp, Droplets, Thermometer, Sun, Zap, Database, CloudRain, TestTube, Activity } from "lucide-react";
import { 
  productivityData, 
  decisionFlowData, 
  environmentalCorrelation, 
  getImprovements 
} from "@/lib/data";

export const HistoryDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Filtra dados baseado no período selecionado
  const getFilteredData = () => {
    const monthsToShow = selectedPeriod === "3months" ? 3 : selectedPeriod === "6months" ? 6 : 12;
    return productivityData.slice(0, monthsToShow);
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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="traditional" stroke="#94a3b8" strokeWidth={2} name="Sistema Tradicional" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="withAI" stroke="#22c55e" strokeWidth={3} name="Sistema com IA" />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-success">
                    +{getFilteredData()[getFilteredData().length - 1]?.increase}% de Aumento
                  </h3>
                  <p className="text-success/80">
                    na produtividade em {selectedPeriod === "3months" ? "3" : selectedPeriod === "6months" ? "6" : "12"} meses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo de Melhorias */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo das Melhorias Implementadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getImprovements(selectedPeriod).map((item, index) => (
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Registros Totais</h4>
                  <p className="text-2xl font-bold text-primary">
                    {selectedPeriod === "3months" ? "44,671" : selectedPeriod === "6months" ? "89,342" : "178,684"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Últimos {selectedPeriod === "3months" ? "3" : selectedPeriod === "6months" ? "6" : "12"} meses
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Medições/Dia</h4>
                  <p className="text-2xl font-bold text-success">2,880</p>
                  <p className="text-xs text-muted-foreground">A cada 30 segundos</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Precisão Sensores</h4>
                  <p className="text-2xl font-bold text-warning">98.7%</p>
                  <p className="text-xs text-muted-foreground">Taxa de acerto</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold">Armazenamento</h4>
                  <p className="text-2xl font-bold text-destructive">847 MB</p>
                  <p className="text-xs text-muted-foreground">Dados históricos</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Status dos Sensores</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nível de Água (4 sensores)</span>
                    <Badge variant="default">100% Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detecção de Chuva (2 sensores)</span>
                    <Badge variant="default">100% Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Umidade do Solo (12 sensores)</span>
                    <Badge variant="default">100% Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">pH do Solo (4 sensores)</span>
                    <Badge variant="secondary">Calibrando</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temperatura (6 sensores)</span>
                    <Badge variant="default">100% Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Intensidade Solar (2 sensores)</span>
                    <Badge variant="default">100% Online</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};