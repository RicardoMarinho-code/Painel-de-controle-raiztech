import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Brain, 
  Activity, 
  Clock, 
  Zap, 
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

const outcomeConfig = {
  success: {
    Icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  warning: {
    Icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  pending: {
    Icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted/20",
  },
};

const DecisionItem = ({ decision }: { decision: AIDecision }) => {
  const config = outcomeConfig[decision.outcome];
  return (
    <div className="flex items-start space-x-4">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}>
        <config.Icon className="h-4 w-4" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{decision.decision}</p>
          <span className="text-xs text-muted-foreground">{decision.timestamp}</span>
        </div>
        <p className="text-xs text-muted-foreground">{decision.reasoning}</p>
        <div className="mt-1 flex items-center justify-between text-xs">
          <Badge variant="outline">{decision.zone}</Badge>
          {decision.waterSaved ? (
            <span className="font-medium text-success flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {decision.waterSaved} economizados
            </span>
          ) : (
            <span className={`font-medium ${config.color}`}>{decision.confidence}% conf.</span>
          )}
        </div>
      </div>
    </div>
  );
};

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

  //last 3 decisions
  const decisionsToShow = 3;

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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Status */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-center">
            <div className="text-lg font-bold text-primary dark:text-foreground">847</div>
            <div className="text-xs text-muted-foreground">Decisões hoje</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">1.240L</div>
            <div className="text-xs text-muted-foreground">Água economizada</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent dark:text-foreground">93%</div>
            <div className="text-xs text-muted-foreground">Precisão média</div>
          </div>
        </div>

        {/* Recent Decisions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Decisões Recentes</h4>
          {recentDecisions.length > 0 ? (
            <Dialog>
              <div className="space-y-4">
                {recentDecisions.slice(0, decisionsToShow).map((decision) => (
                  <DecisionItem key={decision.id} decision={decision} />
                ))}
              </div>
              {recentDecisions.length > decisionsToShow && (
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-primary">
                    Ver todas as {recentDecisions.length} decisões
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Histórico de Decisões Recentes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                  {recentDecisions.map((decision) => (
                    <DecisionItem key={decision.id} decision={decision} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-lg min-h-[200px]">
              <Brain className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">Nenhuma decisão recente</p>
              <p className="text-sm text-muted-foreground">A IA está monitorando ativamente.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};