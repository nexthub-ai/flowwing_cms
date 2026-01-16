'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { AuditBrandReview } from '@/services/auditService';

interface AuditReviewFormProps {
  review: AuditBrandReview;
  onChange: (updates: Partial<AuditBrandReview>) => void;
}

export function AuditReviewForm({ review, onChange }: AuditReviewFormProps) {
  // Helper to update nested objects
  const updateField = (field: keyof AuditBrandReview, value: any) => {
    onChange({ [field]: value });
  };

  const updateNestedField = (field: keyof AuditBrandReview, key: string, value: any) => {
    const current = review[field] || {};
    onChange({ [field]: { ...current, [key]: value } });
  };

  // Helper to update array items
  const updateArrayItem = (field: keyof AuditBrandReview, index: number, value: any) => {
    const arr = [...(review[field] as any[] || [])];
    arr[index] = value;
    onChange({ [field]: arr });
  };

  const addArrayItem = (field: keyof AuditBrandReview, defaultValue: any) => {
    const arr = [...(review[field] as any[] || []), defaultValue];
    onChange({ [field]: arr });
  };

  const removeArrayItem = (field: keyof AuditBrandReview, index: number) => {
    const arr = (review[field] as any[] || []).filter((_, i) => i !== index);
    onChange({ [field]: arr });
  };

  // Platform helpers
  const updatePlatformField = (platformIndex: number, key: string, value: any) => {
    const platforms = [...(review.platforms || [])];
    platforms[platformIndex] = { ...platforms[platformIndex], [key]: value };
    onChange({ platforms });
  };

  const updatePlatformArrayItem = (platformIndex: number, arrayKey: string, itemIndex: number, value: string) => {
    const platforms = [...(review.platforms || [])];
    const arr = [...(platforms[platformIndex][arrayKey] || [])];
    arr[itemIndex] = value;
    platforms[platformIndex] = { ...platforms[platformIndex], [arrayKey]: arr };
    onChange({ platforms });
  };

  const addPlatformArrayItem = (platformIndex: number, arrayKey: string) => {
    const platforms = [...(review.platforms || [])];
    const arr = [...(platforms[platformIndex][arrayKey] || []), ''];
    platforms[platformIndex] = { ...platforms[platformIndex], [arrayKey]: arr };
    onChange({ platforms });
  };

  const removePlatformArrayItem = (platformIndex: number, arrayKey: string, itemIndex: number) => {
    const platforms = [...(review.platforms || [])];
    const arr = (platforms[platformIndex][arrayKey] || []).filter((_: any, i: number) => i !== itemIndex);
    platforms[platformIndex] = { ...platforms[platformIndex], [arrayKey]: arr };
    onChange({ platforms });
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={0}
              max={100}
              value={review.overall_score || 0}
              onChange={(e) => updateField('overall_score', parseInt(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-muted-foreground">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Positioning / Description</Label>
            <Textarea
              value={review.executive_summary?.positioning || review.executive_summary?.description || ''}
              onChange={(e) => updateNestedField('executive_summary', 'positioning', e.target.value)}
              rows={3}
              placeholder="Brand positioning or description..."
            />
          </div>
          <div>
            <Label>Primary Issue</Label>
            <Textarea
              value={review.executive_summary?.primary_issue || review.executive_summary?.issue || ''}
              onChange={(e) => updateNestedField('executive_summary', 'primary_issue', e.target.value)}
              rows={2}
              placeholder="Main challenge or issue..."
            />
          </div>
          <div>
            <Label>Biggest Opportunity</Label>
            <Textarea
              value={review.executive_summary?.biggest_opportunity || review.executive_summary?.opportunity || ''}
              onChange={(e) => updateNestedField('executive_summary', 'biggest_opportunity', e.target.value)}
              rows={2}
              placeholder="Biggest growth opportunity..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Brand Clarity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Brand Clarity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Positioning</Label>
            <Textarea
              value={review.brand_clarity?.current_positioning || ''}
              onChange={(e) => updateNestedField('brand_clarity', 'current_positioning', e.target.value)}
              rows={2}
              placeholder="Current brand positioning..."
            />
          </div>
          <div>
            <Label>Core Tension</Label>
            <Textarea
              value={review.brand_clarity?.core_tension || ''}
              onChange={(e) => updateNestedField('brand_clarity', 'core_tension', e.target.value)}
              rows={2}
              placeholder="Core brand tension..."
            />
          </div>
          <div>
            <Label>Recommended Focus</Label>
            <Textarea
              value={review.brand_clarity?.recommended_focus || ''}
              onChange={(e) => updateNestedField('brand_clarity', 'recommended_focus', e.target.value)}
              rows={2}
              placeholder="Recommended focus areas..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Priority Order */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Platform Priority Order
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('platform_priority_order', '')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(review.platform_priority_order || []).map((platform: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="w-6 text-sm text-muted-foreground">{index + 1}.</span>
                <Input
                  value={platform}
                  onChange={(e) => updateArrayItem('platform_priority_order', index, e.target.value)}
                  placeholder="Platform name..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('platform_priority_order', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Focus Areas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Strategic Focus Areas
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('strategic_focus_areas', '')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(review.strategic_focus_areas || []).map((area: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={area}
                  onChange={(e) => updateArrayItem('strategic_focus_areas', index, e.target.value)}
                  placeholder="Focus area..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('strategic_focus_areas', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Reviews */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Platform Reviews
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('platforms', { platform: '', diagnosis: '', what_works: [], what_hurts: [], actions: [] })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Platform
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(review.platforms || []).map((platform: any, pIndex: number) => (
            <Card key={pIndex} className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={platform.platform || ''}
                    onChange={(e) => updatePlatformField(pIndex, 'platform', e.target.value)}
                    placeholder="Platform name (e.g., Instagram)"
                    className="font-semibold text-lg w-48"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('platforms', pIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Diagnosis</Label>
                  <Textarea
                    value={platform.diagnosis || ''}
                    onChange={(e) => updatePlatformField(pIndex, 'diagnosis', e.target.value)}
                    rows={2}
                    placeholder="Platform diagnosis..."
                  />
                </div>

                {/* What's Working */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-green-600">What's Working</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addPlatformArrayItem(pIndex, 'what_works')}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(platform.what_works || []).map((item: string, iIndex: number) => (
                      <div key={iIndex} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updatePlatformArrayItem(pIndex, 'what_works', iIndex, e.target.value)}
                          placeholder="What's working..."
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlatformArrayItem(pIndex, 'what_works', iIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Hurting */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-red-600">What's Hurting</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addPlatformArrayItem(pIndex, 'what_hurts')}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(platform.what_hurts || []).map((item: string, iIndex: number) => (
                      <div key={iIndex} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updatePlatformArrayItem(pIndex, 'what_hurts', iIndex, e.target.value)}
                          placeholder="What's hurting..."
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlatformArrayItem(pIndex, 'what_hurts', iIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Actions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-blue-600">Priority Actions</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addPlatformArrayItem(pIndex, 'actions')}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(platform.actions || []).map((item: string, iIndex: number) => (
                      <div key={iIndex} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updatePlatformArrayItem(pIndex, 'actions', iIndex, e.target.value)}
                          placeholder="Action item..."
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlatformArrayItem(pIndex, 'actions', iIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Content Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Content & Messaging Patterns
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('content_patterns', '')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(review.content_patterns || []).map((pattern: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={pattern}
                  onChange={(e) => updateArrayItem('content_patterns', index, e.target.value)}
                  placeholder="Content pattern..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('content_patterns', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Solutions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Solutions & Strategic Direction
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('solutions', { title: '', description: '' })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(review.solutions || []).map((solution: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  value={typeof solution === 'string' ? solution : solution.title || ''}
                  onChange={(e) => updateArrayItem('solutions', index, { ...solution, title: e.target.value })}
                  placeholder="Solution title..."
                  className="font-medium"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('solutions', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                value={typeof solution === 'string' ? '' : solution.description || ''}
                onChange={(e) => updateArrayItem('solutions', index, { ...solution, description: e.target.value })}
                placeholder="Solution description..."
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inspiration Guidance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Inspiration & Expression Guidance
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('inspiration_guidance', { platform: '', guidance: '' })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(review.inspiration_guidance || []).map((guidance: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  value={typeof guidance === 'string' ? '' : guidance.platform || ''}
                  onChange={(e) => updateArrayItem('inspiration_guidance', index, { ...guidance, platform: e.target.value })}
                  placeholder="Platform..."
                  className="w-40"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('inspiration_guidance', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                value={typeof guidance === 'string' ? guidance : guidance.guidance || ''}
                onChange={(e) => updateArrayItem('inspiration_guidance', index, { ...guidance, guidance: e.target.value })}
                placeholder="Guidance..."
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next 30 Day Focus */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Next 30-Day Focus
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('next_30_day_focus', '')}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(review.next_30_day_focus || []).map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateArrayItem('next_30_day_focus', index, e.target.value)}
                  placeholder="Focus item..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('next_30_day_focus', index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
