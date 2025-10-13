import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Plus,
  Brain,
  Target,
  Droplets,
  Zap,
  CheckCircle,
  Sprout,
  TrendingUp,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

interface Zone {
  id: number;
  name: string;
  crop: string;
  area: number;
  irrigator: string;
  aiStatus: string;
  efficiency: number;
  soilMoisture: number;
  patternsLearned: number;
  waterSaved: number;
  status: string;
}

interface AreaStats {
  activeZones: number;
  totalZones: number;
  totalCoverage: number;
  avgEfficiency: number;
  weeklySavings: number;
}

const Areas = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [stats, setStats] = useState<AreaStats | null>(null);
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
        return <Badge variant="secondary">Treinando</Badge>; // Status hipotético
      case "Manutenção":
        return <Badge variant="destructive">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Indefinido'}</Badge>;
    }
  };

  const getCoverageStatus = (coverage: string) => {
    switch (coverage) {
      case "Completa":
        return <Badge className="bg-success text-success-foreground">Completa</Badge>;
      case "Parcial":
        return <Badge variant="outline" className="border-warning text-warning">Parcial</Badge>;
      case "Sem cobertura":
        return <Badge variant="destructive">Sem Cobertura</Badge>;
      default:
        return <Badge className="bg-success text-success-foreground">Completa</Badge>;
    }
  };

  const getZoneStatusIcon = (status: string) => {
    const props = { className: "h-5 w-5", title: status };
    switch (status) {
      case "Otimizado":
        return <CheckCircle {...props} className={`${props.className} text-success`} />;
      case "Especialista":
      case "Aprendendo":
        return <Brain {...props} className={`${props.className} text-primary animate-pulse`} />;
      case "Treinando":
        return <TrendingUp {...props} className={`${props.className} text-accent`} />;
      case "Manutenção":
        return <AlertTriangle {...props} className={`${props.className} text-destructive`} />;
      default:
        return <HelpCircle {...props} className={`${props.className} text-muted-foreground`} />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, zonesRes] = await Promise.all([
          fetch('http://localhost:3001/api/areas/stats'),
          fetch('http://localhost:3001/api/areas/zones')
        ]);

        const statsData = await statsRes.json();
        const zonesData = await zonesRes.json();

        setStats(statsData);
        setZones(zonesData);
      } catch (error) {
        console.error("Erro ao buscar dados das zonas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ProgressCircle = ({ percentage }: { percentage: number }) => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
  
    let colorClass = "text-success";
    if (percentage < 90) colorClass = "text-warning";
    if (percentage < 75) colorClass = "text-destructive";
    if (percentage === 0) colorClass = "text-muted-foreground";
  
    return (
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-muted/10"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <circle
            className={`${colorClass} transition-all duration-500`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{percentage}%</span>
          <span className="text-xs text-muted-foreground">Eficiência</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Zonas de Cobertura Inteligente</h1>
              <p className="text-muted-foreground">6 irrigadores com IA cobrindo 50 hectares em zonas otimizadas</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Treinar IA Global
              </Button>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Otimizar Cobertura
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading || !stats ? (
              Array(4).fill(0).map((_, index) => <Card key={index} className="h-[126px] animate-pulse bg-muted/50" />)
            ) : (
              <>
                <DashboardCard
                  title="Zonas Ativas"
                  value={stats.activeZones.toString()}
                  unit={`/${stats.totalZones}`}
                  icon={MapPin}
                  status={stats.activeZones < stats.totalZones ? "warning" : "success"}
                />
                <DashboardCard
                  title="Cobertura Total"
                  value={parseFloat(stats.totalCoverage.toString()).toFixed(1)}
                  unit=" hectares"
                  icon={Target}
                  status="success"
                />
                <DashboardCard
                  title="Eficiência Média"
                  value={parseFloat(stats.avgEfficiency.toString()).toFixed(1)}
                  unit="%"
                  icon={Zap}
                  status="success"
                />
                <DashboardCard
                  title="Economia Semanal"
                  value={new Intl.NumberFormat('pt-BR').format(stats.weeklySavings)}
                  unit="L"
                  icon={Droplets}
                  status="success"
                />
              </>
            )}
          </div>

          {/* Zones Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, index) => <Card key={index} className="h-[380px] animate-pulse bg-muted/50" />)
            ) : (
              zones.map((zone) => (
              <Card key={zone.id} className={`relative ${zone.status !== 'Ativo' ? 'bg-muted/30 border-dashed' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sprout className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{zone.crop || 'Sem cultura'} • {zone.area} ha</p>
                      </div>
                    </div>
                    {getAIStatusBadge(zone.aiStatus)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-primary">{zone.efficiency}%</div>
                    <p className="text-sm text-muted-foreground">Eficiência Hídrica</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Irrigador:</span>
                      <div className="font-medium">{zone.irrigator}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Padrões ML:</span>
                      <div className="font-medium">{zone.patternsLearned}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Umidade:</span>
                      <div className="font-medium">{zone.soilMoisture}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Economia:</span>
                      <div className="font-medium text-success">{zone.waterSaved}L</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cobertura:</span>
                      {getCoverageStatus(zone.status === 'Ativo' ? 'Completa' : 'Sem cobertura')}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Brain className="h-4 w-4 mr-1" />
                      Status IA
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Target className="h-4 w-4 mr-1" />
                      Otimizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )))}
          </div>          

          {/* Farm Coverage Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Mapa de Cobertura Inteligente</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Visão geral da eficiência e status de cada zona da fazenda.
              </p>
            </CardHeader>
            <CardContent>
              <div className="p-4 sm:p-6 bg-muted/30 rounded-xl">
                {loading ? <p className="text-center text-muted-foreground">Carregando mapa de cobertura...</p> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zones.map((zone) => {
                      const efficiencyValue = parseFloat(zone.efficiency.toString()) || 0;
                      return (
                        <div key={zone.id} className={`p-4 rounded-xl bg-background border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out ${zone.status !== 'Ativo' ? 'opacity-50' : ''}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="font-bold text-foreground">{zone.name}</p>
                              <p className="text-xs text-muted-foreground">{zone.crop || 'Sem cultura'}</p>
                            </div>
                            {getZoneStatusIcon(zone.aiStatus)}
                          </div>
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ProgressCircle percentage={efficiencyValue} />
                            <div className="text-sm font-medium text-muted-foreground">{zone.area} ha</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Inteligentes por Zona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Brain className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Treinar IA Global</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Target className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Otimizar Cobertura</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Zap className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Análise Eficiência</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Plus className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Nova Zona</span>
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

export default Areas;