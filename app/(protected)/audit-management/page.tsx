'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectRoles } from "@/store/slices/authSlice";
import { createClient } from "@/supabase/client";
import { CombinedAuditService, CombinedAuditData } from "@/services/combinedAuditService";
import { AuditTable } from "@/components/audit/AuditTable";
import { AuditReviewModal } from "@/components/audit/AuditReviewModal";

export default function AuditManagementPage() {
  const roles = useAppSelector(selectRoles);
  const { toast } = useToast();
  const [combinedData, setCombinedData] = useState<CombinedAuditData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<CombinedAuditData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const canManage = roles.includes("admin") || roles.includes("pms");

  useEffect(() => {
    if (canManage) {
      loadAllAuditData();
    }
  }, [canManage]);

  const loadAllAuditData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const data = await CombinedAuditService.getAllCombinedAuditData(supabase);
      setCombinedData(data);
    } catch (error: any) {
      toast({
        title: "Error loading audit data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (item: CombinedAuditData) => {
    setSelectedReview(item);
    setIsModalOpen(true);
  };

  const handleApprove = async (runId: string) => {
    setIsApproving(true);
    try {
      const supabase = createClient();
      await CombinedAuditService.updateRunStatus(supabase, runId, 'delivered');

      toast({ title: "Audit approved and marked as delivered" });
      await loadAllAuditData();
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error approving audit",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  if (!canManage) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="container py-8 px-6">
            <div className="flex flex-col items-center justify-center py-24">
              <ClipboardCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground">You need admin or PMS privileges to access this page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="container py-8 px-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-display font-bold">Audit Management</h1>
              </div>
              <p className="text-muted-foreground">
                Manage all audit signups, runs, and reviews in one place
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Audits</CardTitle>
                <CardDescription>Combined view of signups, runs, and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : combinedData.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No audit data found</p>
                  </div>
                ) : (
                  <AuditTable 
                    data={combinedData}
                    onViewDetails={handleViewDetails}
                    onApprove={handleApprove}
                    isApproving={isApproving}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AuditReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAudit={selectedReview}
        onApprove={handleApprove}
        isApproving={isApproving}
      />
    </>
  );
}
