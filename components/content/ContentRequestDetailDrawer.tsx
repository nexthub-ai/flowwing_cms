'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  User,
  Clock,
  Link as LinkIcon,
  Paperclip,
  Loader2,
  X,
} from 'lucide-react';
import { ContentRequestService, ContentRequestWithClient } from '@/services/contentRequestService';
import { ContentService } from '@/services/contentService';
import { createClient } from '@/supabase/client';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PRIORITY_CONFIG } from '@/constants/constants';

interface ContentRequestDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: ContentRequestWithClient | null;
  onUpdate: () => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-700' },
  accepted: { label: 'Accepted', color: 'bg-blue-500/20 text-blue-700' },
  declined: { label: 'Declined', color: 'bg-red-500/20 text-red-700' },
  converted: { label: 'Converted', color: 'bg-green-500/20 text-green-700' },
};

export function ContentRequestDetailDrawer({
  isOpen,
  onClose,
  request,
  onUpdate,
}: ContentRequestDetailDrawerProps) {
  const { toast } = useToast();
  const user = useAppSelector(selectUser);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  if (!request) return null;

  const handleAccept = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const supabase = createClient();
      await ContentRequestService.accept(supabase, request.id, user.id);
      toast({ title: 'Request accepted' });
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error accepting request',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const supabase = createClient();
      await ContentRequestService.decline(supabase, request.id, user.id, adminNotes || undefined);
      toast({ title: 'Request declined' });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error declining request',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertToContent = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const supabase = createClient();

      // Create new content from request
      const content = await ContentService.createContent(supabase, {
        title: request.title,
        description: request.description || undefined,
        content_type_id: request.content_type_id || undefined,
        client_id: request.client_id,
        brief: request.description || undefined,
        due_date: request.requested_date || undefined,
        priority: request.urgency as any,
      }, user.id);

      // Mark request as converted
      await ContentRequestService.convertToContent(
        supabase,
        request.id,
        content.id,
        user.id
      );

      toast({
        title: 'Content created',
        description: `Request converted to content: ${content.title}`,
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error converting request',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[500px] sm:max-w-none overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Request Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                'font-medium',
                STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG]?.color
              )}
            >
              {STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG]?.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'font-medium',
                PRIORITY_CONFIG[request.urgency as keyof typeof PRIORITY_CONFIG]?.color
              )}
            >
              {PRIORITY_CONFIG[request.urgency as keyof typeof PRIORITY_CONFIG]?.label}
            </Badge>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{request.title}</h2>
            {request.description && (
              <p className="text-muted-foreground">{request.description}</p>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid gap-4 py-4 border-y">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{request.client_name}</p>
                <p className="text-xs text-muted-foreground">{request.client_email}</p>
              </div>
            </div>

            {request.content_type_name && (
              <div className="flex items-center gap-3">
                <span className="text-lg">{request.content_type_icon || '📄'}</span>
                <span className="text-sm">{request.content_type_name}</span>
              </div>
            )}

            {request.requested_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Requested for {format(new Date(request.requested_date), 'MMMM d, yyyy')}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Submitted {format(new Date(request.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>

          {/* Reference URLs */}
          {request.reference_urls && request.reference_urls.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Reference Links</Label>
              <div className="space-y-2">
                {request.reference_urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Attachments</Label>
              <div className="space-y-2">
                {request.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-muted rounded hover:bg-muted/80"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{attachment.name || `Attachment ${index + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Admin Notes (for declining) */}
          {request.status === 'pending' && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Admin Notes</Label>
              <Textarea
                placeholder="Add notes (optional, will be saved if declining)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Existing Admin Notes */}
          {request.admin_notes && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Admin Notes</Label>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {request.admin_notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {request.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDecline}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Decline
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAccept}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Accept
                </Button>
              </>
            )}

            {request.status === 'accepted' && (
              <Button
                variant="hero"
                className="w-full"
                onClick={handleConvertToContent}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                Convert to Content
              </Button>
            )}

            {request.status === 'converted' && request.converted_to_content_id && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `/content?id=${request.converted_to_content_id}`;
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                View Content
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
