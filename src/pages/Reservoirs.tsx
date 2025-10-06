import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Droplets, PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface Reservoir {
  ID_reservatorio: number;
  capacidade: number;
  nivel_atual: number;
  ID_propriedade_fk: number;
  propriedade_nome: string;
}

interface Property {
  ID_propriedade: number;
  nome: string;
}

const Reservoirs = () => {
  const { data: reservoirs, loading, error, refetch } = useFetch<Reservoir[]>('/reservatorios', []);
  const { data: properties } = useFetch<Property[]>('/propriedades-rurais', []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedReservoir, setSelectedReservoir] = useState<Partial<Reservoir> | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const resetForm = () => {
    setSelectedReservoir(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (reservoir: Partial<Reservoir> | null = null) => {
    if (reservoir && 'ID_reservatorio' in reservoir) {
      setSelectedReservoir(reservoir);
      setIsEditing(true);
    } else {
      setSelectedReservoir({ capacidade: 10000, nivel_atual: 5000, ID_propriedade_fk: undefined });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservoir) return;

    const endpoint = isEditing ? `/reservatorios/${selectedReservoir.ID_reservatorio}` : '/reservatorios';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedReservoir),
      });

      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} reservatório.`);

      toast.success(`Reservatório ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
    }
  };

  const handleDelete = async () => {
    if (!selectedReservoir || !selectedReservoir.ID_reservatorio) return;
    try {
      const response = await fetch(`${API_BASE_URL}/reservatorios/${selectedReservoir.ID_reservatorio}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Falha ao excluir reservatório.");
      toast.success("Reservatório excluído com sucesso!");
      setIsDeleteAlertOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
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
              <h1 className="text-3xl font-bold">Gestão de Reservatórios</h1>
              <p className="text-muted-foreground">Visualize e gerencie os reservatórios de água.</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Reservatório
            </Button>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center space-x-2"><Droplets className="h-5 w-5 text-primary" /><span>Reservatórios Cadastrados</span></CardTitle></CardHeader>
            <CardContent>
              {loading && <div className="flex justify-center items-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="ml-2">Carregando...</span></div>}
              {error && <p className="text-destructive text-center">{error}</p>}
              {!loading && !error && (
                <Table>
                  <TableHeader><TableRow><TableHead>Propriedade</TableHead><TableHead>Nível Atual</TableHead><TableHead>Capacidade</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {reservoirs.map((res) => {
                      const percentage = (res.nivel_atual / res.capacidade) * 100;
                      return (
                        <TableRow key={res.ID_reservatorio}>
                          <TableCell className="font-medium">{res.propriedade_nome}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={percentage} className="w-32" />
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{res.capacidade.toLocaleString('pt-BR')} L</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenDialog(res)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedReservoir(res); setIsDeleteAlertOpen(true); }} className="text-destructive"><Trash className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog for Create/Edit */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader><DialogTitle>{isEditing ? 'Editar' : 'Novo'} Reservatório</DialogTitle><DialogDescription>Preencha os dados do reservatório.</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2"><Label htmlFor="capacidade">Capacidade (L)</Label><Input id="capacidade" type="number" value={selectedReservoir?.capacidade || ''} onChange={(e) => setSelectedReservoir(r => ({ ...r, capacidade: Number(e.target.value) }))} required /></div>
                  <div className="space-y-2"><Label htmlFor="nivel_atual">Nível Atual (L)</Label><Input id="nivel_atual" type="number" value={selectedReservoir?.nivel_atual || ''} onChange={(e) => setSelectedReservoir(r => ({ ...r, nivel_atual: Number(e.target.value) }))} required /></div>
                  <div className="space-y-2"><Label htmlFor="ID_propriedade_fk">Propriedade</Label>
                    <Select value={String(selectedReservoir?.ID_propriedade_fk || '')} onValueChange={(value) => setSelectedReservoir(r => ({ ...r, ID_propriedade_fk: Number(value) }))} required>
                      <SelectTrigger><SelectValue placeholder="Selecione uma propriedade" /></SelectTrigger>
                      <SelectContent>
                        {properties.map(prop => <SelectItem key={prop.ID_propriedade} value={String(prop.ID_propriedade)}>{prop.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter><Button type="submit">Salvar</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Alert for Delete */}
          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita e excluirá permanentemente o reservatório.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default Reservoirs;