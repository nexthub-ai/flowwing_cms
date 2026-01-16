'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentCard } from '@/components/content/ContentCard';
import { ContentDetailDrawer } from '@/components/content/ContentDetailDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAssignedContent,
  selectContent,
  selectContentLoading,
} from '@/store/slices/contentSlice';
import { selectUser } from '@/store/slices/authSlice';
import { ContentFull } from '@/types';
import {
  CONTENT_STATUS,
  CONTENT_STATUS_LABELS,
  CONTENT_STATUS_COLORS,
  ContentStatus,
} from '@/constants/constants';
import {
  Loader2,
  CheckSquare,
  Clock,
  Edit3,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const tasks = useAppSelector(selectContent);
  const isLoading = useAppSelector(selectContentLoading);

  const [selectedContent, setSelectedContent] = useState<ContentFull | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('active');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAssignedContent({ userId: user.id }));
    }
  }, [dispatch, user?.id]);

  const handleCardClick = (content: ContentFull) => {
    setSelectedContent(content);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedContent(null);
  };

  const handleContentUpdate = () => {
    if (user?.id) {
      dispatch(fetchAssignedContent({ userId: user.id }));
    }
  };

  // Group tasks by status
  const activeStatuses = [CONTENT_STATUS.IDEATION, CONTENT_STATUS.CREATING, CONTENT_STATUS.REVISION];
  const completedStatuses = [CONTENT_STATUS.APPROVED, CONTENT_STATUS.SCHEDULED, CONTENT_STATUS.PUBLISHED];

  const activeTasks = tasks.filter(t => activeStatuses.includes(t.status as any));
  const reviewTasks = tasks.filter(t => t.status === CONTENT_STATUS.REVIEW);
  const completedTasks = tasks.filter(t => completedStatuses.includes(t.status as any));

  const getTabContent = () => {
    switch (activeTab) {
      case 'active':
        return activeTasks;
      case 'review':
        return reviewTasks;
      case 'completed':
        return completedTasks;
      default:
        return tasks;
    }
  };

  const currentTasks = getTabContent();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold mb-1">My Tasks</h1>
            <p className="text-muted-foreground">
              Content assigned to you for creation and editing
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeTasks.length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Eye className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reviewTasks.length}</p>
                  <p className="text-sm text-muted-foreground">In Review</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Active
                {activeTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeTasks.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2">
                <Eye className="h-4 w-4" />
                In Review
                {reviewTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {reviewTasks.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>

            {/* Task List */}
            {isLoading && tasks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : currentTasks.length === 0 ? (
              <div className="text-center py-12 bg-card border rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {activeTab === 'active' && 'No active tasks'}
                  {activeTab === 'review' && 'No tasks in review'}
                  {activeTab === 'completed' && 'No completed tasks'}
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === 'active' && 'Tasks assigned to you will appear here'}
                  {activeTab === 'review' && 'Tasks you\'ve submitted for review will appear here'}
                  {activeTab === 'completed' && 'Tasks that have been approved or published will appear here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentTasks.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    onClick={() => handleCardClick(content)}
                  />
                ))}
              </div>
            )}
          </Tabs>
        </div>
      </main>

      {/* Content Detail Drawer */}
      <ContentDetailDrawer
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        content={selectedContent}
        onUpdate={handleContentUpdate}
      />
    </div>
  );
}
