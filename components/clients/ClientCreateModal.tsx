'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, UserPlus, Mail } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { createClientRecord } from '@/store/slices/clientsSlice';
import { toast } from 'sonner';

interface ClientCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ClientCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: ClientCreateModalProps) {
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

  // Reset form when modal closes
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              className="mt-1"
              autoFocus
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="mt-1"
            />
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name"
              className="mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className="mt-1"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this client..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Invitation Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-start space-x-3">
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
              <div className="mt-3 ml-6">
                <Label htmlFor="invitationMessage" className="text-xs">
                  Personal message (optional)
                </Label>
                <Textarea
                  id="invitationMessage"
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  placeholder="Add a personal message to the invitation..."
                  className="mt-1 text-sm"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
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
      </DialogContent>
    </Dialog>
  );
}
