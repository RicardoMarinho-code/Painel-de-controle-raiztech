import { useState, useEffect } from "react";
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
  DialogHeader, DialogTitle, DialogTrigger
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
import { Loader2, MapPin, PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface Property {
  ID_propriedade: number;
  nome: string;
  localizacao: string;
  area_total: number;
  ID_agricultor_fk: number;
  agricultor_nome: string;
}

interface Farmer {
  ID_agricultor: number;
  nome: string;
}

const Properties = () => {
  const { data: properties, loading, error, refetch } = useFetch<Property[]>('/propriedades-rurais', []);
  const { data: farmers } = useFetch<Farmer[]>('/agricultores', []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const resetForm = () => {
    setSelectedProperty(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (property: Property | null = null) => {
    if (property) {
      setSelectedProperty(property);
      setIsEditing(true);
    } else {
      setSelectedProperty({ ID_propriedade: 0, nome: '', localizacao: '', area_total: 0, ID_agricultor_fk: 0, agricultor_nome: '' });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const endpoint = isEditing ? `/propriedades-rurais/${selectedProperty.ID_propriedade}` : '/propriedades-rurais';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProperty),
      });

      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} propriedade.`);

      toast.success(`Propriedade ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
    }
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;
    try {
      const response = await fetch(`${API_BASE_URL}/propriedades-rurais/${selectedProperty.ID_propriedade}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Falha ao excluir propriedade.");
      toast.success("Propriedade excluída com sucesso!");
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
              <h1 className="text-3xl font-bold">Gestão de Propriedades</h1>
              <p className="text-muted-foreground">Visualize e gerencie as propriedades rurais.</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Propriedade
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Propriedades Cadastradas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <div className="flex justify-center items-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /><span className="ml-2">Carregando...</span></div>}
              {error && <p className="text-destructive text-center">{error}</p>}
              {!loading && !error && (
                <Table>
                  <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Localização</TableHead><TableHead>Área (ha)</TableHead><TableHead>Proprietário</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {properties.map((prop) => (
                      <TableRow key={prop.ID_propriedade}>
                        <TableCell className="font-medium">{prop.nome}</TableCell>
                        <TableCell>{prop.localizacao}</TableCell>
                        <TableCell>{Number(prop.area_total).toFixed(2)}</TableCell>
                        <TableCell>{prop.agricultor_nome}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenDialog(prop)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedProperty(prop); setIsDeleteAlertOpen(true); }} className="text-destructive"><Trash className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
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
                <DialogHeader><DialogTitle>{isEditing ? 'Editar' : 'Nova'} Propriedade</DialogTitle><DialogDescription>Preencha os dados da propriedade.</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={selectedProperty?.nome || ''} onChange={(e) => setSelectedProperty(p => p ? { ...p, nome: e.target.value } : null)} required /></div>
                  <div className="space-y-2"><Label htmlFor="localizacao">Localização</Label><Input id="localizacao" value={selectedProperty?.localizacao || ''} onChange={(e) => setSelectedProperty(p => p ? { ...p, localizacao: e.target.value } : null)} required /></div>
                  <div className="space-y-2"><Label htmlFor="area_total">Área (ha)</Label><Input id="area_total" type="number" value={selectedProperty?.area_total || ''} onChange={(e) => setSelectedProperty(p => p ? { ...p, area_total: Number(e.target.value) } : null)} required /></div>
                  <div className="space-y-2"><Label htmlFor="ID_agricultor_fk">Proprietário</Label>
                    <Select value={String(selectedProperty?.ID_agricultor_fk || '')} onValueChange={(value) => setSelectedProperty(p => p ? { ...p, ID_agricultor_fk: Number(value) } : null)} required>
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
              <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Essa ação não pode ser desfeita e excluirá permanentemente a propriedade.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default Properties;