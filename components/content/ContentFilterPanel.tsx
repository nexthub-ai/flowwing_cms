'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  Calendar as CalendarIcon,
  Filter,
  RotateCcw,
} from 'lucide-react';
import {
  CONTENT_STATUS,
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_COLORS,
  PRIORITY,
  PRIORITY_CONFIG,
  ContentStatus,
  Priority,
} from '@/constants/constants';
import { ContentFilters, ClientFull } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectContentTypes } from '@/store/slices/contentSlice';

interface ContentFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ContentFilters;
  onApplyFilters: (filters: ContentFilters) => void;
  clients?: ClientFull[];
}

export function ContentFilterPanel({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  clients = [],
}: ContentFilterPanelProps) {
  const contentTypes = useAppSelector(selectContentTypes);
  const [localFilters, setLocalFilters] = useState<ContentFilters>(filters);

  // Sync with external filters when panel opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleStatusToggle = (status: ContentStatus) => {
    const currentStatuses = Array.isArray(localFilters.status)
      ? localFilters.status
      : localFilters.status
        ? [localFilters.status]
        : [];

    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    setLocalFilters({
      ...localFilters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handlePriorityChange = (priority: string) => {
    setLocalFilters({
      ...localFilters,
      priority: priority === 'all' ? undefined : (priority as Priority),
    });
  };

  const handleClientChange = (clientId: string) => {
    setLocalFilters({
      ...localFilters,
      client_id: clientId === 'all' ? undefined : clientId,
    });
  };

  const handleContentTypeChange = (typeId: string) => {
    setLocalFilters({
      ...localFilters,
      content_type_id: typeId === 'all' ? undefined : typeId,
    });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setLocalFilters({
      ...localFilters,
      date_from: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setLocalFilters({
      ...localFilters,
      date_to: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const activeFilterCount = [
    localFilters.status,
    localFilters.priority,
    localFilters.client_id,
    localFilters.content_type_id,
    localFilters.date_from,
    localFilters.date_to,
  ].filter(Boolean).length;

  const selectedStatuses = Array.isArray(localFilters.status)
    ? localFilters.status
    : localFilters.status
      ? [localFilters.status]
      : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-none">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <SheetTitle>Filters</SheetTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount} active</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CONTENT_STATUS).map(([key, status]) => {
                const isSelected = selectedStatuses.includes(status);
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className={cn(
                      'cursor-pointer transition-colors',
                      isSelected
                        ? CONTENT_STATUS_COLORS[status]
                        : 'hover:bg-muted'
                    )}
                    onClick={() => handleStatusToggle(status)}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {CONTENT_STATUS_LABELS[status]}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Priority</Label>
            <Select
              value={localFilters.priority || 'all'}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {Object.entries(PRIORITY).map(([key, priority]) => (
                  <SelectItem key={priority} value={priority}>
                    <span className={cn(
                      'inline-flex items-center gap-2',
                      PRIORITY_CONFIG[priority]?.color
                    )}>
                      {PRIORITY_CONFIG[priority]?.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Filter */}
          {clients.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Client</Label>
              <Select
                value={localFilters.client_id || 'all'}
                onValueChange={handleClientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Content Type Filter */}
          {contentTypes.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Content Type</Label>
              <Select
                value={localFilters.content_type_id || 'all'}
                onValueChange={handleContentTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center gap-2">
                        {type.icon && <span>{type.icon}</span>}
                        {type.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Due Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !localFilters.date_from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.date_from
                      ? format(new Date(localFilters.date_from), 'MMM d')
                      : 'From'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.date_from ? new Date(localFilters.date_from) : undefined}
                    onSelect={handleDateFromChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !localFilters.date_to && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.date_to
                      ? format(new Date(localFilters.date_to), 'MMM d')
                      : 'To'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.date_to ? new Date(localFilters.date_to) : undefined}
                    onSelect={handleDateToChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            className="flex-1"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
