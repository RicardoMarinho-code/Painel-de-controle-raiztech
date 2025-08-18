import { cn } from "@/lib/utils";
interface StatusIndicatorProps {
  status: "online" | "offline" | "warning" | "maintenance";
  label: string;
  className?: string;
}
export const StatusIndicator = ({
  status,
  label,
  className
}: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-success";
      case "offline":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      case "maintenance":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };
  return <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
      <span className="text-sm text-slate-50">{label}</span>
    </div>;
};