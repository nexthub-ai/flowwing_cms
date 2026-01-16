'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Plus,
  Search,
  UserPlus,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Pencil,
  Camera,
  Video,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Creator {
  id: string;
  user_id: string | null;
  display_name: string;
  bio: string | null;
  specialty: string[];
  skills: string[];
  portfolio_url: string | null;
  is_available: boolean;
  hourly_rate: number | null;
  total_projects: number;
  completed_projects: number;
  created_at: string;
  user?: {
    email: string;
    avatar_url: string | null;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: 'client' | 'creator';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  creator_name: string | null;
  creator_specialty: string | null;
  message: string | null;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
}

const SPECIALTIES = [
  { value: 'writer', label: 'Writer', icon: Pencil },
  { value: 'designer', label: 'Designer', icon: Camera },
  { value: 'editor', label: 'Editor', icon: Video },
  { value: 'videographer', label: 'Videographer', icon: Video },
];

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('creators');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteSpecialty, setInviteSpecialty] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Fetch creators
      const { data: creatorsData } = await supabase
        .from('creator_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch creator invitations
      const { data: invitationsData } = await supabase
        .from('invitations')
        .select('*')
        .eq('role', 'creator')
        .order('created_at', { ascending: false });

      setCreators(creatorsData || []);
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteCreator = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'creator',
          email: inviteEmail.trim(),
          creatorName: inviteName.trim() || undefined,
          specialty: inviteSpecialty || undefined,
          message: inviteMessage.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast.success('Invitation sent successfully');
        setIsInviteModalOpen(false);
        resetInviteForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invite?id=${invitationId}&action=resend`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast.success('Invitation resent');
        fetchData();
      } else {
        toast.error('Failed to resend invitation');
      }
    } catch (error) {
      toast.error('Failed to resend invitation');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invite?id=${invitationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Invitation cancelled');
        fetchData();
      } else {
        toast.error('Failed to cancel invitation');
      }
    } catch (error) {
      toast.error('Failed to cancel invitation');
    }
  };

  const resetInviteForm = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteSpecialty('');
    setInviteMessage('');
  };

  const filteredCreators = creators.filter(
    (c) =>
      c.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredInvitations = invitations.filter((i) =>
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.creator_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingInvitations = filteredInvitations.filter((i) => i.status === 'pending');
  const completedInvitations = filteredInvitations.filter((i) => i.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" /> Accepted
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            <Clock className="h-3 w-3 mr-1" /> Expired
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    const spec = SPECIALTIES.find((s) => s.value === specialty);
    return spec?.icon || Pencil;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Team</h1>
              <p className="text-muted-foreground">
                Manage creators and freelancers
              </p>
            </div>
            <Button variant="hero" className="gap-2" onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Invite Creator
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{creators.length}</p>
                    <p className="text-sm text-muted-foreground">Creators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {creators.filter((c) => c.is_available).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Mail className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingInvitations.length}</p>
                    <p className="text-sm text-muted-foreground">Pending Invites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Pencil className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {creators.filter((c) => c.specialty.includes('writer')).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Writers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="creators">
                Creators
                {creators.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {creators.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="invitations">
                Invitations
                {pendingInvitations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingInvitations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="creators">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCreators.length === 0 ? (
                <div className="text-center py-12 bg-card border rounded-lg">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No creators yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Invite freelancers to join your team
                  </p>
                  <Button onClick={() => setIsInviteModalOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Creator
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCreators.map((creator) => (
                    <Card key={creator.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={creator.user?.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {creator.display_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">
                                {creator.display_name}
                              </h3>
                              {creator.is_available ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  Available
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                                  Busy
                                </Badge>
                              )}
                            </div>
                            {creator.specialty.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {creator.specialty.map((spec) => {
                                  const Icon = getSpecialtyIcon(spec);
                                  return (
                                    <Badge key={spec} variant="outline" className="text-xs">
                                      <Icon className="h-3 w-3 mr-1" />
                                      {spec}
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-muted-foreground">
                              <span>{creator.completed_projects} completed</span>
                              {creator.hourly_rate && (
                                <span>${creator.hourly_rate}/hr</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="invitations">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredInvitations.length === 0 ? (
                <div className="text-center py-12 bg-card border rounded-lg">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No invitations</h3>
                  <p className="text-muted-foreground">
                    Send invitations to freelancers to join your team
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pending Invitations */}
                  {pendingInvitations.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Pending ({pendingInvitations.length})</h3>
                      <div className="space-y-2">
                        {pendingInvitations.map((invitation) => (
                          <Card key={invitation.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-yellow-100 text-yellow-700">
                                      <Mail className="h-4 w-4" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {invitation.creator_name || invitation.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {invitation.email}
                                      {invitation.creator_specialty && (
                                        <> &middot; {invitation.creator_specialty}</>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(invitation.status)}
                                  <span className="text-sm text-muted-foreground">
                                    Sent {formatDistanceToNow(new Date(invitation.created_at))} ago
                                  </span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleResendInvitation(invitation.id)}
                                      >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Resend
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleCancelInvitation(invitation.id)}
                                        className="text-red-600"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Invitations */}
                  {completedInvitations.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">History ({completedInvitations.length})</h3>
                      <div className="space-y-2">
                        {completedInvitations.map((invitation) => (
                          <Card key={invitation.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-slate-100 text-slate-600">
                                      {invitation.creator_name?.charAt(0) || invitation.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {invitation.creator_name || invitation.email}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {invitation.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(invitation.status)}
                                  <span className="text-sm text-muted-foreground">
                                    {invitation.accepted_at
                                      ? `Accepted ${formatDistanceToNow(new Date(invitation.accepted_at))} ago`
                                      : `Sent ${formatDistanceToNow(new Date(invitation.created_at))} ago`}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Invite Creator Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Creator
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="inviteEmail">Email *</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="creator@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="inviteName">Name</Label>
              <Input
                id="inviteName"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Creator's name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="inviteSpecialty">Specialty</Label>
              <Select value={inviteSpecialty} onValueChange={setInviteSpecialty}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      <div className="flex items-center gap-2">
                        <spec.icon className="h-4 w-4" />
                        {spec.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inviteMessage">Personal message (optional)</Label>
              <Textarea
                id="inviteMessage"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Add a personal message to the invitation..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsInviteModalOpen(false);
                  resetInviteForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleInviteCreator} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
