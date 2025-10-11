import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Droplets, 
  Play, 
  Pause, 
  Clock, 
  MapPin,
  Settings,
  Timer,
  Zap
} from "lucide-react";

interface IrrigationZone {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'scheduled';
  humidity: number;
  nextIrrigationMinutes: number;
  lastIrrigationHours: number;
  duration: number;
}

interface IrrigationStats {
  activeSectors: number;
  totalSectors: number;
  dailyConsumption: number;
  nextIrrigationMinutes: number;
  avgEfficiency: number;
}

const Irrigation = () => {
  const [irrigationZones, setIrrigationZones] = useState<IrrigationZone[]>([]);
  const [stats, setStats] = useState<IrrigationStats | null>(null);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Irrigando</Badge>;
      case "paused":
        return <Badge variant="secondary">Pausado</Badge>;
      case "scheduled":
        return <Badge variant="outline">Agendado</Badge>;
      default:
        return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 0) return "calculando...";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `em ${h}h ${m}min`;
    return `em ${m}min`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, zonesRes] = await Promise.all([
          fetch('http://localhost:3001/api/irrigation/stats'),
          fetch('http://localhost:3001/api/irrigation/zones')
        ]);

        const statsData = await statsRes.json();
        const zonesData = await zonesRes.json();

        setStats(statsData);
        setIrrigationZones(zonesData);

      } catch (error) {
        console.error("Erro ao buscar dados de irrigação:", error);
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
              <h1 className="text-3xl font-bold">Sistema de Irrigação Inteligente</h1>
              <p className="text-muted-foreground">IA gerencia automaticamente 6 irrigadores em 50 hectares</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Timer className="h-4 w-4 mr-2" />
                Programar
              </Button>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Emergência
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading || !stats ? (
              Array(4).fill(0).map((_, index) => <Card key={index} className="h-[126px] animate-pulse bg-muted/50" />)
            ) : (
              <>
                <DashboardCard
                  title="Setores Ativos"
                  value={stats.activeSectors.toString()}
                  unit={`/${stats.totalSectors}`}
                  icon={Droplets}
                  status="success"
                />
                <DashboardCard
                  title="Consumo Hoje"
                  value={new Intl.NumberFormat('pt-BR').format(stats.dailyConsumption)}
                  unit="L"
                  icon={Droplets}
                  status="normal"
                />
                <DashboardCard
                  title="Próxima Irrigação"
                  value={stats.nextIrrigationMinutes.toString()}
                  unit="min"
                  icon={Clock}
                  status="warning"
                />
                <DashboardCard
                  title="Eficiência"
                  value={parseFloat(stats.avgEfficiency.toString()).toFixed(1)}
                  unit="%"
                  icon={Zap}
                  status="success"
                />
              </>
            )}
          </div>

          {/* Irrigation Zones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, index) => <Card key={index} className="h-[218px] animate-pulse bg-muted/50" />)
            ) : (
              irrigationZones.map((zone) => (
                <Card key={zone.id} className="p-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{zone.name}</span>
                      </CardTitle>
                      {getStatusBadge(zone.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Umidade:</span>
                        <div className="font-medium">{zone.humidity}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duração:</span>
                        <div className="font-medium">{zone.duration}min</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Última:</span>
                        <div className="font-medium">{zone.lastIrrigationHours}h atrás</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Próxima:</span>
                        <div className="font-medium">{formatTime(zone.nextIrrigationMinutes)}</div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Auto</span>
                      <Switch defaultChecked={zone.status !== "paused"} />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={zone.status === "active" ? "destructive" : "default"} 
                        size="sm"
                      >
                        {zone.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
              </Card>
            )))}
          </div>          

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Globais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Play className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Iniciar Todos</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Pause className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Pausar Todos</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Timer className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Agendar</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Settings className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm">Configurar</span>
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

export default Irrigation;