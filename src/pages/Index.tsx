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
  const farmStats = [
    {
      title: "Irrigadores Ativos",
      value: "6",
      unit: "/6",
      icon: Droplets,
      status: "success" as const,
      trend: "stable" as const,
      aiControlled: true,
      confidence: 98,
      lastDecision: "Todos otimizados pela IA"
    },
    {
      title: "Eficiência Hídrica",
      value: "94.2",
      unit: "%",
      icon: Target,
      status: "success" as const,
      trend: "up" as const,
      aiControlled: true,
      confidence: 95,
      lastDecision: "+12% com otimização ML"
    },
    {
      title: "IA em Aprendizado",
      value: "3",
      unit: " culturas",
      icon: Brain,
      status: "normal" as const,
      trend: "up" as const,
      aiControlled: true,
      confidence: 89,
      lastDecision: "615 padrões identificados"
    },
    {
      title: "Cobertura da Fazenda",
      value: "50",
      unit: " hectares",
      icon: MapPin,
      status: "success" as const,
      trend: "stable" as const,
      aiControlled: true,
      confidence: 100,
      lastDecision: "Monitoramento 24/7"
    }
  ];

  const irrigators = [
    {
      id: 1,
      name: "Irrigador A - Milho",
      culture: "Milho",
      zone: "Zona Norte",
      aiStatus: "Otimizado",
      efficiency: "96%",
      lastDecision: "Irrigou 35min - 45L",
      nextAction: "Analisando clima",
      soilMoisture: "68%",
      coverage: "8.5 hectares"
    },
    {
      id: 2,
      name: "Irrigador B - Soja",
      culture: "Soja", 
      zone: "Zona Sul",
      aiStatus: "Aprendendo",
      efficiency: "89%",
      lastDecision: "Aguardou chuva",
      nextAction: "Irrigação programada 2h",
      soilMoisture: "72%",
      coverage: "7.2 hectares"
    },
    {
      id: 3,
      name: "Irrigador C - Feijão",
      culture: "Feijão",
      zone: "Zona Leste", 
      aiStatus: "Otimizado",
      efficiency: "92%",
      lastDecision: "Reduziu irrigação",
      nextAction: "Standby - Chuva prevista",
      soilMoisture: "75%",
      coverage: "6.8 hectares"
    }
  ];

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
            {farmStats.map((stat, index) => (
              <DashboardCard key={index} {...stat} />
            ))}
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
                {irrigators.map((irrigator) => (
                  <div key={irrigator.id} className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{irrigator.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {irrigator.zone} • {irrigator.coverage}
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
                ))}
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">IA analisou 847 padrões climáticos esta semana</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intelligence Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Status da Inteligência</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
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
                    <span className="text-sm text-success font-medium">6/6</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Culturas Aprendidas</span>
                    <span className="text-sm font-medium">3</span>
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
