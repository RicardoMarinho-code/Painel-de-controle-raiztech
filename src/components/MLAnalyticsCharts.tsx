import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Brain, Droplets, Zap, Target } from "lucide-react";

const mlPerformanceData = [
  { hour: "00:00", accuracy: 94, confidence: 87, predictions: 12 },
  { hour: "04:00", accuracy: 96, confidence: 91, predictions: 15 },
  { hour: "08:00", accuracy: 92, confidence: 89, predictions: 18 },
  { hour: "12:00", accuracy: 98, confidence: 94, predictions: 22 },
  { hour: "16:00", accuracy: 95, confidence: 92, predictions: 19 },
  { hour: "20:00", accuracy: 97, confidence: 96, predictions: 16 }
];

const waterSavingsData = [
  { month: "Jan", traditional: 15000, ml: 11200, savings: 25 },
  { month: "Fev", traditional: 18000, ml: 12600, savings: 30 },
  { month: "Mar", traditional: 22000, ml: 14300, savings: 35 },
  { month: "Abr", traditional: 19000, ml: 12350, savings: 35 },
  { month: "Mai", traditional: 16000, ml: 10400, savings: 35 },
  { month: "Jun", traditional: 14000, ml: 8960, savings: 36 }
];

const algorithmUsage = [
  { name: "Neural Network", value: 45, color: "#0ea5e9" },
  { name: "Random Forest", value: 25, color: "#22c55e" },
  { name: "LSTM", value: 20, color: "#f59e0b" },
  { name: "SVM", value: 10, color: "#ef4444" }
];

const zoneEfficiency = [
  { zone: "Norte", efficiency: 96, waterSaved: 3200, energySaved: 240 },
  { zone: "Sul", efficiency: 92, waterSaved: 2800, energySaved: 210 },
  { zone: "Leste", efficiency: 98, waterSaved: 3600, energySaved: 270 },
  { zone: "Oeste", efficiency: 94, waterSaved: 3100, energySaved: 230 }
];

const predictionAccuracy = [
  { week: "Sem 1", weather: 94, soil: 97, irrigation: 92 },
  { week: "Sem 2", weather: 96, soil: 95, irrigation: 94 },
  { week: "Sem 3", weather: 91, soil: 98, irrigation: 96 },
  { week: "Sem 4", weather: 93, soil: 96, irrigation: 95 }
];

export const MLAnalyticsCharts = () => {
  return (
    <div className="space-y-6">
      {/* KPIs de ML */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Precisão ML</p>
                <p className="text-2xl font-bold text-primary">96.4%</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +2.3%
                </div>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Economia de Água</p>
                <p className="text-2xl font-bold text-success">34.2%</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +1.8%
                </div>
              </div>
              <Droplets className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eficiência Energética</p>
                <p className="text-2xl font-bold text-warning">28.7%</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +0.9%
                </div>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predições Corretas</p>
                <p className="text-2xl font-bold text-primary">847</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  +12
                </div>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance ML ao longo do tempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance de ML - Últimas 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mlPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#0ea5e9" strokeWidth={2} name="Precisão %" />
                <Line type="monotone" dataKey="confidence" stroke="#22c55e" strokeWidth={2} name="Confiança %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Economia de Água - Comparativo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterSavingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="traditional" fill="#ef4444" name="Sistema Tradicional (L)" />
                <Bar dataKey="ml" fill="#22c55e" name="Sistema ML (L)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Algoritmos e Eficiência por Zona */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso de Algoritmos de ML</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={algorithmUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {algorithmUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eficiência por Zona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {zoneEfficiency.map((zone) => (
              <div key={zone.zone} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Zona {zone.zone}</span>
                  <Badge variant="default">{zone.efficiency}%</Badge>
                </div>
                <Progress value={zone.efficiency} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Água: {zone.waterSaved}L economizados</span>
                  <span>Energia: {zone.energySaved}kWh</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/*Status de Aprendizado */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Aprendizado dos Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Predição Meteorológica</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground">2.3k amostras processadas</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Análise de Solo</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <Progress value={97} className="h-2" />
              <p className="text-xs text-muted-foreground">1.8k amostras processadas</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Otimização de Irrigação</span>
                <Badge variant="secondary">Treinando</Badge>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">956 amostras processadas</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Detecção de Anomalias</span>
                <Badge variant="default">Ativo</Badge>
              </div>
              <Progress value={91} className="h-2" />
              <p className="text-xs text-muted-foreground">1.2k amostras processadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};