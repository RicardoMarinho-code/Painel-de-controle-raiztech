import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Calendar
} from "lucide-react";

const Weather = () => {
  const currentWeather = {
    temperature: "25°C",
    humidity: "68%",
    windSpeed: "12 km/h",
    visibility: "10 km",
    condition: "Parcialmente nublado",
    rainChance: "30%"
  };

  const forecast = [
    { day: "Hoje", temp: "25°C", icon: "☁️", rain: "30%", condition: "Nublado" },
    { day: "Amanhã", temp: "27°C", icon: "🌤️", rain: "10%", condition: "Sol e nuvens" },
    { day: "Quarta", temp: "23°C", icon: "🌧️", rain: "80%", condition: "Chuva" },
    { day: "Quinta", temp: "26°C", icon: "☀️", rain: "5%", condition: "Ensolarado" },
    { day: "Sexta", temp: "24°C", icon: "⛈️", rain: "70%", condition: "Tempestade" },
    { day: "Sábado", temp: "28°C", icon: "☀️", rain: "0%", condition: "Ensolarado" },
    { day: "Domingo", temp: "29°C", icon: "🌤️", rain: "15%", condition: "Sol e nuvens" }
  ];

  const irrigationRecommendations = [
    {
      sector: "Setor A - Milho",
      recommendation: "Irrigar normalmente",
      reason: "Sem previsão de chuva significativa",
      action: "continue",
      savings: null
    },
    {
      sector: "Setor B - Soja", 
      recommendation: "Adiar irrigação",
      reason: "Chuva prevista para quarta-feira (80%)",
      action: "delay",
      savings: "~1.200L"
    },
    {
      sector: "Setor C - Feijão",
      recommendation: "Irrigar hoje",
      reason: "Umidade baixa + sol forte amanhã",
      action: "irrigate",
      savings: null
    },
    {
      sector: "Setor D - Verduras",
      recommendation: "Reduzir irrigação",
      reason: "Alta umidade atual + tempestade sexta",
      action: "reduce",
      savings: "~800L"
    }
  ];

  const getRecommendationBadge = (action: string) => {
    switch (action) {
      case "continue":
        return <Badge className="bg-success text-success-foreground">Continuar</Badge>;
      case "delay":
        return <Badge variant="secondary">Adiar</Badge>;
      case "irrigate":
        return <Badge className="bg-accent text-accent-foreground">Irrigar</Badge>;
      case "reduce":
        return <Badge variant="outline">Reduzir</Badge>;
      default:
        return <Badge variant="secondary">Analisar</Badge>;
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
              <h1 className="text-3xl font-bold">Inteligência Climática</h1>
              <p className="text-muted-foreground">IA analisa clima para otimizar decisões de irrigação automaticamente</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Histórico
              </Button>
              <Button>
                <Cloud className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Current Weather */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="h-6 w-6" />
                <span>Condições Atuais</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌤️</div>
                  <div className="text-2xl font-bold">{currentWeather.temperature}</div>
                  <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
                </div>
                <div className="text-center">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xl font-semibold">{currentWeather.humidity}</div>
                  <p className="text-sm text-muted-foreground">Umidade</p>
                </div>
                <div className="text-center">
                  <Wind className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <div className="text-xl font-semibold">{currentWeather.windSpeed}</div>
                  <p className="text-sm text-muted-foreground">Vento</p>
                </div>
                <div className="text-center">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-xl font-semibold">{currentWeather.visibility}</div>
                  <p className="text-sm text-muted-foreground">Visibilidade</p>
                </div>
                <div className="text-center">
                  <CloudRain className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xl font-semibold">{currentWeather.rainChance}</div>
                  <p className="text-sm text-muted-foreground">Chuva</p>
                </div>
                <div className="text-center">
                  <Sun className="h-6 w-6 mx-auto mb-2 text-warning" />
                  <div className="text-xl font-semibold">UV 6</div>
                  <p className="text-sm text-muted-foreground">Índice UV</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Previsão para 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-sm font-medium mb-2">{day.day}</div>
                    <div className="text-2xl mb-2">{day.icon}</div>
                    <div className="text-lg font-bold mb-1">{day.temp}</div>
                    <div className="text-sm text-primary mb-1">{day.rain}</div>
                    <div className="text-xs text-muted-foreground">{day.condition}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Irrigation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CloudRain className="h-5 w-5 text-primary" />
                <span>Recomendações Inteligentes</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Baseado na previsão do tempo e condições dos sensores
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {irrigationRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{rec.sector}</h3>
                        {getRecommendationBadge(rec.action)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>{rec.recommendation}</strong> - {rec.reason}
                      </p>
                      {rec.savings && (
                        <p className="text-sm text-success">Economia estimada: {rec.savings}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Aplicar
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-primary mb-2">💡 Resumo de Economia</h4>
                <p className="text-sm text-muted-foreground">
                  Seguindo as recomendações, você pode economizar aproximadamente <strong>2.000 litros</strong> de água 
                  esta semana, mantendo a qualidade da irrigação.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weather Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardCard
              title="Chuva Semanal"
              value="45"
              unit="mm"
              icon={CloudRain}
              status="success"
            />
            <DashboardCard
              title="Temperatura Média"
              value="26"
              unit="°C"
              icon={Thermometer}
              status="normal"
            />
            <DashboardCard
              title="Umidade Média"
              value="68"
              unit="%"
              icon={Droplets}
              status="success"
            />
            <DashboardCard
              title="Economia Projetada"
              value="2.000"
              unit="L"
              icon={CloudRain}
              status="success"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Weather;