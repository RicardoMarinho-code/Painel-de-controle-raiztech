import { Header } from "@/components/Header";
import { useFetch } from "@/hooks/useFetch";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Calendar,
  Clock,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Loader2
} from "lucide-react";

interface AiDecision {
  id: number;
  irrigator: string;
  zone: string;
  decision: string;
  reason: string;
  time: string;
  confidence: string;
  waterSaved: string;
  aiModel: string;
  status: "executed" | "warning" | "active" | "scheduled" | "pending";
}

interface AiSummary {
  learnedPatterns: number;
  decisionAccuracy: number;
  waterEfficiency: number;
  monthlySavings: number;
}

interface AiPattern {
  pattern: string;
  description: string;
  culturesAffected: string[];
  efficiency: string;
  learned: string;
}

const Schedule = () => {
  // Busca os dados usando o hook personalizado
  const { data: aiDecisions, loading, error } = useFetch<AiDecision[]>('/schedule/ai-decisions', []);
  const { data: summary, loading: loadingSummary } = useFetch<AiSummary>('/schedule/ai-summary-stats', { learnedPatterns: 0, decisionAccuracy: 0, waterEfficiency: 0, monthlySavings: 0 });
  const { data: aiPatterns } = useFetch<AiPattern[]>('/schedule/recent-patterns', []);

  const getDecisionStatus = (status: string) => {
    switch (status) {
      case "executed":
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Executada
        </Badge>;
      case "warning":
        return <Badge variant="destructive">
          <CheckCircle className="h-3 w-3 mr-1" />
          Alerta
        </Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">
          <Zap className="h-3 w-3 mr-1" />
          Ativa
        </Badge>;
      case "scheduled":
        return <Badge variant="outline" className="border-accent text-accent">
          <Clock className="h-3 w-3 mr-1" />
          Agendada
        </Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getAIModelBadge = (model: string) => {
    switch (model) {
      case "Otimizado":
        return <Badge className="bg-success text-success-foreground">Otimizado</Badge>;
      case "Especialista":
        return <Badge className="bg-primary text-primary-foreground">Especialista</Badge>;
      case "Aprendendo":
        return <Badge variant="outline" className="border-primary text-primary">Aprendendo</Badge>;
      default:
        return <Badge variant="secondary">Básico</Badge>;
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
              <h1 className="text-3xl font-bold">Decisões Autônomas da IA</h1>
              <p className="text-muted-foreground">A IA decide automaticamente quando irrigar com base em padrões aprendidos</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Treinar Modelo
              </Button>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Otimizar Global
              </Button>
            </div>
          </div>

          {/* AI Overview */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span>Sistema de IA Embarcado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSummary ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{summary.learnedPatterns}</div>
                    <p className="text-sm text-muted-foreground">Padrões Aprendidos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{summary.decisionAccuracy}%</div>
                    <p className="text-sm text-muted-foreground">Precisão Decisões</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{summary.waterEfficiency}%</div>
                    <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{summary.monthlySavings}L</div>
                    <p className="text-sm text-muted-foreground">Economia Mensal</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Decisions Today */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Decisões Autônomas de Hoje</span>
            </h2>
            
            {loading && (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Carregando decisões...</span>
              </div>
            )}
            {error && <p className="text-destructive text-center">{error}</p>}
            {!loading && !error && aiDecisions.map((decision: AiDecision) => (
                <Card key={decision.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-medium">{decision.irrigator}</h3>
                          {getDecisionStatus(decision.status)}
                          {getAIModelBadge(decision.aiModel)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Decisão da IA:</span>
                            <div className="font-medium text-primary">{decision.decision}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Razão:</span>
                            <div className="font-medium">{decision.reason}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Horário:</span>
                            <div className="font-medium flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {decision.time}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Confiança IA:</span>
                            <div className="font-medium text-success">{decision.confidence}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Água Economizada:</span>
                            <div className="font-medium text-success">{decision.waterSaved}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Zona:</span>
                            <div className="font-medium">{decision.zone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* AI Learning Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Padrões Recém Aprendidos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiPatterns.map((pattern: AiPattern, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-primary">{pattern.pattern}</h3>
                      <Badge variant="outline" className="text-success border-success">
                        {pattern.efficiency} eficiência
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pattern.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-muted-foreground">Culturas: </span>
                        <span className="font-medium">{pattern.culturesAffected.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aprendido: </span>
                        <span className="font-medium">{pattern.learned}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Brain className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Análise IA</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Target className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Otimizar Global</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Padrões Novos</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <CheckCircle className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Histórico IA</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Schedule;