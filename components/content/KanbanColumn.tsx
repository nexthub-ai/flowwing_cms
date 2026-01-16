'use client';

import { ContentFull } from '@/types';
import { ContentCard } from './ContentCard';
import { ContentStatus, CONTENT_STATUS_LABELS, CONTENT_STATUS_COLORS } from '@/constants/constants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  status: ContentStatus;
  items: ContentFull[];
  onCardClick: (content: ContentFull) => void;
  onDragStart: (e: React.DragEvent, content: ContentFull) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: ContentStatus) => void;
  onAddNew?: () => void;
  showAddButton?: boolean;
}

export function KanbanColumn({
  status,
  items,
  onCardClick,
  onDragStart,
  onDragOver,
  onDrop,
  onAddNew,
  showAddButton = false,
}: KanbanColumnProps) {
  const label = CONTENT_STATUS_LABELS[status];
  const colorClass = CONTENT_STATUS_COLORS[status];

  return (
    <div
      className="flex flex-col min-w-[280px] max-w-[320px] bg-muted/30 rounded-lg"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Badge className={cn('text-xs font-medium', colorClass)}>
            {label}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            {items.length}
          </span>
        </div>
        {showAddButton && onAddNew && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddNew}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
        {items.map((content) => (
          <div
            key={content.id}
            draggable
            onDragStart={(e) => onDragStart(e, content)}
            className="cursor-grab active:cursor-grabbing"
          >
            <ContentCard
              content={content}
              onClick={() => onCardClick(content)}
            />
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            No items
          </div>
        )}
      </div>
    </div>
  );
}
