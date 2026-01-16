'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchContentForKanban,
  selectAllContent,
  selectContentLoading,
} from '@/store/slices/contentSlice';
import { ContentFull } from '@/types';
import {
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_COLORS,
  PRIORITY_CONFIG,
  ContentStatus,
  Priority,
} from '@/constants/constants';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Loader2,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ContentListProps {
  onCardClick: (content: ContentFull) => void;
  searchQuery?: string;
}

export function ContentList({ onCardClick, searchQuery = '' }: ContentListProps) {
  const dispatch = useAppDispatch();
  const allContent = useAppSelector(selectAllContent);
  const isLoading = useAppSelector(selectContentLoading);

  useEffect(() => {
    dispatch(fetchContentForKanban());
  }, [dispatch]);

  // Filter content based on search query
  const filteredContent = allContent.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.client_name?.toLowerCase().includes(query) ||
      item.content_type_name?.toLowerCase().includes(query)
    );
  });

  // Sort by created_at descending (newest first)
  const sortedContent = [...filteredContent].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (isLoading && allContent.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sortedContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>No content found</p>
        {searchQuery && (
          <p className="text-sm mt-1">Try adjusting your search terms</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button variant="ghost" size="sm" className="gap-1 -ml-3">
                Title
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContent.map((content) => (
            <TableRow
              key={content.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onCardClick(content)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  {content.thumbnail_url ? (
                    <img
                      src={content.thumbnail_url}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-lg">
                      {content.content_type_icon || '📄'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium line-clamp-1">
                      {content.title}
                    </span>
                    {content.unresolved_comments > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-600">
                        <MessageSquare className="h-3 w-3" />
                        {content.unresolved_comments} comment{content.unresolved_comments > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {content.content_type_name ? (
                  <Badge variant="outline" className="gap-1">
                    {content.content_type_icon && (
                      <span>{content.content_type_icon}</span>
                    )}
                    {content.content_type_name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {content.client_name || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    'font-medium',
                    CONTENT_STATUS_COLORS[content.status as ContentStatus]
                  )}
                >
                  {CONTENT_STATUS_LABELS[content.status as ContentStatus]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-medium',
                    PRIORITY_CONFIG[content.priority as Priority]?.color
                  )}
                >
                  {PRIORITY_CONFIG[content.priority as Priority]?.label || content.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {content.assigned_to_name ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={content.assigned_to_avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {content.assigned_to_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{content.assigned_to_name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {content.due_date ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(new Date(content.due_date), 'MMM d')}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick(content);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
