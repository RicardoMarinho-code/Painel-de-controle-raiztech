import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Thermometer, Zap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Zone {
  id: string;
  name: string;
  status: "active" | "idle" | "learning" | "error";
  soilMoisture: number;
  temperature: number;
  mlConfidence: number;
  crop: string;
  position: { x: number; y: number };
  coverage: number;
}

const zones: Zone[] = [
  {
    id: "Z1",
    name: "Zona Norte",
    status: "active",
    soilMoisture: 68,
    temperature: 24,
    mlConfidence: 94,
    crop: "Milho",
    position: { x: 20, y: 15 },
    coverage: 12.5
  },
  {
    id: "Z2", 
    name: "Zona Sul",
    status: "learning",
    soilMoisture: 45,
    temperature: 26,
    mlConfidence: 87,
    crop: "Soja",
    position: { x: 70, y: 75 },
    coverage: 12.5
  },
  {
    id: "Z3",
    name: "Zona Leste",
    status: "idle",
    soilMoisture: 72,
    temperature: 23,
    mlConfidence: 91,
    crop: "Feijão",
    position: { x: 75, y: 25 },
    coverage: 12.5
  },
  {
    id: "Z4",
    name: "Zona Oeste",
    status: "active",
    soilMoisture: 55,
    temperature: 25,
    mlConfidence: 96,
    crop: "Arroz",
    position: { x: 25, y: 65 },
    coverage: 12.5
  }
];

export const ZoneMap = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getStatusColor = (status: Zone["status"]) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "learning": return "bg-warning text-warning-foreground";
      case "idle": return "bg-secondary text-secondary-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
    }
  };

  const getStatusIcon = (status: Zone["status"]) => {
    switch (status) {
      case "active": return <Droplets className="h-4 w-4" />;
      case "learning": return <Zap className="h-4 w-4" />;
      case "idle": return <MapPin className="h-4 w-4" />;
      case "error": return <Thermometer className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa das Zonas de Irrigação - 50 Hectares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 rounded-lg h-96 border-2 border-border overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-border" style={{ left: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-border" style={{ top: `${i * 10}%` }} />
              ))}
            </div>

            {/* Zones */}
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={cn(
                  "absolute w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg",
                  selectedZone?.id === zone.id ? "ring-4 ring-primary ring-offset-2" : "",
                  "bg-card border-primary shadow-md"
                )}
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                onClick={() => setSelectedZone(zone)}
              >
                <div className="flex flex-col items-center justify-center h-full text-xs font-semibold">
                  <div className={cn("rounded-full p-1 mb-1", getStatusColor(zone.status))}>
                    {getStatusIcon(zone.status)}
                  </div>
                  <span className="text-foreground">{zone.id}</span>
                </div>
              </div>
            ))}

            {/* Coverage areas */}
            {zones.map((zone) => (
              <div
                key={`coverage-${zone.id}`}
                className="absolute rounded-full border-2 border-primary/30 bg-primary/10"
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  width: "120px",
                  height: "120px",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm">Irrigando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-sm">Aprendendo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-sm">Inativo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30"></div>
              <span className="text-sm">Área de Cobertura</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Zona</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedZone ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                <Badge className={getStatusColor(selectedZone.status)}>
                  {selectedZone.status === "active" && "Irrigando"}
                  {selectedZone.status === "learning" && "Aprendendo"}
                  {selectedZone.status === "idle" && "Inativo"}
                  {selectedZone.status === "error" && "Erro"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cultura:</span>
                  <span className="font-medium">{selectedZone.crop}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cobertura:</span>
                  <span className="font-medium">{selectedZone.coverage} ha</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Umidade do Solo:</span>
                  <span className="font-medium">{selectedZone.soilMoisture}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Temperatura:</span>
                  <span className="font-medium">{selectedZone.temperature}°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confiança ML:</span>
                  <span className="font-medium text-primary">{selectedZone.mlConfidence}%</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Configurar Irrigador
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Histórico ML
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione uma zona no mapa para ver os detalhes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};