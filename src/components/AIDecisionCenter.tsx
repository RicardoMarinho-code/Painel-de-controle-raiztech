import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Activity, 
  Clock, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye
} from "lucide-react";

interface AIDecision {
  id: string;
  timestamp: string;
  zone: string;
  decision: string;
  confidence: number;
  reasoning: string;
  outcome: "success" | "pending" | "warning";
  waterSaved?: string;
}

export const AIDecisionCenter = () => {
  const recentDecisions: AIDecision[] = [
    {
      id: "1",
      timestamp: "13:24",
      zone: "Zona Norte",
      decision: "Irrigação pausada",
      confidence: 96,
      reasoning: "Chuva detectada em 45min",
      outcome: "success",
      waterSaved: "85L"
    },
    {
      id: "2", 
      timestamp: "12:15",
      zone: "Zona Sul",
      decision: "Micro-irrigação ativada",
      confidence: 89,
      reasoning: "pH baixo + temperatura alta",
      outcome: "success",
      waterSaved: "120L"
    },
    {
      id: "3",
      timestamp: "11:30",
      zone: "Zona Leste",
      decision: "Irrigação noturna programada",
      confidence: 92,
      reasoning: "Otimização por evaporação",
      outcome: "pending"
    },
    {
      id: "4",
      timestamp: "10:45",
      zone: "Zona Centro", 
      decision: "Alerta de pH crítico",
      confidence: 98,
      reasoning: "Valor fora do padrão aprendido",
      outcome: "warning"
    }
  ];

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "success": return <CheckCircle className="h-3 w-3 text-success" />;
      case "warning": return <AlertTriangle className="h-3 w-3 text-warning" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "success": return <Badge className="bg-success text-success-foreground text-xs">Sucesso</Badge>;
      case "warning": return <Badge variant="destructive" className="text-xs">Alerta</Badge>;
      default: return <Badge variant="outline" className="text-xs">Pendente</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Centro de Decisões da IA</span>
            <Badge variant="outline" className="border-success text-success">
              <Activity className="h-3 w-3 mr-1" />
              Ativo
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Histórico
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Status */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">847</div>
            <div className="text-xs text-muted-foreground">Decisões hoje</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">1.240L</div>
            <div className="text-xs text-muted-foreground">Água economizada</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent">93%</div>
            <div className="text-xs text-muted-foreground">Precisão média</div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Decisões Recentes</h4>
          {recentDecisions.map((decision) => (
            <div key={decision.id} className="p-3 rounded-lg border bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{decision.timestamp}</span>
                  <Badge variant="outline" className="text-xs">{decision.zone}</Badge>
                  {getOutcomeBadge(decision.outcome)}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-muted-foreground">{decision.confidence}%</div>
                  {getOutcomeIcon(decision.outcome)}
                </div>
              </div>
              
              <div className="text-sm font-medium mb-1">{decision.decision}</div>
              <div className="text-xs text-muted-foreground">{decision.reasoning}</div>
              
              {decision.waterSaved && (
                <div className="mt-2 text-xs text-success font-medium">
                  <Zap className="h-3 w-3 inline mr-1" />
                  Economizou {decision.waterSaved}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Learning Status */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Status do Aprendizado</span>
          </div>
          <div className="text-xs space-y-1">
            <div>🧠 Analisando 24 sensores em tempo real</div>
            <div>📊 Processando dados climáticos de 3 fontes</div>
            <div>🌱 Adaptando estratégias para 4 tipos de cultura</div>
            <div>⚡ Próxima otimização em 15 minutos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};