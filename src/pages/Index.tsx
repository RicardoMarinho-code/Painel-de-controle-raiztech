import { useFetch } from "@/hooks/useFetch";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ZoneMap } from "@/components/ZoneMap";
import { MLAnalyticsCharts } from "@/components/MLAnalyticsCharts";
import { AIDecisionCenter } from "@/components/AIDecisionCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  Thermometer, 
  Gauge, 
  Sun, 
  Battery,
  Wifi,
  Brain,
  TrendingUp,
  MapPin,
  Zap,
  Target,
  CheckCircle
} from "lucide-react";
import farmHero from "@/assets/farm-hero.jpg";

const Index = () => {
  // Tipagem para os dados que virão da API
  interface FarmStats {
    activeIrrigators: { value: number; unit: string };
    waterEfficiency: { value: number; unit: string };
    learningCultures: { value: number; unit: string };
    totalCoverage: { value: number; unit: string };
  }
  interface IrrigatorSummary {
    id: number;
    name: string;
    culture: string;
    zone: string;
    aiStatus: string;
    efficiency: string;
    lastDecision: string;
    nextAction: string;
  }

  // Usando o hook useFetch para buscar os dados
  const { data: farmStats, loading: loadingStats } = useFetch<FarmStats>('/dashboard/farm-stats', {
    activeIrrigators: { value: 0, unit: "/0" },
    waterEfficiency: { value: 0, unit: "%" },
    learningCultures: { value: 0, unit: " culturas" },
    totalCoverage: { value: 0, unit: " hectares" },
  });
  const { data: irrigators, loading: loadingIrrigators } = useFetch<IrrigatorSummary[]>('/dashboard/irrigators-summary', []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-glow p-8 text-primary-foreground">
            <div className="absolute inset-0 opacity-20">
              <img 
                src={farmHero} 
                alt="Smart Farm" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">RaizTech Control - IA Agrícola</h1>
              <p className="text-primary-foreground/90 mb-4">
                Sistema de Machine Learning embarcado gerenciando 50 hectares de forma autônoma
              </p>
              <div className="flex items-center space-x-4">
                <StatusIndicator status="online" label="6 Irrigadores Inteligentes" className="text-white" />
                <StatusIndicator status="online" label="IA Aprendendo 3 Culturas" className="text-white" />
                <StatusIndicator status="online" label="Cobertura Completa" className="text-white" />
              </div>
            </div>
          </div>

          {/* Farm Intelligence Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Irrigadores Ativos"
              value={String(farmStats.activeIrrigators.value)}
              unit={farmStats.activeIrrigators.unit}
              icon={Droplets}
              status="success"
              trend="stable"
              aiControlled
              confidence={98}
              lastDecision="Todos otimizados pela IA"
            />
            <DashboardCard 
              title="Eficiência Hídrica"
              value={String(farmStats.waterEfficiency.value)}
              unit={farmStats.waterEfficiency.unit}
              icon={Target}
              status="success"
              trend="up"
              aiControlled
              confidence={95}
              lastDecision="+12% com otimização ML"
            />
            <DashboardCard 
              title="IA em Aprendizado"
              value={String(farmStats.learningCultures.value)}
              unit={farmStats.learningCultures.unit}
              icon={Brain}
              status="normal"
              trend="up"
              aiControlled
              confidence={89}
              lastDecision="Novos padrões identificados"
            />
            <DashboardCard 
              title="Cobertura da Fazenda"
              value={String(farmStats.totalCoverage.value)}
              unit={farmStats.totalCoverage.unit}
              icon={MapPin}
              status="success"
              trend="stable"
              aiControlled
              confidence={100}
              lastDecision="Monitoramento 24/7"
            />
          </div>

          {/* AI Decision Center */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIDecisionCenter />
            
            {/* Controls and Status */}
            <div className="space-y-6">
            {/* AI Decision System */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Sistema de IA - Decisões Autônomas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingIrrigators ? (
                  <p className="text-sm text-muted-foreground text-center">Carregando irrigadores...</p>
                ) : (
                  irrigators.map((irrigator: any) => (
                    <div key={irrigator.id} className="p-4 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{irrigator.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {irrigator.zone} • {irrigator.culture}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={irrigator.aiStatus === "Otimizado" ? "default" : "secondary"}
                            className={irrigator.aiStatus === "Otimizado" ? "bg-success text-success-foreground" : ""}
                          >
                            {irrigator.aiStatus === "Otimizado" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Brain className="h-3 w-3 mr-1" />
                            )}
                            {irrigator.aiStatus}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {irrigator.efficiency}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Última Decisão:</span>
                          <div className="font-medium">{irrigator.lastDecision}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Próxima Ação:</span>
                          <div className="font-medium">{irrigator.nextAction}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">IA analisou 847 padrões climáticos esta semana</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Status da Inteligência</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 animate-pulse-if-loading" data-loading={loadingStats}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rede ML</span>
                    <div className="flex items-center space-x-1">
                      <Wifi className="h-4 w-4 text-success" />
                      <span className="text-sm text-success">Sincronizada</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cobertura da Fazenda</span>
                    <span className="text-sm font-medium text-success">100%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Irrigadores Ativos</span>
                    <span className="text-sm text-success font-medium">{farmStats.activeIrrigators.value}{farmStats.activeIrrigators.unit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Culturas Aprendidas</span>
                    <span className="text-sm font-medium">{farmStats.learningCultures.value}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Eficiência Média</span>
                    <span className="text-sm text-success font-medium">94.2%</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Padrões Identificados Hoje:</div>
                  <div className="space-y-1">
                    <div className="text-xs">• Milho: Redução hídrica por alta umidade</div>
                    <div className="text-xs">• Soja: Ajuste por previsão de chuva</div>
                    <div className="text-xs">• Feijão: Otimização de horário</div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Análise Completa da IA
                </Button>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Mapa das Zonas */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Mapa das Zonas de Irrigação</h3>
            <ZoneMap />
          </div>

          {/* Análise Avançada de ML */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Análise de Machine Learning</h3>
            <MLAnalyticsCharts />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
