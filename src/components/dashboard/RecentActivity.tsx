import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "audit",
    title: "New audit submitted",
    client: "Fashion Brand Co",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "approval",
    title: "Content approved",
    client: "Tech Startup Inc",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "revision",
    title: "Revision requested",
    client: "Fitness Studio",
    time: "6 hours ago",
    status: "action",
  },
  {
    id: 4,
    type: "audit",
    title: "Audit completed",
    client: "Local Restaurant",
    time: "1 day ago",
    status: "completed",
  },
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  action: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl bg-card border border-border/50 p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const config = statusConfig[activity.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  config.bg
                )}
              >
                <StatusIcon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.client}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
