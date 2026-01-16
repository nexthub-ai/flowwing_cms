'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, UserPlus, Mail, Building2, Phone, FileText } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createClientRecord } from '@/store/slices/clientsSlice';
import { toast } from 'sonner';

interface ClientCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ClientCreateDrawer({
  isOpen,
  onClose,
  onSuccess,
}: ClientCreateDrawerProps) {
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [sendInvitation, setSendInvitation] = useState(true);
  const [invitationMessage, setInvitationMessage] = useState('');

  // Reset form when drawer closes
  const handleClose = () => {
    setName('');
    setEmail('');
    setCompanyName('');
    setPhone('');
    setNotes('');
    setSendInvitation(true);
    setInvitationMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(createClientRecord({
        name: name.trim(),
        email: email.trim(),
        company_name: companyName.trim() || undefined,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      })).unwrap();

      toast.success('Client created successfully');

      // Send invitation if checkbox is checked
      if (sendInvitation && result?.id) {
        try {
          const inviteResponse = await fetch('/api/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'client',
              email: email.trim(),
              clientId: result.id,
              message: invitationMessage.trim() || undefined,
            }),
          });

          if (inviteResponse.ok) {
            toast.success('Invitation email sent to client');
          } else {
            const errorData = await inviteResponse.json();
            toast.error(errorData.error || 'Failed to send invitation');
          }
        } catch (inviteError) {
          console.error('Failed to send invitation:', inviteError);
          toast.error('Client created but invitation email failed');
        }
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error('Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Client
          </SheetTitle>
          <SheetDescription>
            Create a new client and optionally send them an invitation to join
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter client name"
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Company
              </Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this client..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Invitation Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Invitation
            </h3>

            <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
              <Checkbox
                id="sendInvitation"
                checked={sendInvitation}
                onCheckedChange={(checked) => setSendInvitation(checked === true)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="sendInvitation"
                  className="text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send invitation email
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Client will receive a magic link to create their account
                </p>
              </div>
            </div>

            {sendInvitation && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label htmlFor="invitationMessage" className="text-sm">
                  Personal message (optional)
                </Label>
                <Textarea
                  id="invitationMessage"
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  placeholder="Add a personal message to the invitation..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Client
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
