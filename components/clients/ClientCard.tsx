'use client';

import { ClientFull } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, FileText, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: ClientFull;
  onClick?: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={client.avatar_url || undefined} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {client.name?.charAt(0)?.toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{client.name}</h3>
              {client.is_active ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  Inactive
                </Badge>
              )}
            </div>

            {client.company_name && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{client.company_name}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{client.email}</span>
            </div>

            {client.phone && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                <span>{client.phone}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t">
              <div className="flex items-center gap-1 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{client.total_content || 0}</span>
                <span className="text-muted-foreground">content</span>
              </div>
              {client.brand_name && (
                <Badge variant="outline" className="text-xs">
                  {client.brand_name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
