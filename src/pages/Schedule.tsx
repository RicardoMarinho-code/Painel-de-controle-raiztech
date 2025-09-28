import { Header } from "@/components/Header";
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
  TrendingUp
} from "lucide-react";

const Schedule = () => {
  const aiDecisions = [
    {
      id: 1,
      irrigator: "Irrigador A1 - Milho",
      zone: "Zona Norte",
      decision: "Irrigação reduzida",
      reason: "IA detectou alta umidade + previsão de chuva",
      time: "06:30",
      confidence: "97%",
      waterSaved: "45L",
      status: "executed",
      aiModel: "Otimizado"
    },
    {
      id: 2,
      irrigator: "Irrigador B2 - Soja", 
      zone: "Zona Sul",
      decision: "Aguardar até 22:00",
      reason: "Correlação temperatura noturna + eficiência hídrica",
      time: "22:00",
      confidence: "89%",
      waterSaved: "28L",
      status: "scheduled",
      aiModel: "Aprendendo"
    },
    {
      id: 3,
      irrigator: "Irrigador C3 - Feijão",
      zone: "Zona Leste",
      decision: "Micro-irrigação contínua",
      reason: "Padrão otimizado para cultura sensível",
      time: "A cada 2h",
      confidence: "95%",
      waterSaved: "62L",
      status: "active",
      aiModel: "Otimizado"
    },
    {
      id: 4,
      irrigator: "Irrigador E5 - Verduras",
      zone: "Zona Centro",
      decision: "Irrigação por gotejamento",
      reason: "Especialização IA para culturas delicadas",
      time: "14:00",
      confidence: "98%",
      waterSaved: "71L",
      status: "scheduled",
      aiModel: "Especialista"
    }
  ];

  const aiPatterns = [
    {
      pattern: "Correlação Clima-Solo",
      description: "IA identifica padrões entre previsão meteorológica e necessidade hídrica",
      culturesAffected: ["Milho", "Soja"],
      efficiency: "+12%",
      learned: "há 2 semanas"
    },
    {
      pattern: "Otimização Horário-Temperatura",
      description: "Irrigação noturna mais eficiente para reduzir evaporação",
      culturesAffected: ["Soja", "Feijão"],
      efficiency: "+8%",
      learned: "há 1 semana"
    },
    {
      pattern: "Micro-irrigação Verduras",
      description: "Pequenas doses frequentes para culturas sensíveis",
      culturesAffected: ["Verduras"],
      efficiency: "+18%",
      learned: "há 3 dias"
    }
  ];

  const getDecisionStatus = (status: string) => {
    switch (status) {
      case "executed":
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Executada
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">615</div>
                  <p className="text-sm text-muted-foreground">Padrões Aprendidos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">96.8%</div>
                  <p className="text-sm text-muted-foreground">Precisão Decisões</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">94.2%</div>
                  <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3.240L</div>
                  <p className="text-sm text-muted-foreground">Economia Mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Decisions Today */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Decisões Autônomas de Hoje</span>
            </h2>
            
            {aiDecisions.map((decision) => (
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
                {aiPatterns.map((pattern, index) => (
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

          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Configuração da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🤖</div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">IA Autônoma RaizTech</h3>
                    <p className="text-muted-foreground mb-4">
                      Sistema de machine learning totalmente automatizado
                    </p>
                    <div className="space-y-2 text-sm max-w-md mx-auto">
                      <div>• Decisões tomadas a cada 30 segundos</div>
                      <div>• Análise contínua de 127 variáveis</div>
                      <div>• Adaptação automática por cultura</div>
                      <div>• Integração com dados climáticos em tempo real</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Ver Configurações Avançadas</Button>
                    <Button>Treinar Novo Modelo</Button>
                  </div>
                </div>
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