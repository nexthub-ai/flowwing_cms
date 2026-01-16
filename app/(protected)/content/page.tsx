'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentKanban } from '@/components/content/ContentKanban';
import { ContentDetailDrawer } from '@/components/content/ContentDetailDrawer';
import { ContentCreateDrawer } from '@/components/content/ContentCreateDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentFull } from '@/types';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Filter,
} from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchContentForKanban } from '@/store/slices/contentSlice';

type ViewMode = 'kanban' | 'list' | 'calendar';

export default function ContentPage() {
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<ContentFull | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCardClick = (content: ContentFull) => {
    setSelectedContent(content);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedContent(null);
  };

  const handleContentUpdate = () => {
    // Refresh the kanban data
    dispatch(fetchContentForKanban());
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Content</h1>
              <p className="text-muted-foreground">
                Manage and track all your content in one place
              </p>
            </div>
            <Button variant="hero" className="gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              New Content
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-1"
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-1"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="gap-1"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </div>

            {/* Filter Button */}
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Content View */}
          <div className="bg-background rounded-lg border p-4">
            {viewMode === 'kanban' && (
              <ContentKanban
                onCardClick={handleCardClick}
                onAddNew={() => setIsCreateOpen(true)}
              />
            )}

            {viewMode === 'list' && (
              <div className="text-center py-12 text-muted-foreground">
                List view coming soon...
              </div>
            )}

            {viewMode === 'calendar' && (
              <div className="text-center py-12 text-muted-foreground">
                Calendar view coming soon...
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Content Detail Drawer */}
      <ContentDetailDrawer
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        content={selectedContent}
        onUpdate={handleContentUpdate}
      />

      {/* Create Content Drawer */}
      <ContentCreateDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleContentUpdate}
      />
    </div>
  );
}
