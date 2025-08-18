import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, Brain, Zap } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "critical" | "success";
  trend?: "up" | "down" | "stable";
  className?: string;
  aiControlled?: boolean;
  confidence?: number;
  lastDecision?: string;
}

export const DashboardCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  trend = "stable",
  className,
  aiControlled = false,
  confidence,
  lastDecision
}: DashboardCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "success": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-primary";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "→";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border-border/50",
      "bg-gradient-to-br from-card to-card/80",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {aiControlled && (
            <Badge variant="outline" className="text-xs w-fit border-primary/30 text-primary">
              <Brain className="h-2.5 w-2.5 mr-1" />
              AI Controlled
            </Badge>
          )}
        </div>
        <div className="flex flex-col items-end space-y-1">
          <Icon className={cn("h-5 w-5", getStatusColor())} />
          {confidence && (
            <div className="text-xs text-muted-foreground">
              {confidence}% conf.
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <div className={cn("text-2xl font-bold", getStatusColor())}>
              {value}
            </div>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
            <span className="text-sm text-muted-foreground ml-auto">
              {getTrendIcon()}
            </span>
          </div>
          {lastDecision && (
            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <Zap className="h-3 w-3 inline mr-1" />
              {lastDecision}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};