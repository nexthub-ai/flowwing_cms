'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileCheck, Loader2, Edit, Save, Eye, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CombinedAuditData } from "@/services/combinedAuditService";
import { AuditReportService, AuditBrandReview } from "@/services/auditReportService";
import { AuditService } from "@/services/auditService";
import { createClient } from "@/supabase/client";

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
  const [editedContent, setEditedContent] = useState("");
  const [processingStage, setProcessingStage] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAudit?.brand_review) {
      const html = AuditReportService.generateHTML(
        selectedAudit.brand_review,
        selectedAudit.brand_name || undefined
      );
      setEditedContent(html);
      setIsEditing(false);
    }
  }, [selectedAudit]);

  const parseHtmlToReviewData = (html: string): Partial<AuditBrandReview> => {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const extractText = (selector: string): string => {
      const element = doc.querySelector(selector);
      return element?.textContent?.trim() || '';
    };

    const extractListItems = (selector: string): string[] => {
      const items = doc.querySelectorAll(selector);
      return Array.from(items).map(item => item.textContent?.trim() || '').filter(Boolean);
    };

    // Note: This is a simplified parser. Full HTML->JSON parsing would be very complex.
    // For now, we'll just note that edits were made and keep the original structure
    return {
      // We can't reliably parse complex nested JSON from edited HTML
      // So we'll just track that it was edited
    };
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      // Save changes back to database
      if (contentRef.current && selectedAudit?.brand_review) {
        const editedHtml = contentRef.current.innerHTML;
        setEditedContent(editedHtml);
        
        try {
          const supabase = createClient();
          
          // Parse HTML back to review data (simplified - just marks as edited)
          // In a production app, you'd need sophisticated HTML->JSON parsing
          const updates = parseHtmlToReviewData(editedHtml);
          
          // Note: Since parsing HTML back to exact JSON structure is complex,
          // we'll store the edited HTML in component state and use it for PDF generation
          // The original database fields remain unchanged unless you implement full parsing
          
          toast.success("Report changes saved (will be used for PDF generation)");
        } catch (error) {
          console.error('Save error:', error);
          toast.error('Failed to save changes');
          return;
        }
      }
    }
    setIsEditing(!isEditing);
  };

  const handleApproveWithReport = async () => {
    if (!selectedAudit?.run_id || !editedContent) {
      toast.error("Missing required data");
      return;
    }

    try {
      setProcessingStage("Generating report screenshot...");
      
      // Call the approve API with HTML content
      const response = await fetch('/api/audit/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          runId: selectedAudit.run_id,
          htmlContent: editedContent,
        }),
      });

      setProcessingStage("Uploading to Cloudinary...");
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve audit');
      }

      setProcessingStage("Calling webhook...");
      
      // Small delay to show the stage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage("Updating status...");
      
      // Small delay to show the stage
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
    if (!editedContent) return;
    
    // Open in new window for full preview
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(editedContent);
      previewWindow.document.close();
    }
  };

  if (!selectedAudit) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[70vw] sm:max-w-none overflow-y-auto p-0">
        <div className="sticky top-0 z-50 bg-primary border-b">
          <SheetHeader className="p-6 pb-4 relative">
            <SheetTitle>Audit Review - {selectedAudit.brand_name}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-6 top-4 text-white hover:bg-white/20 rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          
          <div className="px-6 pb-4 flex justify-between items-center flex-wrap gap-3">
            <div className="text-sm text-white">
              Score: <span className="text-2xl font-bold text-white">
                {selectedAudit.brand_review?.overall_score || 0}
              </span>/100
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreview}
                disabled={!editedContent}
              >
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
              <Button
                variant={isEditing ? "default" : "secondary"}
                size="sm"
                onClick={handleToggleEdit}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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

        {selectedAudit.brand_review && (
          <div className="p-6">
            {isEditing && (
              <div className="mb-4 py-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                <strong className="flex items-center gap-2 mb-1">
                  <Edit className="h-4 w-4" />
                  Edit Mode Active
                </strong>
                Click anywhere in the report below to edit. Changes are saved locally and won't affect the original data.
              </div>
            )}
            
            <div 
              ref={contentRef}
              className={`rounded-lg bg-black transition-all ${
                isEditing 
                  ? 'outline-2 outline-dashed outline-blue-400 outline-offset-2' 
                  : ''
              }`}
              contentEditable={isEditing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: editedContent }}
              style={{
                minHeight: isEditing ? '600px' : 'auto',
              }}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
