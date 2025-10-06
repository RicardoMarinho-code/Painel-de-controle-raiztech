import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface Farmer {
  ID_agricultor: number;
  nome: string;
  CPF: string;
  data_nascimento: string;
  telefones_de_conato: string;
}

const Farmers = () => {
  const { data: farmers, loading, error, refetch } = useFetch<Farmer[]>('/agricultores', []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  const [newFarmer, setNewFarmer] = useState({
    nome: "",
    CPF: "",
    data_nascimento: "",
    telefones_de_conato: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewFarmer((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!selectedFarmer;
    const endpoint = isEditing ? `/agricultores/${selectedFarmer.ID_agricultor}` : '/agricultores';
    const method = isEditing ? 'PUT' : 'POST';
    const farmerData = isEditing ? selectedFarmer : newFarmer;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFarmer),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} agricultor.`);
      }

      toast.success(`Agricultor ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      if (isEditing) {
        setIsEditDialogOpen(false);
      } else {
        setIsCreateDialogOpen(false);
      }
      refetch(); // Atualiza a lista de agricultores
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
    }
  };

  const handleDelete = async (farmerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agricultores/${farmerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir agricultor.");
      }

      toast.success("Agricultor excluído com sucesso!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro.");
    }
  };

  const handleEditClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsEditDialogOpen(true);
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adiciona o fuso horário para corrigir a data
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Agricultores</h1>
              <p className="text-muted-foreground">
                Visualize e gerencie os agricultores parceiros da RaizTech.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Agricultor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Novo Agricultor</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para cadastrar um novo agricultor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">Nome</Label>
                      <Input id="nome" value={newFarmer.nome} onChange={(e) => setNewFarmer({...newFarmer, nome: e.target.value})} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="CPF" className="text-right">CPF</Label>
                      <Input id="CPF" value={newFarmer.CPF} onChange={(e) => setNewFarmer({...newFarmer, CPF: e.target.value})} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="data_nascimento" className="text-right">Nascimento</Label>
                      <Input id="data_nascimento" type="date" value={newFarmer.data_nascimento} onChange={(e) => setNewFarmer({...newFarmer, data_nascimento: e.target.value})} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="telefones_de_conato" className="text-right">Telefone</Label>
                      <Input id="telefones_de_conato" value={newFarmer.telefones_de_conato} onChange={(e) => setNewFarmer({...newFarmer, telefones_de_conato: e.target.value})} className="col-span-3" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Editar Agricultor</DialogTitle>
                    <DialogDescription>
                      Atualize os dados do agricultor selecionado.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">Nome</Label>
                      <Input id="nome" value={selectedFarmer?.nome} onChange={(e) => setSelectedFarmer(prev => prev ? {...prev, nome: e.target.value} : null)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="CPF" className="text-right">CPF</Label>
                      <Input id="CPF" value={selectedFarmer?.CPF} onChange={(e) => setSelectedFarmer(prev => prev ? {...prev, CPF: e.target.value} : null)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="data_nascimento" className="text-right">Nascimento</Label>
                      <Input id="data_nascimento" type="date" value={selectedFarmer?.data_nascimento.split('T')[0]} onChange={(e) => setSelectedFarmer(prev => prev ? {...prev, data_nascimento: e.target.value} : null)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="telefones_de_conato" className="text-right">Telefone</Label>
                      <Input id="telefones_de_conato" value={selectedFarmer?.telefones_de_conato} onChange={(e) => setSelectedFarmer(prev => prev ? {...prev, telefones_de_conato: e.target.value} : null)} className="col-span-3" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Salvar Alterações</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Agricultores Cadastrados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Carregando agricultores...</span>
                </div>
              )}
              {error && (
                <p className="text-destructive text-center">{error}</p>
              )}
              {!loading && !error && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {farmers.map((farmer) => (
                        <TableRow key={farmer.ID_agricultor}>
                          <TableCell className="font-medium">{farmer.nome}</TableCell>
                          <TableCell>{farmer.CPF}</TableCell>
                          <TableCell>{formatDate(farmer.data_nascimento)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{farmer.telefones_de_conato.split(',')[0]}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditClick(farmer)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-sm font-normal text-destructive hover:text-destructive px-2 py-1.5 h-auto">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Excluir
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>Essa ação não pode ser desfeita. Isso excluirá permanentemente o agricultor.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(farmer.ID_agricultor)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Farmers;