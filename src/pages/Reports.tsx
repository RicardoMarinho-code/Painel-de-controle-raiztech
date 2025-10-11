import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Brain, 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Droplets,
  Target,
  Zap,
  BarChart3
} from "lucide-react";

interface ReportStats {
  patternsLearned: number;
  avgEfficiency: number;
  monthlySavings: number;
  decisionPrecision: number;
}

interface CultureAnalysis {
  culture: string;
  irrigators: number;
  patternsLearned: number;
  efficiency: string;
  waterSaved: string;
  aiStatus: string;
}

interface LearningEvolution {
  month: string;
  'Padrões': number;
  'Eficiência (%)': number;
}

const Reports = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [cultureAnalysis, setCultureAnalysis] = useState<CultureAnalysis[]>([]);
  const [learningEvolutionData, setLearningEvolutionData] = useState<LearningEvolution[]>([]);
  const [loading, setLoading] = useState(true);

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-success" : "text-destructive";
  };

  const getAIStatusColor = (status: string) => {
    switch (status) {
      case "Otimizado": return "text-success";
      case "Especialista": return "text-primary";
      case "Aprendendo": return "text-primary";
      default: return "text-muted-foreground";
    }
  };  

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [statsRes, cultureRes, evolutionRes] = await Promise.all([
          fetch('http://localhost:3001/api/reports/stats'),
          fetch('http://localhost:3001/api/reports/culture-analysis'),
          fetch('http://localhost:3001/api/reports/learning-evolution')
        ]);
        const statsData = await statsRes.json();
        const cultureData = await cultureRes.json();
        const evolutionData = await evolutionRes.json();

        setStats(statsData);
        setCultureAnalysis(cultureData);
        setLearningEvolutionData(evolutionData);
      } catch (error) {
        console.error("Erro ao buscar dados dos relatórios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Análises de Machine Learning</h1>
              <p className="text-muted-foreground">Relatórios de eficiência hídrica e padrões aprendidos pela IA</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Período
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar IA
              </Button>
            </div>
          </div>

          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading || !stats ? (
              Array(4).fill(0).map((_, index) => <Card key={index} className="h-[126px] animate-pulse bg-muted/50" />)
            ) : (
              <>
                <DashboardCard
                  title="Padrões Aprendidos"
                  value={stats.patternsLearned.toString()}
                  icon={Brain}
                  status="success"
                  trend="up"
                />
                <DashboardCard
                  title="Eficiência Média"
                  value={parseFloat(stats.avgEfficiency.toString()).toFixed(1)}
                  unit="%"
                  icon={Target}
                  status="success"
                  trend="up"
                />
                <DashboardCard
                  title="Economia IA"
                  value={new Intl.NumberFormat('pt-BR').format(stats.monthlySavings)}
                  unit="L/mês"
                  icon={Droplets}
                  status="success"
                  trend="up"
                />
                <DashboardCard
                  title="Precisão Decisões"
                  value={parseFloat(stats.decisionPrecision.toString()).toFixed(1)}
                  unit="%"
                  icon={Zap}
                  status="success"
                  trend="up"
                />
              </>
            )}
          </div>

          {/* Culture Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Análise por Cultura - Aprendizado da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <p className="text-center text-muted-foreground">Carregando análise de culturas...</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Cultura</th>
                        <th className="text-center p-3">Irrigadores</th>
                        <th className="text-center p-3">Padrões ML</th>
                        <th className="text-center p-3">Eficiência</th>
                        <th className="text-center p-3">Economia</th>
                        <th className="text-center p-3">Status IA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cultureAnalysis.map((culture, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{culture.culture}</td>
                          <td className="p-3 text-center">{culture.irrigators}</td>
                          <td className="p-3 text-center font-medium text-primary">{culture.patternsLearned}</td>
                          <td className="p-3 text-center font-medium text-success">{culture.efficiency}</td>
                          <td className="p-3 text-center font-medium">{culture.waterSaved}</td>
                          <td className="p-3 text-center">
                            <span className={`font-medium ${getAIStatusColor(culture.aiStatus)}`}>
                              {culture.aiStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Brain className="h-5 w-5" />
                <span>Evolução do Aprendizado da IA</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Aumento de padrões e eficiência ao longo do tempo.
              </p>
            </CardHeader>
            <CardContent>
              {loading ? <p className="text-center text-muted-foreground">Carregando evolução do aprendizado...</p> : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={learningEvolutionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Legend formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>{value}</span>
                          )} />
                        <Line yAxisId="left" type="monotone" dataKey="Padrões" stroke="hsl(var(--accent))" strokeWidth={2} name="Padrões Aprendidos" />
                        <Line yAxisId="right" type="monotone" dataKey="Eficiência (%)" stroke="hsl(var(--success))" strokeWidth={2} name="Eficiência Média" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg flex flex-col justify-center">
                    <h3 className="font-semibold text-lg">Insights de Evolução</h3>
                    <p className="text-sm text-muted-foreground">
                      O sistema de IA demonstra um aprendizado exponencial, resultando em ganhos significativos de eficiência e economia.
                    </p>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start gap-3">
                        <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium">{stats?.patternsLearned || '...'} Padrões Identificados</p>
                          <p className="text-xs text-muted-foreground">nos últimos meses.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade de exportação será implementada em breve.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Reports;