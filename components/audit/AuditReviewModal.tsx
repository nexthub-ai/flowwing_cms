'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileCheck, Loader2 } from "lucide-react";
import { CombinedAuditData } from "@/services/combinedAuditService";
import { AuditReportService } from "@/services/auditReportService";

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
  if (!selectedAudit) return null;

  const htmlContent = selectedAudit.brand_review 
    ? AuditReportService.generateHTML(selectedAudit.brand_review)
    : '';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-none overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Audit Review - {selectedAudit.brand_name}</SheetTitle>
        </SheetHeader>
        
        {selectedAudit.brand_review && (
          <div className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Score: <span className="text-2xl font-bold text-primary">
                  {selectedAudit.brand_review.overall_score || 0}
                </span>/100
              </div>
              {selectedAudit.run_status === "review" && selectedAudit.run_id && (
                <Button
                  variant="default"
                  onClick={() => onApprove(selectedAudit.run_id!)}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
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
            
            <div 
              className="border rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
