'use client';

import { useEffect, useState, useMemo } from 'react';
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
  ContentStatus,
} from '@/constants/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface ContentCalendarProps {
  onCardClick: (content: ContentFull) => void;
  onAddNew?: (date?: Date) => void;
  searchQuery?: string;
}

export function ContentCalendar({ onCardClick, onAddNew, searchQuery = '' }: ContentCalendarProps) {
  const dispatch = useAppDispatch();
  const allContent = useAppSelector(selectAllContent);
  const isLoading = useAppSelector(selectContentLoading);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Group content by due_date and scheduled_at
  const contentByDate = useMemo(() => {
    const map = new Map<string, ContentFull[]>();

    filteredContent.forEach((content) => {
      // Use scheduled_at for scheduled/published content, otherwise use due_date
      const dateField = content.status === 'scheduled' || content.status === 'published'
        ? content.scheduled_at || content.due_date
        : content.due_date;

      if (dateField) {
        const dateKey = format(new Date(dateField), 'yyyy-MM-dd');
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, content]);
      }
    });

    return map;
  }, [filteredContent]);

  // Get days for current month view (including days from prev/next months to fill weeks)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  if (isLoading && allContent.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 border rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-muted/50 border-b">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayContent = contentByDate.get(dateKey) || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[120px] border-b border-r p-1 transition-colors',
                  !isCurrentMonth && 'bg-muted/30',
                  isCurrentDay && 'bg-primary/5'
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full',
                      !isCurrentMonth && 'text-muted-foreground',
                      isCurrentDay && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {isCurrentMonth && onAddNew && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:opacity-100"
                      onClick={() => onAddNew(day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Content items */}
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayContent.slice(0, 3).map((content) => (
                    <div
                      key={content.id}
                      className={cn(
                        'px-1.5 py-0.5 rounded text-xs cursor-pointer truncate transition-colors',
                        'hover:ring-2 hover:ring-primary/50',
                        CONTENT_STATUS_COLORS[content.status as ContentStatus]
                      )}
                      onClick={() => onCardClick(content)}
                      title={content.title}
                    >
                      <span className="mr-1">{content.content_type_icon || '📄'}</span>
                      {content.title}
                    </div>
                  ))}
                  {dayContent.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1.5">
                      +{dayContent.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
        <span className="text-muted-foreground">Status:</span>
        {Object.entries(CONTENT_STATUS_LABELS).slice(0, 6).map(([status, label]) => (
          <Badge
            key={status}
            variant="outline"
            className={cn(
              'text-xs',
              CONTENT_STATUS_COLORS[status as ContentStatus]
            )}
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
