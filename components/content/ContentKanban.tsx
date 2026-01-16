'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchContentForKanban,
  updateContentStatus,
  moveContentToStatus,
  selectContentByStatus,
  selectContentLoading,
} from '@/store/slices/contentSlice';
import { KanbanColumn } from './KanbanColumn';
import { ContentFull } from '@/types';
import {
  CONTENT_STATUS,
  CONTENT_STATUS_ORDER,
  ContentStatus,
} from '@/constants/constants';
import { Loader2 } from 'lucide-react';

interface ContentKanbanProps {
  onCardClick: (content: ContentFull) => void;
  onAddNew?: () => void;
}

export function ContentKanban({ onCardClick, onAddNew }: ContentKanbanProps) {
  const dispatch = useAppDispatch();
  const contentByStatus = useAppSelector(selectContentByStatus);
  const isLoading = useAppSelector(selectContentLoading);

  const [draggedItem, setDraggedItem] = useState<ContentFull | null>(null);

  useEffect(() => {
    dispatch(fetchContentForKanban());
  }, [dispatch]);

  const handleDragStart = (e: React.DragEvent, content: ContentFull) => {
    setDraggedItem(content);
    e.dataTransfer.effectAllowed = 'move';
    // Add drag image styling
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: ContentStatus) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null);
      return;
    }

    // Optimistic update
    dispatch(moveContentToStatus({
      id: draggedItem.id,
      fromStatus: draggedItem.status as ContentStatus,
      toStatus: newStatus,
    }));

    // Persist to database
    try {
      await dispatch(updateContentStatus({
        id: draggedItem.id,
        status: newStatus,
      })).unwrap();
    } catch (error) {
      // Revert on failure - refetch to sync
      dispatch(fetchContentForKanban());
    }

    setDraggedItem(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  if (isLoading && Object.values(contentByStatus).every(arr => arr.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="flex gap-4 overflow-x-auto pb-4"
      onDragEnd={handleDragEnd}
    >
      {CONTENT_STATUS_ORDER.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          items={contentByStatus[status] || []}
          onCardClick={onCardClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddNew={onAddNew}
          showAddButton={status === CONTENT_STATUS.INBOX}
        />
      ))}
    </div>
  );
}
