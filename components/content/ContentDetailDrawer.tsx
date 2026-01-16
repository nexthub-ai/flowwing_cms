'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  X,
  FileText,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle,
  RotateCcw,
  Send,
  Wand2,
} from 'lucide-react';
import { ContentFull } from '@/types';
import {
  CONTENT_STATUS,
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_COLORS,
  PRIORITY_CONFIG,
  ContentStatus,
  Priority,
} from '@/constants/constants';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateContent,
  updateContentStatus,
  approveContent,
  requestRevision,
  fetchComments,
  addComment,
  selectCurrentComments,
} from '@/store/slices/contentSlice';
import { selectUser } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ContentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentFull | null;
  onUpdate?: () => void;
}

export function ContentDetailDrawer({
  isOpen,
  onClose,
  content,
  onUpdate,
}: ContentDetailDrawerProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const comments = useAppSelector(selectCurrentComments);

  const [activeTab, setActiveTab] = useState('details');
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brief, setBrief] = useState('');
  const [ideaNotes, setIdeaNotes] = useState('');
  const [script, setScript] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');

  // Load content data into form
  useEffect(() => {
    if (content) {
      setTitle(content.title || '');
      setDescription(content.description || '');
      setBrief(content.brief || '');
      setIdeaNotes(content.idea_notes || '');
      setScript(content.script || '');
      setCaption(content.caption || '');
      setHashtags(content.hashtags?.join(', ') || '');

      // Fetch comments
      dispatch(fetchComments(content.id));
    }
  }, [content, dispatch]);

  if (!content) return null;

  const priorityConfig = content.priority
    ? PRIORITY_CONFIG[content.priority as Priority]
    : null;

  const statusColor = CONTENT_STATUS_COLORS[content.status as ContentStatus];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(updateContent({
        id: content.id,
        updates: {
          title,
          description,
          brief,
          idea_notes: ideaNotes,
          script,
          caption,
          hashtags: hashtags.split(',').map(h => h.trim()).filter(Boolean),
        },
      })).unwrap();

      toast.success('Content saved');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: ContentStatus) => {
    try {
      await dispatch(updateContentStatus({
        id: content.id,
        status: newStatus,
      })).unwrap();

      toast.success(`Status updated to ${CONTENT_STATUS_LABELS[newStatus]}`);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleApprove = async () => {
    if (!user?.id) return;
    try {
      await dispatch(approveContent({
        id: content.id,
        approvedBy: user.id,
      })).unwrap();

      toast.success('Content approved');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleRequestRevision = async () => {
    try {
      await dispatch(requestRevision(content.id)).unwrap();
      toast.success('Revision requested');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to request revision');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.id) return;

    try {
      await dispatch(addComment({
        contentId: content.id,
        userId: user.id,
        comment: newComment,
      })).unwrap();

      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-none overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <SheetHeader className="p-4 relative">
            <div className="flex items-center gap-3">
              {content.content_type_icon && (
                <span className="text-2xl">{content.content_type_icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg truncate">
                  #{content.content_number} - {content.title}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn('text-xs', statusColor)}>
                    {CONTENT_STATUS_LABELS[content.status as ContentStatus]}
                  </Badge>
                  {priorityConfig && content.priority !== 'normal' && (
                    <Badge className={cn('text-xs', priorityConfig.color)}>
                      {priorityConfig.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          {/* Quick Actions */}
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>

            {content.status === CONTENT_STATUS.REVIEW && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestRevision}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Request Revision
                </Button>
              </>
            )}

            {content.status === CONTENT_STATUS.CREATING && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(CONTENT_STATUS.REVIEW)}
              >
                Submit for Review
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="details" className="flex-1">
                <FileText className="h-4 w-4 mr-1" />
                Details
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1">
                <Wand2 className="h-4 w-4 mr-1" />
                Content
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-1" />
                Comments
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="brief">Brief</Label>
                <Textarea
                  id="brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="What is this content about? Key messages, goals..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="text-sm font-medium">{content.client_name || 'No client'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Content Type</Label>
                  <p className="text-sm font-medium">{content.content_type_name || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="text-sm font-medium">{content.assigned_to_name || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="text-sm font-medium">
                    {content.due_date
                      ? format(new Date(content.due_date), 'MMM d, yyyy')
                      : 'No due date'}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="ideaNotes">Idea Notes</Label>
                <Textarea
                  id="ideaNotes"
                  value={ideaNotes}
                  onChange={(e) => setIdeaNotes(e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="Brainstorming, research notes, inspiration..."
                />
              </div>

              <div>
                <Label htmlFor="script">Script / Copy</Label>
                <Textarea
                  id="script"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="mt-1 font-mono text-sm"
                  rows={8}
                  placeholder="Write your script or copy here..."
                />
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Social media caption..."
                />
              </div>

              <div>
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="mt-1"
                  placeholder="#marketing, #socialmedia, #content"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate with commas
                </p>
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user_avatar || undefined} />
                        <AvatarFallback>
                          {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {comment.user_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
