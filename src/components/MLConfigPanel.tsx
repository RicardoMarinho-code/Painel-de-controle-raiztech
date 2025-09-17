import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, Zap, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { defaultMLConfig } from "@/lib/data";

export const MLConfigPanel = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState(defaultMLConfig);

  const handleSave = () => {
    toast({
      title: "Configurações Salvas",
      description: "As configurações de ML foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    setConfig(defaultMLConfig);
    toast({
      title: "Configurações Restauradas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Configurações Avançadas de ML</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="algorithms" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="algorithms">Algoritmos</TabsTrigger>
          <TabsTrigger value="sensors">Sensores</TabsTrigger>
          <TabsTrigger value="irrigation">Irrigação</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Configurações de Aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-learning">Aprendizado Automático</Label>
                  <Switch 
                    id="auto-learning"
                    checked={config.autoLearning}
                    onCheckedChange={(checked) => setConfig({...config, autoLearning: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="adaptive-mode">Modo Adaptativo</Label>
                  <Switch 
                    id="adaptive-mode"
                    checked={config.adaptiveMode}
                    onCheckedChange={(checked) => setConfig({...config, adaptiveMode: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Limite de Confiança: {config.confidenceThreshold[0]}%</Label>
                  <Slider
                    value={config.confidenceThreshold}
                    onValueChange={(value) => setConfig({...config, confidenceThreshold: value})}
                    min={60}
                    max={99}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Taxa de Aprendizado: {config.learningRate[0]}</Label>
                  <Slider
                    value={config.learningRate}
                    onValueChange={(value) => setConfig({...config, learningRate: value})}
                    min={0.001}
                    max={0.1}
                    step={0.001}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Algoritmos de ML
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Algoritmo Principal</Label>
                  <Select value={config.primaryAlgorithm} onValueChange={(value) => setConfig({...config, primaryAlgorithm: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neural_network">Rede Neural</SelectItem>
                      <SelectItem value="random_forest">Random Forest</SelectItem>
                      <SelectItem value="svm">Support Vector Machine</SelectItem>
                      <SelectItem value="gradient_boost">Gradient Boosting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Modelo de Predição</Label>
                  <Select value={config.predictionModel} onValueChange={(value) => setConfig({...config, predictionModel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lstm">LSTM (Long Short-Term Memory)</SelectItem>
                      <SelectItem value="arima">ARIMA</SelectItem>
                      <SelectItem value="prophet">Prophet</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Objetivo de Otimização</Label>
                  <Select value={config.optimizationTarget} onValueChange={(value) => setConfig({...config, optimizationTarget: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water_efficiency">Eficiência Hídrica</SelectItem>
                      <SelectItem value="crop_yield">Produtividade</SelectItem>
                      <SelectItem value="energy_saving">Economia de Energia</SelectItem>
                      <SelectItem value="balanced">Balanceado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pesos dos Sensores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Sensibilidade Umidade do Solo: {config.soilMoistureSensitivity[0]}%</Label>
                  <Slider
                    value={config.soilMoistureSensitivity}
                    onValueChange={(value) => setConfig({...config, soilMoistureSensitivity: value})}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peso Temperatura: {config.temperatureWeight[0]}%</Label>
                  <Slider
                    value={config.temperatureWeight}
                    onValueChange={(value) => setConfig({...config, temperatureWeight: value})}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peso Umidade do Ar: {config.humidityWeight[0]}%</Label>
                  <Slider
                    value={config.humidityWeight}
                    onValueChange={(value) => setConfig({...config, humidityWeight: value})}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peso Velocidade do Vento: {config.windWeight[0]}%</Label>
                  <Slider
                    value={config.windWeight}
                    onValueChange={(value) => setConfig({...config, windWeight: value})}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Sensores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Umidade do Solo</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Temperatura</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Umidade do Ar</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Velocidade do Vento</span>
                  <Badge variant="secondary">Calibrando</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Radiação Solar</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>pH do Solo</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Irrigação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Duração Mínima: {config.minIrrigationDuration[0]} min</Label>
                  <Slider
                    value={config.minIrrigationDuration}
                    onValueChange={(value) => setConfig({...config, minIrrigationDuration: value})}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duração Máxima: {config.maxIrrigationDuration[0]} min</Label>
                  <Slider
                    value={config.maxIrrigationDuration}
                    onValueChange={(value) => setConfig({...config, maxIrrigationDuration: value})}
                    min={30}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Período de Espera: {config.cooldownPeriod[0]} h</Label>
                  <Slider
                    value={config.cooldownPeriod}
                    onValueChange={(value) => setConfig({...config, cooldownPeriod: value})}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-confidence">Alerta de Baixa Confiança</Label>
                    <Switch 
                      id="low-confidence"
                      checked={config.lowConfidenceAlert}
                      onCheckedChange={(checked) => setConfig({...config, lowConfidenceAlert: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pattern-change">Mudança de Padrão</Label>
                    <Switch 
                      id="pattern-change"
                      checked={config.patternChangeAlert}
                      onCheckedChange={(checked) => setConfig({...config, patternChangeAlert: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="anomaly">Detecção de Anomalias</Label>
                    <Switch 
                      id="anomaly"
                      checked={config.anomalyDetection}
                      onCheckedChange={(checked) => setConfig({...config, anomalyDetection: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Backup Automático</Label>
                    <Switch 
                      id="auto-backup"
                      checked={config.autoBackup}
                      onCheckedChange={(checked) => setConfig({...config, autoBackup: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="failsafe">Modo de Segurança</Label>
                    <Switch 
                      id="failsafe"
                      checked={config.failsafeMode}
                      onCheckedChange={(checked) => setConfig({...config, failsafeMode: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="manual-override">Override Manual</Label>
                    <Switch 
                      id="manual-override"
                      checked={config.manualOverride}
                      onCheckedChange={(checked) => setConfig({...config, manualOverride: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};