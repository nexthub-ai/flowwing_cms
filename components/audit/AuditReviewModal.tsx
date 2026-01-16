'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Loader2, Edit, Save, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CombinedAuditData } from "@/services/combinedAuditService";
import { AuditReportService } from "@/services/auditReportService";
import { AuditService, AuditBrandReview } from "@/services/auditService";
import { createClient } from "@/supabase/client";
import { AuditReviewForm } from "./AuditReviewForm";

interface AuditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAudit: CombinedAuditData | null;
  onApprove: (runId: string) => void;
  isApproving: boolean;
}

export function AuditReviewModal({
  isOpen,
  onClose,
  selectedAudit,
  onApprove,
  isApproving
}: AuditReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("preview");

  // Local state for editing - copy of brand_review
  const [editedReview, setEditedReview] = useState<AuditBrandReview | null>(null);

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedAudit?.brand_review) {
      // Deep clone the review data for editing
      setEditedReview(JSON.parse(JSON.stringify(selectedAudit.brand_review)));
      setIsEditing(false);
      setHasChanges(false);
      setActiveTab("preview");
    }
  }, [selectedAudit]);

  // Generate HTML from current review data
  const generateCurrentHTML = () => {
    if (!editedReview) return '';
    return AuditReportService.generateHTML(
      editedReview,
      selectedAudit?.brand_name || undefined
    );
  };

  const handleReviewChange = (updates: Partial<AuditBrandReview>) => {
    if (!editedReview) return;
    setEditedReview({ ...editedReview, ...updates });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editedReview || !selectedAudit?.brand_review?.id) {
      toast.error("No review data to save");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();

      // Prepare update data - exclude id, audit_run_id, created_at
      const { id, audit_run_id, created_at, ...updateData } = editedReview;

      await AuditService.updateBrandReview(
        supabase,
        selectedAudit.brand_review.id,
        updateData
      );

      setHasChanges(false);
      toast.success("Changes saved to database");
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEdit = () => {
    if (isEditing && hasChanges) {
      // Switching from edit to preview with unsaved changes - prompt to save
      handleSave();
    }
    setIsEditing(!isEditing);
    setActiveTab(isEditing ? "preview" : "edit");
  };

  const handleApproveWithReport = async () => {
    if (!selectedAudit?.run_id || !editedReview) {
      toast.error("Missing required data");
      return;
    }

    // Save any pending changes first
    if (hasChanges) {
      await handleSave();
    }

    try {
      setProcessingStage("Generating report...");

      // Generate HTML from current edited review data
      const htmlContent = generateCurrentHTML();

      // Call the approve API with HTML content
      const response = await fetch('/api/audit/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          runId: selectedAudit.run_id,
          htmlContent: htmlContent,
        }),
      });

      setProcessingStage("Uploading report...");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve audit');
      }

      setProcessingStage("Finalizing...");

      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Audit approved and delivered successfully!');
      setProcessingStage("");

      // Call the original onApprove to refresh data
      onApprove(selectedAudit.run_id);

      // Close modal after successful approval
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve audit. Please try again.');
      setProcessingStage("");
    }
  };

  const handlePreview = () => {
    const html = generateCurrentHTML();
    if (!html) return;

    // Open in new window for full preview
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    onClose();
  };

  if (!selectedAudit || !editedReview) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:w-[70vw] sm:max-w-none overflow-y-auto p-0">
        <div className="sticky top-0 z-50 bg-primary border-b">
          <SheetHeader className="p-6 pb-4 relative">
            <SheetTitle className="text-white">Audit Review - {selectedAudit.brand_name}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute right-6 top-4 text-white hover:bg-white/20 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="px-6 pb-4 flex justify-between items-center flex-wrap gap-3">
            <div className="text-sm text-white">
              Score: <span className="text-2xl font-bold text-white">
                {editedReview.overall_score || 0}
              </span>/100
              {hasChanges && (
                <span className="ml-2 text-yellow-300 text-xs">(unsaved changes)</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
              <Button
                variant={isEditing ? "default" : "secondary"}
                size="sm"
                onClick={handleToggleEdit}
              >
                {isEditing ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Preview
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Report
                  </>
                )}
              </Button>
              {selectedAudit.run_status === "review" && selectedAudit.run_id && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleApproveWithReport}
                  disabled={isApproving || processingStage !== ""}
                >
                  {isApproving || processingStage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {processingStage || "Delivering..."}
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4 mr-2" />
                      Approve & Deliver
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit Fields</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <div
                className="rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: generateCurrentHTML() }}
              />
            </TabsContent>

            <TabsContent value="edit">
              <AuditReviewForm
                review={editedReview}
                onChange={handleReviewChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
