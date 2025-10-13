import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
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
  MoreVertical
} from "lucide-react";

// Interface para definir o formato dos dados que virão da API
interface AiDecision {
  id: number;
  irrigator: string;
  zone: string;
  decision: string;
  reason: string;
  time: string;
  confidence: string;
  waterSaved: string;
  status: string;
  aiModel: string;
}

const Schedule = () => {
  const [aiDecisions, setAiDecisions] = useState<AiDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/decisoes')
      .then(res => res.json())
      .then(data => setAiDecisions(data))
      .catch(() => setError("Não foi possível carregar as decisões da IA."))
      .finally(() => setLoading(false));
  }, []); // O array vazio `[]` faz com que o `useEffect` rode apenas uma vez, quando o componente é montado.

  const statusConfig: { [key: string]: { icon: JSX.Element; iconBg: string; border: string; text: string; label: string; } } = {
    executed: {
      icon: <CheckCircle className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-success",
      border: "border-success",
      text: "text-success",
      label: "Executada",
    },
    active: {
      icon: <Zap className="h-5 w-5 text-primary-foreground animate-pulse" />,
      iconBg: "bg-primary",
      border: "border-primary",
      text: "text-primary",
      label: "Ativa",
    },
    scheduled: {
      icon: <Clock className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-accent",
      border: "border-accent",
      text: "text-accent",
      label: "Agendada",
    },
    default: {
      icon: <Brain className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-muted-foreground",
      border: "border-muted-foreground",
      text: "text-muted-foreground",
      label: "Pendente",
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "executed":
        return statusConfig.executed;
      case "active":
        return statusConfig.active;
      case "scheduled":
        return statusConfig.scheduled;
      default:
        return statusConfig.default;
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
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Decisões Autônomas da IA</h1>
                  <p className="text-muted-foreground mt-1">A IA decide quando irrigar com base em padrões aprendidos em tempo real.</p>
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
            </CardHeader>
            <CardContent className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted/40 rounded-lg">
                  <div className="text-2xl font-bold text-primary">615</div>
                  <p className="text-sm text-primary">Padrões Aprendidos</p>
                </div>
                <div className="text-center p-4 bg-muted/40 rounded-lg">
                  <div className="text-2xl font-bold text-success">96.8%</div>
                  <p className="text-sm text-muted-foreground">Precisão Decisões</p>
                </div>
                <div className="text-center p-4 bg-muted/40 rounded-lg">
                  <div className="text-2xl font-bold text-success">94.2%</div>
                  <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                </div>
                <div className="text-center p-4 bg-muted/40 rounded-lg">
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
            {loading && <p>Carregando decisões...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {!loading && !error && (
              <div className="relative pl-8 space-y-6 border-l-2 border-dashed border-border">
                {aiDecisions.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma decisão encontrada no banco de dados.</p>
                ) : (
                  aiDecisions.map((decision) => {
                    const statusInfo = getStatusInfo(decision.status);
                    return (
                      <div key={decision.id} className="relative">
                        <div className={`absolute -left-[23px] top-1 flex h-10 w-10 items-center justify-center rounded-full ${statusInfo.iconBg} ring-8 ring-background`}>
                          {statusInfo.icon}
                        </div>
                        <Card className={`ml-6 transition-colors border-l-4 ${statusInfo.border} hover:shadow-md`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-foreground">{decision.irrigator}</h3>
                                  <Badge variant="outline">{decision.zone}</Badge>
                                </div>
                                <p className={`font-medium mb-2 ${statusInfo.text} dark:text-foreground`}>{decision.decision}</p>
                                <p className="text-sm text-muted-foreground">{decision.reason}</p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {decision.time}</span>
                                  <span className="flex items-center gap-1 text-success font-medium"><TrendingUp className="h-3 w-3" /> {decision.confidence} Confiança</span>
                                  <span className="flex items-center gap-1 text-success font-medium"><Zap className="h-3 w-3" /> {decision.waterSaved} economizados</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {getAIModelBadge(decision.aiModel)}
                                <Badge variant="outline" className={`border-current ${statusInfo.text}`}>{statusInfo.label}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;