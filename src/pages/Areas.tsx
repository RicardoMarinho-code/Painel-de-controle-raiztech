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
  CheckCircle
} from "lucide-react";

const Areas = () => {
  const zones = [
    {
      id: 1,
      name: "Zona Norte",
      crop: "Milho",
      area: "8.5",
      irrigator: "Irrigador A1",
      aiStatus: "Otimizado",
      efficiency: "96.2%",
      coverage: "Completa",
      soilMoisture: "68%",
      patternsLearned: 127,
      waterSaved: "340L/semana",
      status: "excellent"
    },
    {
      id: 2,
      name: "Zona Sul", 
      crop: "Soja",
      area: "7.2",
      irrigator: "Irrigador B2",
      aiStatus: "Aprendendo",
      efficiency: "89.1%",
      coverage: "Completa",
      soilMoisture: "72%",
      patternsLearned: 89,
      waterSaved: "280L/semana",
      status: "healthy"
    },
    {
      id: 3,
      name: "Zona Leste",
      crop: "Feijão",
      area: "6.8",
      irrigator: "Irrigador C3",
      aiStatus: "Otimizado",
      efficiency: "92.7%",
      coverage: "Completa",
      soilMoisture: "75%",
      patternsLearned: 156,
      waterSaved: "420L/semana",
      status: "excellent"
    },
    {
      id: 4,
      name: "Zona Oeste",
      crop: "Milho",
      area: "8.1",
      irrigator: "Irrigador D4",
      aiStatus: "Treinando",
      efficiency: "87.3%",
      coverage: "Parcial",
      soilMoisture: "65%",
      patternsLearned: 34,
      waterSaved: "120L/semana",
      status: "attention"
    },
    {
      id: 5,
      name: "Zona Centro",
      crop: "Verduras",
      area: "5.4",
      irrigator: "Irrigador E5",
      aiStatus: "Otimizado",
      efficiency: "94.8%",
      coverage: "Completa",
      soilMoisture: "78%",
      patternsLearned: 203,
      waterSaved: "380L/semana",
      status: "excellent"
    },
    {
      id: 6,
      name: "Zona Nordeste",
      crop: "Soja",
      area: "7.8",
      irrigator: "Irrigador F6",
      aiStatus: "Manutenção",
      efficiency: "0%",
      coverage: "Sem cobertura",
      soilMoisture: "N/A",
      patternsLearned: 0,
      waterSaved: "0L/semana",
      status: "critical"
    }
  ];

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
      case "Treinando":
        return <Badge variant="secondary">Treinando</Badge>;
      case "Manutenção":
        return <Badge variant="destructive">Manutenção</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
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
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getCropIcon = (crop: string) => {
    switch (crop.toLowerCase()) {
      case "milho": return "🌽";
      case "soja": return "🫘";
      case "feijão": return "🫘";
      case "verduras": return "🥬";
      case "tomate": return "🍅";
      default: return "🌱";
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
            <DashboardCard
              title="Zonas Ativas"
              value="5"
              unit="/6"
              icon={MapPin}
              status="warning"
            />
            <DashboardCard
              title="Cobertura Total"
              value="43.8"
              unit=" hectares"
              icon={Target}
              status="success"
            />
            <DashboardCard
              title="Eficiência Média"
              value="93.4"
              unit="%"
              icon={Zap}
              status="success"
            />
            <DashboardCard
              title="Economia Semanal"
              value="1.540"
              unit="L"
              icon={Droplets}
              status="success"
            />
          </div>

          {/* Zones Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {zones.map((zone) => (
              <Card key={zone.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCropIcon(zone.crop)}</div>
                      <div>
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{zone.crop} • {zone.area} ha</p>
                      </div>
                    </div>
                    {getAIStatusBadge(zone.aiStatus)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-primary">{zone.efficiency}</div>
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
                      <div className="font-medium">{zone.soilMoisture}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Economia:</span>
                      <div className="font-medium text-success">{zone.waterSaved}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cobertura:</span>
                      {getCoverageStatus(zone.coverage)}
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
            ))}
          </div>

          {/* Farm Coverage Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Mapa de Cobertura Inteligente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 min-h-[400px]">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Sistema de Cobertura Completa</h3>
                    <p className="text-muted-foreground mb-6">
                      6 irrigadores inteligentes com raio de ação otimizado por IA
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {zones.map((zone) => (
                      <div key={zone.id} className="p-4 rounded-lg bg-background border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-lg">{getCropIcon(zone.crop)}</div>
                          {zone.aiStatus === "Otimizado" ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : zone.aiStatus === "Manutenção" ? (
                            <div className="h-4 w-4 rounded-full bg-destructive" />
                          ) : (
                            <Brain className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="text-sm font-medium">{zone.name}</div>
                        <div className="text-xs text-muted-foreground">{zone.area} hectares</div>
                        <div className="text-xs text-primary mt-1">{zone.efficiency}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">🎯 Cobertura Otimizada</h4>
                    <div className="text-sm space-y-1">
                      <div>• Raio efetivo: 1,2-1,5 km por irrigador</div>
                      <div>• Sobreposição inteligente nas bordas</div>
                      <div>• Adaptação automática por cultura e terreno</div>
                      <div>• Redundância para segurança da irrigação</div>
                    </div>
                  </div>
                </div>
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