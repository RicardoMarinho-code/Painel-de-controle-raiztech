import { useEffect, useState } from "react";
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
  Eye,
  Loader2
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
  const [summary, setSummary] = useState({
    decisionsToday: 0,
    waterSavedToday: 0,
    averageConfidence: 0,
  });
  const [recentDecisions, setRecentDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/ai-summary`);
        if (!response.ok) {
          throw new Error('Falha ao buscar resumo da IA.');
        }
        const data = await response.json();
        setSummary(data.summary);
        setRecentDecisions(data.recentDecisions);
      } catch (err) {
        console.error("Erro detalhado ao buscar dados:", err); // Loga o erro completo no console do navegador
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          setError("Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando e sem erros.");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAiSummary();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{summary.decisionsToday}</div>
              <div className="text-xs text-muted-foreground">Decisões hoje</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{summary.waterSavedToday}L</div>
              <div className="text-xs text-muted-foreground">Água economizada</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-accent">{summary.averageConfidence}%</div>
              <div className="text-xs text-muted-foreground">Precisão média</div>
            </div>
          </div>
        )}

        {/* Recent Decisions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Decisões Recentes</h4>
          {loading && <p className="text-xs text-muted-foreground">Carregando...</p>}
          {!loading && !error && recentDecisions.map((decision) => (
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
                
                {decision.waterSaved && Number(decision.waterSaved) > 0 && (
                  <div className="mt-2 text-xs text-success font-medium">
                    <Zap className="h-3 w-3 inline mr-1" />
                    Economizou {decision.waterSaved}L
                  </div>
                )}
              </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};