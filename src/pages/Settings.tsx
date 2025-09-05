import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MLConfigPanel } from "@/components/MLConfigPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Brain,
  Wifi,
  Bell,
  Shield,
  User,
  Database,
  Save,
  RotateCcw,
  Target,
  Zap
} from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Configurações de IA</h1>
              <p className="text-muted-foreground">Configurar parâmetros de aprendizado e comportamento dos irrigadores inteligentes</p>
            </div>
          </div>

          <MLConfigPanel />

          {/* Legacy Cards for reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Configuração do Modelo de IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Parâmetros de Aprendizado</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Aprendizado Automático</Label>
                        <p className="text-sm text-muted-foreground">Permitir que a IA aprenda continuamente</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>Taxa de Aprendizado</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option>Conservativa (padrão)</option>
                        <option>Moderada</option>
                        <option>Agressiva</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Confiança Mínima (%)</Label>
                      <Input type="number" defaultValue="85" min="60" max="99" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Comportamento por Cultura</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Milho - Prioridade</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option>Eficiência Hídrica</option>
                        <option>Máxima Produtividade</option>
                        <option>Economia de Água</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Soja - Prioridade</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option>Eficiência Hídrica</option>
                        <option>Máxima Produtividade</option>
                        <option>Economia de Água</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Verduras - Prioridade</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option>Máxima Produtividade</option>
                        <option>Eficiência Hídrica</option>
                        <option>Economia de Água</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Decision Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Regras de Decisão da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Integração Climática</h4>
                    <p className="text-sm text-muted-foreground">
                      IA considera previsão do tempo nas decisões
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Economia Noturna</h4>
                    <p className="text-sm text-muted-foreground">
                      Priorizar irrigação noturna para reduzir evaporação
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Adaptação Solo</h4>
                    <p className="text-sm text-muted-foreground">
                      Ajustar comportamento baseado em tipo de solo
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Coordenação entre Irrigadores</h4>
                    <p className="text-sm text-muted-foreground">
                      Sincronizar decisões entre irrigadores próximos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequência de Análise</Label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option>30 segundos (padrão)</option>
                      <option>1 minuto</option>
                      <option>5 minutos</option>
                      <option>15 minutos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sensibilidade a Mudanças</Label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option>Alta (padrão)</option>
                      <option>Média</option>
                      <option>Baixa</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Otimização de Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Metas de Eficiência</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Meta Eficiência Hídrica (%)</Label>
                      <Input type="number" defaultValue="95" min="80" max="99" />
                    </div>
                    <div className="space-y-2">
                      <Label>Economia Mínima (%)</Label>
                      <Input type="number" defaultValue="15" min="5" max="50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Precisão Mínima (%)</Label>
                      <Input type="number" defaultValue="90" min="70" max="99" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alertas de Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alerta Eficiência Baixa</Label>
                        <p className="text-sm text-muted-foreground">Abaixo de 85% de eficiência</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alerta Padrão Novo</Label>
                        <p className="text-sm text-muted-foreground">IA identificou novo padrão</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Relatório Semanal IA</Label>
                        <p className="text-sm text-muted-foreground">Resumo de aprendizado</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Perfil da Fazenda</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Proprietário</Label>
                  <Input id="name" defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao@fazendaraiztech.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farm">Nome da Fazenda</Label>
                  <Input id="farm" defaultValue="Fazenda RaizTech - 50 hectares" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Input id="region" defaultValue="São Paulo, Brasil" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connectivity Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5" />
                <span>Conectividade dos Irrigadores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Rede Principal</h4>
                  <div className="space-y-2">
                    <Label htmlFor="wifi-ssid">Nome da Rede</Label>
                    <Input id="wifi-ssid" defaultValue="RaizTech-Fazenda" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wifi-password">Senha</Label>
                    <Input id="wifi-password" type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="outline" size="sm">Testar Conectividade</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Backup 4G/LoRa</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Backup Automático</p>
                      <p className="text-xs text-muted-foreground">
                        Usar LoRa quando Wi-Fi falhar
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-limit">Limite LoRa (msgs/dia)</Label>
                    <Input id="data-limit" type="number" defaultValue="1000" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Criptografia de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Proteger dados de aprendizado da IA
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Acesso Remoto Seguro</h4>
                    <p className="text-sm text-muted-foreground">
                      VPN para acesso aos irrigadores
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Alterar Senha Master</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Alterar Senha</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Gestão de Dados de IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup de Modelos IA</h4>
                    <p className="text-sm text-muted-foreground">
                      Backup automático dos modelos treinados
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Exportar Dados de Treinamento</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Baixar dados usados pela IA para análise externa
                  </p>
                  <Button variant="outline" size="sm">Solicitar Exportação</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Retenção de Dados</h4>
                  <div className="space-y-2">
                    <Label htmlFor="retention" className="block mb-1">Manter dados por</Label>
                    <Select defaultValue="2y">
                      <SelectTrigger id="retention" className="w-full max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2y">2 anos (padrão)</SelectItem>
                        <SelectItem value="1y">1 ano</SelectItem>
                        <SelectItem value="5y">5 anos</SelectItem>
                        <SelectItem value="always">Sempre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;