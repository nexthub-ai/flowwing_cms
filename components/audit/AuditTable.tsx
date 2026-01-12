'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, PlayCircle, Eye, CheckCircle2, ExternalLink, Mail, FileCheck, Loader2, Link2
} from "lucide-react";
import { CombinedAuditData } from "@/services/combinedAuditService";

type RunStatus = "in_progress" | "review" | "delivered";

const runStatusConfig: Record<RunStatus, {
  label: string;
  icon: React.ElementType;
  color: string;
}> = {
  in_progress: { label: "In Progress", icon: PlayCircle, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  review: { label: "Review", icon: Eye, color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" }
};

interface AuditTableProps {
  data: CombinedAuditData[];
  onViewDetails: (item: CombinedAuditData) => void;
  onApprove: (runId: string) => void;
  isApproving: boolean;
}

export function AuditTable({ data, onViewDetails, onApprove, isApproving }: AuditTableProps) {
  const getPriorityPlatform = (item: CombinedAuditData) => {
    if (item.brand_review?.platform_priority_order && item.brand_review.platform_priority_order.length > 0) {
      return item.brand_review.platform_priority_order[0];
    }
    return "-";
  };

  const getScore = (item: CombinedAuditData) => {
    return item.brand_review?.overall_score || "-";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Social Handles</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Priority Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Report URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const statusConfig = item.run_status ? runStatusConfig[item.run_status] : null;
            const StatusIcon = statusConfig?.icon;
            const score = getScore(item);
            const priorityPlatform = getPriorityPlatform(item);
            
            return (
              <TableRow key={item.signup_id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.brand_name || "-"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.social_handles && Object.keys(item.social_handles).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.social_handles).map(([platform, url]) => (
                        <Button
                          key={platform}
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 px-2 text-xs"
                        >
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Link2 className="h-3 w-3 mr-1" />
                            {platform}
                          </a>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {score !== "-" ? (
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-500/20 font-bold">
                      {score}/100
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {priorityPlatform !== "-" ? (
                    <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/20 capitalize">
                      {priorityPlatform}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {statusConfig ? (
                    <Badge variant="outline" className={statusConfig.color}>
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {statusConfig.label}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                      No Run
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.report_url ? (
                    <Button variant="link" size="sm" asChild className="h-auto p-0">
                      <a href={item.report_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.brand_review && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(item)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    )}
                    {item.run_status === "review" && item.run_id && item.brand_review && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewDetails(item)}
                        disabled={isApproving}
                      >
                        {isApproving ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <FileCheck className="h-3 w-3 mr-1" />
                        )}
                        Approve & Deliver
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
