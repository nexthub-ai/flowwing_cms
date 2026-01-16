'use client';

import { ContentFull } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { PRIORITY_CONFIG, Priority } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: ContentFull;
  onClick?: () => void;
  isDragging?: boolean;
}

export function ContentCard({ content, onClick, isDragging }: ContentCardProps) {
  const priorityConfig = content.priority
    ? PRIORITY_CONFIG[content.priority as Priority]
    : null;

  const hasMedia = content.media && content.media.length > 0;
  const commentCount = content.unresolved_comments || 0;

  return (
    <Card
      className={cn(
        'p-3 cursor-pointer hover:shadow-md transition-all border-l-4',
        isDragging && 'shadow-lg opacity-90 rotate-2'
      )}
      style={{ borderLeftColor: content.content_type_color || '#cbd5e1' }}
      onClick={onClick}
    >
      {/* Header with content type */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {content.content_type_icon && (
            <span className="text-lg flex-shrink-0" title={content.content_type_name || undefined}>
              {content.content_type_icon}
            </span>
          )}
          <span className="text-xs text-muted-foreground truncate">
            #{content.content_number}
          </span>
        </div>
        {priorityConfig && content.priority !== 'normal' && (
          <Badge className={cn('text-xs', priorityConfig.color)}>
            {priorityConfig.label}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-sm mb-2 line-clamp-2">
        {content.title}
      </h4>

      {/* Client name */}
      {content.client_name && (
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {content.client_name}
        </p>
      )}

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {/* Due date */}
        {content.due_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(content.due_date), { addSuffix: true })}
            </span>
          </div>
        )}

        {/* Media indicator */}
        {hasMedia && (
          <div className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
            <span>{content.media.length}</span>
          </div>
        )}

        {/* Comments indicator */}
        {commentCount > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{commentCount}</span>
          </div>
        )}
      </div>

      {/* Assignee */}
      {content.assigned_to_name && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t">
          <Avatar className="h-5 w-5">
            <AvatarImage src={content.assigned_to_avatar || undefined} />
            <AvatarFallback className="text-[10px]">
              {content.assigned_to_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {content.assigned_to_name}
          </span>
        </div>
      )}
    </Card>
  );
}
