import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const aiReports = [
    {
      title: "Padrões de Aprendizado da IA",
      type: "ai-learning",
      period: "Última semana",
      value: "127 novos",
      change: "+23%",
      trend: "up",
      description: "Novos padrões identificados pelo machine learning"
    },
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

  const cultureAnalysis = [
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
      case "Aprendendo": return "text-accent";
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
                        <Brain className="h-5 w-5 text-primary" />
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
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Evolução do Aprendizado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-4xl">🧠</div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Gráfico de Evolução da IA</h3>
                      <p className="text-muted-foreground mb-4">
                        Visualização do aprendizado e melhoria de eficiência ao longo do tempo
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>• 615 padrões identificados em 3 meses</div>
                        <div>• Eficiência aumentou 12.4% com ML</div>
                        <div>• Economia de 18.7% em consumo hídrico</div>
                      </div>
                    </div>
                    <Button variant="outline">Ver Gráfico Interativo</Button>
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