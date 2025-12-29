'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { STATUS_COLORS } from '@/constants/constants';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadContent, selectContent, selectContentLoading } from '@/store/slices/contentSlice';
import { useState } from 'react';

/**
 * Content Page (Client Component)
 * Manages content posts with Redux state management
 */
export default function ContentPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectContent);
  const isLoading = useAppSelector(selectContentLoading);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(loadContent()).catch(() => {
      toast({
        title: 'Error',
        description: 'Failed to load content posts',
        variant: 'destructive',
      });
    });
  }, [dispatch, toast]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Content</h1>
              <p className="text-muted-foreground">
                Manage your social media content calendar
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-10 bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Content Grid */}
          {!isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl bg-card border border-border/50 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={STATUS_COLORS[post.status]}>
                      {post.status}
                    </Badge>
                    {post.platform && (
                      <Badge variant="outline">{post.platform}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  {post.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.scheduled_at && (
                      <span>
                        Scheduled:{' '}
                        {new Date(post.scheduled_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No content found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
