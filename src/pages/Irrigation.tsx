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

const Irrigation = () => {
  const irrigationZones = [
    {
      id: 1,
      name: "Setor A - Milho",
      status: "active",
      humidity: "68%",
      nextIrrigation: "em 2h 30min",
      lastIrrigation: "2h atrás",
      duration: "45min"
    },
    {
      id: 2,
      name: "Setor B - Soja", 
      status: "paused",
      humidity: "72%",
      nextIrrigation: "em 45min",
      lastIrrigation: "4h atrás",
      duration: "30min"
    },
    {
      id: 3,
      name: "Setor C - Feijão",
      status: "scheduled",
      humidity: "65%", 
      nextIrrigation: "em 1h 15min",
      lastIrrigation: "6h atrás",
      duration: "35min"
    },
    {
      id: 4,
      name: "Setor D - Verduras",
      status: "active",
      humidity: "75%",
      nextIrrigation: "em 3h",
      lastIrrigation: "1h atrás", 
      duration: "20min"
    }
  ];

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
            <DashboardCard
              title="Setores Ativos"
              value="2"
              unit="/4"
              icon={Droplets}
              status="success"
            />
            <DashboardCard
              title="Consumo Hoje"
              value="2.450"
              unit="L"
              icon={Droplets}
              status="normal"
            />
            <DashboardCard
              title="Próxima Irrigação"
              value="45"
              unit="min"
              icon={Clock}
              status="warning"
            />
            <DashboardCard
              title="Eficiência"
              value="94"
              unit="%"
              icon={Zap}
              status="success"
            />
          </div>

          {/* Irrigation Zones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {irrigationZones.map((zone) => (
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
                      <div className="font-medium">{zone.humidity}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duração:</span>
                      <div className="font-medium">{zone.duration}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última:</span>
                      <div className="font-medium">{zone.lastIrrigation}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Próxima:</span>
                      <div className="font-medium">{zone.nextIrrigation}</div>
                    </div>
                  </div>

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
                </CardContent>
              </Card>
            ))}
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