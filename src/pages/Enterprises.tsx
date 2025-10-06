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
import { Loader2, Briefcase, PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface Enterprise {
  ID_empreendimento: number;
  nome: string;
  finalidade: string;
  ID_agricultor_fk: number;
  agricultor_nome: string;
}

interface Farmer {
  ID_agricultor: number;
  nome: string;
}

const Enterprises = () => {
  const { data: enterprises, loading, error, refetch } = useFetch<Enterprise[]>('/empreendimentos', []);
  const { data: farmers } = useFetch<Farmer[]>('/agricultores', []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Partial<Enterprise> | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const resetForm = () => {
    setSelectedEnterprise(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (enterprise: Partial<Enterprise> | null = null) => {
    if (enterprise && 'ID_empreendimento' in enterprise) {
      setSelectedEnterprise(enterprise);
      setIsEditing(true);
    } else {
      setSelectedEnterprise({ nome: '', finalidade: '', ID_agricultor_fk: undefined });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnterprise) return;

    const endpoint = isEditing ? `/empreendimentos/${selectedEnterprise.ID_empreendimento}` : '/empreendimentos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedEnterprise),
      });

      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} empreendimento.`);

      toast.success(`Empreendimento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEnterprise || !selectedEnterprise.ID_empreendimento) return;
    try {
      const response = await fetch(`${API_BASE_URL}/empreendimentos/${selectedEnterprise.ID_empreendimento}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Falha ao excluir empreendimento.");
      toast.success("Empreendimento excluído com sucesso!");
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
              <h1 className="text-3xl font-bold">Gestão de Empreendimentos</h1>
              <p className="text-muted-foreground">Visualize e gerencie os empreendimentos agrícolas.</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Empreendimento
            </Button>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center space-x-2"><Briefcase className="h-5 w-5 text-primary" /><span>Empreendimentos Cadastrados</span></CardTitle></CardHeader>
            <CardContent>
              {loading && <div className="flex justify-center items-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="ml-2">Carregando...</span></div>}
              {error && <p className="text-destructive text-center">{error}</p>}
              {!loading && !error && (
                <Table>
                  <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Finalidade</TableHead><TableHead>Agricultor Responsável</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {enterprises.map((ent) => (
                      <TableRow key={ent.ID_empreendimento}>
                        <TableCell className="font-medium">{ent.nome}</TableCell>
                        <TableCell>{ent.finalidade}</TableCell>
                        <TableCell>{ent.agricultor_nome}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog(ent)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedEnterprise(ent); setIsDeleteAlertOpen(true); }} className="text-destructive"><Trash className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog for Create/Edit */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader><DialogTitle>{isEditing ? 'Editar' : 'Novo'} Empreendimento</DialogTitle><DialogDescription>Preencha os dados do empreendimento.</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={selectedEnterprise?.nome || ''} onChange={(e) => setSelectedEnterprise(p => ({ ...p, nome: e.target.value }))} required /></div>
                  <div className="space-y-2"><Label htmlFor="finalidade">Finalidade</Label><Input id="finalidade" value={selectedEnterprise?.finalidade || ''} onChange={(e) => setSelectedEnterprise(p => ({ ...p, finalidade: e.target.value }))} required /></div>
                  <div className="space-y-2"><Label htmlFor="ID_agricultor_fk">Agricultor</Label>
                    <Select value={String(selectedEnterprise?.ID_agricultor_fk || '')} onValueChange={(value) => setSelectedEnterprise(p => ({ ...p, ID_agricultor_fk: Number(value) }))} required>
                      <SelectTrigger><SelectValue placeholder="Selecione um agricultor" /></SelectTrigger>
                      <SelectContent>
                        {farmers.map(farmer => <SelectItem key={farmer.ID_agricultor} value={String(farmer.ID_agricultor)}>{farmer.nome}</SelectItem>)}
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
              <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita e excluirá permanentemente o empreendimento.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default Enterprises;