'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Inbox,
  Loader2,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import { createClient } from '@/supabase/client';
import { ContentRequestService, ContentRequestWithClient } from '@/services/contentRequestService';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PRIORITY_CONFIG } from '@/constants/constants';
import { ContentRequestDetailDrawer } from '@/components/content/ContentRequestDetailDrawer';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-700' },
  accepted: { label: 'Accepted', color: 'bg-blue-500/20 text-blue-700' },
  declined: { label: 'Declined', color: 'bg-red-500/20 text-red-700' },
  converted: { label: 'Converted', color: 'bg-green-500/20 text-green-700' },
};

export default function ContentRequestsPage() {
  const { toast } = useToast();
  const user = useAppSelector(selectUser);
  const [requests, setRequests] = useState<ContentRequestWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ContentRequestWithClient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await ContentRequestService.getAll(supabase, filters);
      setRequests(data);
    } catch (error: any) {
      toast({
        title: 'Error loading requests',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (request: ContentRequestWithClient) => {
    if (!user?.id) return;
    try {
      const supabase = createClient();
      await ContentRequestService.accept(supabase, request.id, user.id);
      toast({ title: 'Request accepted' });
      loadRequests();
    } catch (error: any) {
      toast({
        title: 'Error accepting request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDecline = async (request: ContentRequestWithClient) => {
    if (!user?.id) return;
    try {
      const supabase = createClient();
      await ContentRequestService.decline(supabase, request.id, user.id);
      toast({ title: 'Request declined' });
      loadRequests();
    } catch (error: any) {
      toast({
        title: 'Error declining request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = (request: ContentRequestWithClient) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  // Filter by search query
  const filteredRequests = requests.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(query) ||
      request.client_name?.toLowerCase().includes(query) ||
      request.description?.toLowerCase().includes(query)
    );
  });

  // Stats
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'accepted').length;
  const declinedCount = requests.filter((r) => r.status === 'declined').length;
  const convertedCount = requests.filter((r) => r.status === 'converted').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Inbox className="h-6 w-6 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold">Content Requests</h1>
              </div>
              <p className="text-muted-foreground">
                Manage content requests from clients
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card
              className={cn(
                'cursor-pointer transition-colors',
                statusFilter === 'pending' && 'ring-2 ring-primary'
              )}
              onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            >
              <CardHeader className="pb-2">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-2xl">{pendingCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card
              className={cn(
                'cursor-pointer transition-colors',
                statusFilter === 'accepted' && 'ring-2 ring-primary'
              )}
              onClick={() => setStatusFilter(statusFilter === 'accepted' ? 'all' : 'accepted')}
            >
              <CardHeader className="pb-2">
                <CardDescription>Accepted</CardDescription>
                <CardTitle className="text-2xl">{acceptedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card
              className={cn(
                'cursor-pointer transition-colors',
                statusFilter === 'converted' && 'ring-2 ring-primary'
              )}
              onClick={() => setStatusFilter(statusFilter === 'converted' ? 'all' : 'converted')}
            >
              <CardHeader className="pb-2">
                <CardDescription>Converted</CardDescription>
                <CardTitle className="text-2xl">{convertedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card
              className={cn(
                'cursor-pointer transition-colors',
                statusFilter === 'declined' && 'ring-2 ring-primary'
              )}
              onClick={() => setStatusFilter(statusFilter === 'declined' ? 'all' : 'declined')}
            >
              <CardHeader className="pb-2">
                <CardDescription>Declined</CardDescription>
                <CardTitle className="text-2xl">{declinedCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {statusFilter !== 'all' && (
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('all')}>
                Clear filter
              </Button>
            )}
          </div>

          {/* Requests Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Inbox className="h-12 w-12 mb-4 opacity-50" />
                  <p>No content requests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Request</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewDetails(request)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">
                              {request.title}
                            </span>
                            {request.description && (
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {request.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{request.client_name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.content_type_name ? (
                            <Badge variant="outline" className="gap-1">
                              {request.content_type_icon && (
                                <span>{request.content_type_icon}</span>
                              )}
                              {request.content_type_name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-medium',
                              PRIORITY_CONFIG[request.urgency as keyof typeof PRIORITY_CONFIG]?.color
                            )}
                          >
                            {PRIORITY_CONFIG[request.urgency as keyof typeof PRIORITY_CONFIG]?.label ||
                              request.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              'font-medium',
                              STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG]?.color
                            )}
                          >
                            {STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.requested_date ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {format(new Date(request.requested_date), 'MMM d')}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(request.created_at), 'MMM d')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                View Details
                              </DropdownMenuItem>
                              {request.status === 'pending' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAccept(request);
                                    }}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDecline(request);
                                    }}
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Decline
                                  </DropdownMenuItem>
                                </>
                              )}
                              {request.status === 'accepted' && (
                                <DropdownMenuItem className="text-primary">
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Convert to Content
                                </DropdownMenuItem>
                              )}
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
        </div>
      </main>

      {/* Detail Drawer */}
      <ContentRequestDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onUpdate={loadRequests}
      />
    </div>
  );
}
