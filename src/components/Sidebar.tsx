import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Droplets, 
  BarChart3, 
  Settings, 
  Sprout,
  Cloud,
  MapPin,
  Calendar,
  ChevronLeft,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Irrigação", icon: Droplets, path: "/irrigation" },
  { title: "Sensores", icon: Sprout, path: "/sensors" },
  { title: "Clima", icon: Cloud, path: "/weather" },
  { title: "Áreas", icon: MapPin, path: "/areas" },
  { title: "Relatórios", icon: BarChart3, path: "/reports" },
  { title: "Agendamentos", icon: Calendar, path: "/schedule" },
  { title: "Configurações", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <span className="text-sm font-medium text-muted-foreground">
              Navegação
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-primary/10 hover:text-primary",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};