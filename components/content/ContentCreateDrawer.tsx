'use client';

import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
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
  FileText,
  Users,
  Calendar,
  Flag,
  AlignLeft,
  Type,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createContent, fetchContentTypes, selectContentTypes } from '@/store/slices/contentSlice';
import { fetchClients, selectClients } from '@/store/slices/clientsSlice';
import { selectUser } from '@/store/slices/authSlice';
import { PRIORITY } from '@/constants/constants';
import { toast } from 'sonner';

interface ContentCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ContentCreateDrawer({
  isOpen,
  onClose,
  onSuccess,
}: ContentCreateDrawerProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const clients = useAppSelector(selectClients);
  const contentTypes = useAppSelector(selectContentTypes);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentTypeId, setContentTypeId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [brief, setBrief] = useState('');
  const [priority, setPriority] = useState<string>('normal');
  const [dueDate, setDueDate] = useState('');

  // Fetch content types and clients when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (contentTypes.length === 0) {
        dispatch(fetchContentTypes());
      }
      if (clients.length === 0) {
        dispatch(fetchClients({}));
      }
    }
  }, [isOpen, contentTypes.length, clients.length, dispatch]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setContentTypeId('');
      setClientId('');
      setBrief('');
      setPriority('normal');
      setDueDate('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(createContent({
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          content_type_id: contentTypeId || undefined,
          client_id: clientId || undefined,
          brief: brief.trim() || undefined,
          priority: priority as any,
          due_date: dueDate || undefined,
        },
        createdBy: user.id,
      })).unwrap();

      toast.success('Content created successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to create content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-slate-600';
      default: return '';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Create New Content
          </SheetTitle>
          <SheetDescription>
            Add a new content piece to your workflow
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title..."
                autoFocus
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="contentType" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Content Type
              </Label>
              <Select value={contentTypeId} onValueChange={setContentTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Client
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Content Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Content Details
            </h3>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the content..."
                rows={2}
              />
            </div>

            {/* Brief */}
            <div className="space-y-2">
              <Label htmlFor="brief" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Content Brief
              </Label>
              <Textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="What is this content about? Key messages, goals..."
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Scheduling
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2">
                  <Flag className={`h-4 w-4 ${getPriorityColor(priority)}`} />
                  Priority
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PRIORITY.LOW}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Low
                      </span>
                    </SelectItem>
                    <SelectItem value={PRIORITY.NORMAL}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Normal
                      </span>
                    </SelectItem>
                    <SelectItem value={PRIORITY.HIGH}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        High
                      </span>
                    </SelectItem>
                    <SelectItem value={PRIORITY.URGENT}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Urgent
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
                  Create Content
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
