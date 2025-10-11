import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { StatusIndicator } from "@/components/StatusIndicator";
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
} from "lucide-react";

interface Irrigator {
  id: number;
  name: string;
  zone: string;
  culture: string;
  aiStatus: string;
  efficiency: number;
  coverage: number;
  soilMoisture: number;
  battery: number;
  lastDecision: string;
  patternsLearned: number;
  waterSaved: number;
  status: string;
}

interface SensorStats {
  activeIrrigators: number;
  totalIrrigators: number;
  avgEfficiency: number;
  totalCoverage: number;
  weeklySavings: number;
  avgConfidence: number;
}

const Sensors = () => {
  const [irrigators, setIrrigators] = useState<Irrigator[]>([]);
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [loading, setLoading] = useState(true);

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case "Otimizado":
      case "Especialista":
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Otimizado
        </Badge>;
      case "Aprendendo":
        return <Badge variant="outline" className="border-primary text-primary">
          <Brain className="h-3 w-3 mr-1" />
          Aprendendo
        </Badge>;
      case "Treinando":
        return <Badge variant="secondary">
          <TrendingUp className="h-3 w-3 mr-1" />
          Treinando
        </Badge>; // Status hipotético, não presente no schema
      case "Manutenção":
        return <Badge variant="destructive">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, irrigatorsRes] = await Promise.all([
          fetch('http://localhost:3001/api/sensors/stats'),
          fetch('http://localhost:3001/api/sensors/irrigators')
        ]);

        const statsData = await statsRes.json();
        const irrigatorsData = await irrigatorsRes.json();

        setStats(statsData);
        setIrrigators(irrigatorsData);

      } catch (error) {
        console.error("Erro ao buscar dados dos irrigadores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Monitoramento de Irrigadores</h1>
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
            {loading || !stats ? (
              Array(5).fill(0).map((_, index) => <Card key={index} className="h-[170px] animate-pulse bg-muted/50" />)
            ) : (
              <>
                <DashboardCard
                  title="Irrigadores Ativos"
                  value={stats.activeIrrigators.toString()}
                  unit={`/${stats.totalIrrigators}`}
                  icon={Zap}
                  status={stats.activeIrrigators < stats.totalIrrigators ? "warning" : "success"}
                  aiControlled={true}
                  confidence={99}
                  lastDecision={`${stats.totalIrrigators - stats.activeIrrigators} em manutenção`}
                />
                <DashboardCard
                  title="Eficiência Média"
                  value={parseFloat(stats.avgEfficiency.toString()).toFixed(1)}
                  unit="%"
                  icon={Target}
                  status="success"
                  aiControlled={true}
                  confidence={95}
                  lastDecision="Otimizada por ML"
                />
                <DashboardCard
                  title="Cobertura Total"
                  value={parseFloat(stats.totalCoverage.toString()).toFixed(1)}
                  unit=" hectares"
                  icon={MapPin}
                  status="success"
                  aiControlled={true}
                  confidence={100}
                  lastDecision="Monitoramento ativo"
                />
                <DashboardCard
                  title="Economia Semanal"
                  value={new Intl.NumberFormat('pt-BR').format(stats.weeklySavings)}
                  unit="L"
                  icon={Droplets}
                  status="success"
                  aiControlled={true}
                  confidence={97}
                  lastDecision="IA preveniu desperdícios"
                />
                <DashboardCard
                  title="Confiança da IA"
                  value={parseFloat(stats.avgConfidence.toString()).toFixed(1)}
                  unit="%"
                  icon={Brain}
                  status="success"
                  aiControlled={true}
                  confidence={94}
                  lastDecision="Análise em tempo real"
                />
              </>
            )}
          </div>

          {/* Irrigators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, index) => <Card key={index} className="h-[430px] animate-pulse bg-muted/50" />)
            ) : (
              irrigators.map((irrigator) => (
                <Card key={irrigator.id} className={irrigator.status !== 'Ativo' ? 'bg-muted/30 border-dashed' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{irrigator.name}</CardTitle>
                      {getAIStatusBadge(irrigator.aiStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">{irrigator.zone} • {irrigator.culture}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{irrigator.efficiency}%</div>
                      <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                      <p className="text-xs text-muted-foreground mt-1">{irrigator.coverage} hectares</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Umidade:</span>
                        <div className="font-medium">{irrigator.soilMoisture}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Padrões ML:</span>
                        <div className="font-medium">{irrigator.patternsLearned}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Economia:</span>
                        <div className="font-medium text-success">{irrigator.waterSaved}L</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bateria:</span>
                        <div className={`font-medium ${irrigator.battery < 20 ? 'text-destructive' : ''}`}>{irrigator.battery}%</div>
                      </div>
                    </div>

                    <div className="text-xs p-2 bg-primary/5 rounded border border-primary/20">
                      <div className="flex items-center space-x-1 mb-1">
                        <Brain className="h-3 w-3 text-primary" />
                        <strong className="text-primary">Última Decisão IA:</strong>
                      </div>
                      <div className="truncate">{irrigator.lastDecision || "Nenhuma decisão recente"}</div>
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
              ))
            )}
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
                    <div className="text-2xl font-bold text-success">93.4%</div>
                    <p className="text-sm text-muted-foreground">Eficiência Global</p>
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