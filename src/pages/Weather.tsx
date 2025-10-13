import { useState, useEffect } from "react";
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

interface CurrentWeather {
  temperature: string;
  humidity: string;
  windSpeed: string;
  condition: string;
  rainChance: string;
}

interface Recommendation {
  sector: string;
  recommendation: string;
  reason: string;
  action: string;
  savings: string | null;
}

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const forecast = [
    { day: "Hoje", temp: "25°C", icon: "☁️", rain: "30%", condition: "Nublado" },
    { day: "Amanhã", temp: "27°C", icon: "🌤️", rain: "10%", condition: "Sol e nuvens" },
    { day: "Quarta", temp: "23°C", icon: "🌧️", rain: "80%", condition: "Chuva" },
    { day: "Quinta", temp: "26°C", icon: "☀️", rain: "5%", condition: "Ensolarado" },
    { day: "Sexta", temp: "28°C", icon: "☀️", rain: "0%", condition: "Ensolarado" },
    { day: "Sábado", temp: "27°C", icon: "🌤️", rain: "10%", condition: "Parcialmente nublado" },
    { day: "Domingo", temp: "24°C", icon: "🌧️", rain: "60%", condition: "Chuva forte" }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [weatherRes, recommendationsRes] = await Promise.all([
          fetch('http://localhost:3001/api/weather/current'),
          fetch('http://localhost:3001/api/weather/recommendations')
        ]);

        const weatherData = await weatherRes.json();
        const recommendationsData = await recommendationsRes.json();

        setCurrentWeather(weatherData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error("Erro ao buscar dados climáticos:", error);
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
              {loading || !currentWeather ? (
                <div className="h-[88px] animate-pulse bg-muted/50 rounded-lg" />
              ) : (
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
                    <Wind className="h-6 w-6 mx-auto mb-2 text-success" />
                    <div className="text-xl font-semibold">{currentWeather.windSpeed}</div>
                    <p className="text-sm text-muted-foreground">Vento</p>
                  </div>
                  <div className="text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold">10 km</div>
                    <p className="text-sm text-muted-foreground">Visibilidade</p>
                  </div>
                  <div className="text-center">
                    <CloudRain className="h-6 w-6 mx-auto mb-2 text-success" />
                    <div className="text-xl font-semibold">{currentWeather.rainChance}</div>
                    <p className="text-sm text-muted-foreground">Chuva</p>
                  </div>
                  <div className="text-center">
                    <Sun className="h-6 w-6 mx-auto mb-2 text-warning" />
                    <div className="text-xl font-semibold">UV 6</div>
                    <p className="text-sm text-muted-foreground">Índice UV</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Previsão para 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              {loading ? <p className="text-center text-muted-foreground">Gerando recomendações...</p> : (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
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
              )}
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