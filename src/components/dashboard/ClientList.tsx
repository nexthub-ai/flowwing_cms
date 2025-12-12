import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const clients = [
  {
    id: 1,
    name: "Fashion Brand Co",
    email: "contact@fashionbrand.com",
    status: "active",
    pendingTasks: 3,
    initials: "FB",
  },
  {
    id: 2,
    name: "Tech Startup Inc",
    email: "hello@techstartup.io",
    status: "active",
    pendingTasks: 1,
    initials: "TS",
  },
  {
    id: 3,
    name: "Fitness Studio",
    email: "info@fitnessstudio.com",
    status: "pending",
    pendingTasks: 5,
    initials: "FS",
  },
  {
    id: 4,
    name: "Local Restaurant",
    email: "contact@localfood.com",
    status: "active",
    pendingTasks: 0,
    initials: "LR",
  },
];

export function ClientList() {
  return (
    <div className="rounded-xl bg-card border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Clients</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Avatar className="h-10 w-10 bg-primary/10 text-primary">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{client.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {client.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {client.pendingTasks > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {client.pendingTasks} tasks
                </Badge>
              )}
              <Badge
                variant={client.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {client.status}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
