import { useFetch } from "@/hooks/useFetch";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Droplets, 
  Target, 
  Zap, 
  Wifi,
  CheckCircle,
  TrendingUp,
  Settings,
  MapPin,
  Gauge
  Loader2
} from "lucide-react";

interface IrrigatorStats {
  activeIrrigators: number;
  totalIrrigators: number;
  averageEfficiency: number;
  totalCoverage: number;
  weeklySavings: number;
  averageConfidence: number;
}

interface IrrigatorDetails {
  id: number;
  name: string;
  zone: string;
  culture: string;
  aiStatus: string;
  efficiency: string;
  coverage: string;
  soilMoisture: string;
  patternsLearned: number;
  waterSaved: string;
  battery: string;
  connectivity: string;
  lastDecision: string;
}

const Sensors = () => {
  const { data: stats } = useFetch<IrrigatorStats>('/irrigators/summary-stats', {
    activeIrrigators: 0,
    totalIrrigators: 0,
    averageEfficiency: 0,
    totalCoverage: 0,
    weeklySavings: 0,
    averageConfidence: 0,
  });
  const { data: irrigators, loading } = useFetch<IrrigatorDetails[]>('/irrigators/details', []);

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case "Otimizado":
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Otimizado
        </Badge>;
      case "Aprendendo":
        return <Badge variant="outline" className="border-primary text-primary">
          <Brain className="h-3 w-3 mr-1" />
          Aprendendo
        </Badge>;
      case "Básico":
        return <Badge variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
          Treinando
        </Badge>;
      case "Manutenção":
        return <Badge variant="destructive">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
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
              <h1 className="text-3xl font-bold">Irrigadores Inteligentes</h1>
              <p className="text-muted-foreground">Sistema de Machine Learning embarcado - 6 irrigadores cobrindo 50 hectares</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Treinar IA
              </Button>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Eficiência Global
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <DashboardCard
              title="Irrigadores Ativos"
              value={String(stats.activeIrrigators)}
              unit={`/${stats.totalIrrigators}`}
              icon={Zap}
              status={stats.activeIrrigators < stats.totalIrrigators ? "warning" : "success"}
              aiControlled={true}
              confidence={96}
              lastDecision={`${stats.totalIrrigators - stats.activeIrrigators} em manutenção`}
            />
            <DashboardCard
              title="Eficiência Média"
              value={String(stats.averageEfficiency)}
              unit="%"
              icon={Target}
              status="success"
              aiControlled={true}
              confidence={95}
              lastDecision="Otimizada por ML"
            />
            <DashboardCard
              title="Cobertura Total"
              value={String(stats.totalCoverage)}
              unit=" hectares"
              icon={MapPin}
              status="success"
              aiControlled={true}
              confidence={100}
              lastDecision="Monitoramento ativo"
            />
            <DashboardCard
              title="Economia Semanal"
              value={String(stats.weeklySavings)}
              unit="L"
              icon={Droplets}
              status="success"
              aiControlled={true}
              confidence={97}
              lastDecision="IA preveniu desperdícios"
            />
            <DashboardCard
              title="Confiança da IA"
              value={String(stats.averageConfidence)}
              unit="%"
              icon={Brain}
              status="success"
              aiControlled={true}
              confidence={stats.averageConfidence}
              lastDecision="Análise em tempo real"
            />
          </div>

          {/* Irrigators Grid */}
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Carregando dados dos irrigadores...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {irrigators.map((irrigator) => (
              <Card key={irrigator.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{irrigator.name}</CardTitle>
                    {getAIStatusBadge(irrigator.aiStatus)}
                  </div>
                  <p className="text-sm text-muted-foreground">{irrigator.zone} • {irrigator.culture}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{irrigator.efficiency}</div>
                    <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                    <p className="text-xs text-muted-foreground mt-1">{irrigator.coverage}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Umidade:</span>
                      <div className="font-medium">{irrigator.soilMoisture}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Padrões ML:</span>
                      <div className="font-medium">{irrigator.patternsLearned}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Economia:</span>
                      <div className="font-medium text-success">{irrigator.waterSaved}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bateria:</span>
                      <div className="font-medium">{irrigator.battery}</div>
                    </div>
                  </div>

                  <div className="text-xs p-2 bg-primary/5 rounded border border-primary/20">
                    <div className="flex items-center space-x-1 mb-1">
                      <Brain className="h-3 w-3 text-primary" />
                      <strong className="text-primary">Última Decisão IA:</strong>
                    </div>
                    <div>{irrigator.lastDecision}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      🕒 Há 2 min • Confiança: {irrigator.aiStatus === "Otimizado" ? "96%" : irrigator.aiStatus === "Aprendendo" ? "89%" : "76%"}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Brain className="h-4 w-4 mr-1" />
                      Status IA
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Learning Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>Aprendizado de Machine Learning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">615</div>
                    <p className="text-sm text-muted-foreground">Padrões Totais Aprendidos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">1.540L</div>
                    <p className="text-sm text-muted-foreground">Água Economizada esta Semana</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-accent">93.4%</div>
                    <p className="text-sm text-muted-foreground">Eficiência Global</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">🧠 Status do Aprendizado</h4>
                  <div className="text-sm space-y-1">
                    <div>• Milho: 161 padrões - Comportamento hídrico otimizado</div>
                    <div>• Soja: 89 padrões - Aprendendo correlações climáticas</div>
                    <div>• Feijão: 156 padrões - Micro-irrigação para eficiência máxima</div>
                    <div>• Verduras: 203 padrões - Especialista em cultura sensível</div>
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

export default Sensors;