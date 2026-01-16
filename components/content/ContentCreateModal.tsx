'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createContent, fetchContentTypes, selectContentTypes } from '@/store/slices/contentSlice';
import { fetchClients, selectClients } from '@/store/slices/clientsSlice';
import { selectUser } from '@/store/slices/authSlice';
import { PRIORITY } from '@/constants/constants';
import { toast } from 'sonner';

interface ContentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ContentCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: ContentCreateModalProps) {
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

  // Fetch content types and clients when modal opens
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

  // Reset form when modal closes
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Content
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title..."
              className="mt-1"
              autoFocus
            />
          </div>

          {/* Content Type */}
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentTypeId} onValueChange={setContentTypeId}>
              <SelectTrigger className="mt-1">
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
          <div>
            <Label htmlFor="client">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="mt-1">
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

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the content..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Brief */}
          <div>
            <Label htmlFor="brief">Content Brief</Label>
            <Textarea
              id="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="What is this content about? Key messages, goals..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
                  <SelectItem value={PRIORITY.NORMAL}>Normal</SelectItem>
                  <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                  <SelectItem value={PRIORITY.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
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
      </DialogContent>
    </Dialog>
  );
}
