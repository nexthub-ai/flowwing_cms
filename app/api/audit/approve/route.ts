import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/supabase/server';
import { AuditService } from '@/services/auditService';
import { CloudinaryService } from '@/services/cloudinaryService';

export async function POST(request: NextRequest) { 
  const supabase = createServiceClient();

  try {
    const { runId, htmlContent } = await request.json();

    if (!runId || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Fetch audit run using service
    const auditRun = await AuditService.getAuditRunById(supabase, runId);

    if (!auditRun) {
      return NextResponse.json(
        { error: 'Audit run not found' },
        { status: 404 }
      );
    }

    // 2. Upload HTML report to Cloudinary using service
    const uploadResult = await CloudinaryService.uploadAuditReport({
      runId,
      htmlContent,
    });

    // 3. Save report URL to database (before webhook)
    await AuditService.updateReportUrl(supabase, runId, uploadResult.public_url);

    // 4. Call webhook and wait for OK response
    const webhookUrl = process.env.AUDIT_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audit_run_id: runId
        }),
      });

      if (!webhookResponse.ok) {
        throw new Error('Webhook request failed');
      }

      // Parse and validate webhook response
      const webhookData = await webhookResponse.json();
      
      // Check if response is array with ok: true, or object with ok: true
      const isSuccess = Array.isArray(webhookData) 
        ? webhookData[0]?.ok === true
        : webhookData?.ok === true;

      if (!isSuccess) {
        throw new Error('Webhook did not return ok status');
      }
    }

    // 5. Update audit_runs status (only after webhook success)
    await AuditService.markRunDelivered(supabase, runId);

    // 6. Update audit_signups status using service
    await AuditService.markSignupDelivered(supabase, auditRun.audit_signup_id);

    return NextResponse.json({
      success: true,
      report_url: uploadResult.public_url,
      status: 'delivered'
    });

  } catch (error) {
    console.error('Approve audit error:', error);
    return NextResponse.json(
      { error: 'Failed to approve audit' },
      { status: 500 }
    );
  }
} 
   