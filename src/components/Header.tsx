import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import raizTechLogo from "@/assets/raiztech-logo.png";

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <img src={raizTechLogo} alt="RaizTech" className="h-8 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-foreground">RaizTech Control</h1>
            <p className="text-sm text-muted-foreground">Fazenda Santa Clara</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="ml-2 text-sm">{user?.email}</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};