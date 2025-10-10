import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { aiReports, cultureAnalysis, learningEvolutionData } from "@/lib/data";
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

const Reports = () => {
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
            <DashboardCard
              title="Padrões Aprendidos"
              value="615"
              icon={Brain}
              status="success"
              trend="up"
            />
            <DashboardCard
              title="Eficiência Média"
              value="94.2"
              unit="%"
              icon={Target}
              status="success"
              trend="up"
            />
            <DashboardCard
              title="Economia IA"
              value="3.240"
              unit="L/mês"
              icon={Droplets}
              status="success"
              trend="up"
            />
            <DashboardCard
              title="Precisão Decisões"
              value="96.8"
              unit="%"
              icon={Zap}
              status="success"
              trend="up"
            />
          </div>

          {/* AI Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiReports.map((report, index) => {
              const TrendIcon = getTrendIcon(report.trend);
              
              return (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-sucess" />
                        <span>{report.title}</span>
                      </CardTitle>
                      <Badge variant="outline">{report.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{report.value}</div>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <div className={`flex items-center space-x-1 ${getTrendColor(report.trend)}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{report.change}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalhes IA
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
                        <p className="font-medium">615 Padrões Identificados</p>
                        <p className="text-xs text-muted-foreground">em 5 meses de operação.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-success flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-success">+12.4% de Eficiência</p>
                        <p className="text-xs text-muted-foreground">comparado ao início do período.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Droplets className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">+18.7% de Economia Hídrica</p>
                        <p className="text-xs text-muted-foreground">em consumo de água.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Rápidos de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Brain className="h-6 w-6" />
                  <span className="text-sm">Padrões Diários</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Target className="h-6 w-6" />
                  <span className="text-sm">Eficiência IA</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Droplets className="h-6 w-6" />
                  <span className="text-sm">Economia ML</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Análise Completa</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Exportar Dados de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Relatório Completo IA</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Análise completa dos padrões, eficiência e economia
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Dados de Treinamento</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Dados brutos utilizados pelo machine learning
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar CSV
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Métricas de Performance</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Resumo executivo da performance da IA
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar XLSX
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Reports;