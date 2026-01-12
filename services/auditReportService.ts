import { AuditBrandReview } from './auditService';

/**
 * Service for generating audit report HTML
 */
export class AuditReportService {
  /**
   * Escape HTML special characters
   */
  private static escapeHtml(str: any = ''): string {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Generate complete HTML audit report
   */
  static generateHTML(review: AuditBrandReview): string {
    const esc = this.escapeHtml;
    const meta = review.executive_summary?.meta || { 
      brand_name: 'Brand', 
      generated_at: new Date().toISOString() 
    };
    
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${esc(meta.brand_name)} – Social Media Audit</title>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #111; padding: 20px; }
  h1, h2, h3 { margin-top: 32px; }
  h1 { font-size: 28px; }
  h2 { font-size: 22px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
  h3 { font-size: 18px; }
  p { margin: 8px 0; }
  ul { margin: 8px 0 16px 20px; }
  li { margin-bottom: 6px; }
  .score { font-size: 40px; font-weight: bold; color: #0066cc; }
  .platform { margin-top: 24px; background: #f9f9f9; padding: 16px; border-radius: 8px; }
</style>
</head>

<body>

<h1>${esc(meta.brand_name)} – Social Media Audit</h1>
<p><em>Generated on ${new Date(meta.generated_at).toLocaleDateString()}</em></p>

<h2>Executive Summary</h2>
<p>${esc(review.executive_summary?.positioning || 'N/A')}</p>
<p><strong>Primary Issue:</strong> ${esc(review.executive_summary?.primary_issue || 'N/A')}</p>
<p><strong>Biggest Opportunity:</strong> ${esc(review.executive_summary?.biggest_opportunity || 'N/A')}</p>

<h2>Overall Score</h2>
<div class="score">${esc(review.overall_score || 0)} / 100</div>

<h2>Platform Priority (Next 30 Days)</h2>
<ol>
  ${(review.platform_priority_order || []).map((p: any) => `<li>${esc(p)}</li>`).join('')}
</ol>

<h2>Brand Clarity</h2>
<p><strong>Current Positioning:</strong> ${esc(review.brand_clarity?.current_positioning || 'N/A')}</p>
<p><strong>Core Tension:</strong> ${esc(review.brand_clarity?.core_tension || 'N/A')}</p>
<p><strong>Recommended Focus:</strong> ${esc(review.brand_clarity?.recommended_focus || 'N/A')}</p>

<h2>Strategic Focus Areas</h2>
<ul>
  ${(review.strategic_focus_areas || []).map((a: any) => `<li>${esc(a)}</li>`).join('')}
</ul>

<h2>Platform Reviews</h2>

${(review.platforms || []).map((p: any) => `
  <div class="platform">
    <h3>${esc(p.platform?.toUpperCase() || 'PLATFORM')}</h3>
    <p>${esc(p.diagnosis || '')}</p>

    <p><strong>What's Working</strong></p>
    <ul>${(p.what_works || []).map((w: any) => `<li>${esc(w)}</li>`).join('')}</ul>

    <p><strong>What's Hurting</strong></p>
    <ul>${(p.what_hurts || []).map((h: any) => `<li>${esc(h)}</li>`).join('')}</ul>

    <p><strong>Priority Actions</strong></p>
    <ul>${(p.actions || []).map((a: any) => `<li>${esc(a)}</li>`).join('')}</ul>
  </div>
`).join('')}

<h2>Content & Messaging Patterns</h2>
<ul>
  ${(review.content_patterns || []).map((c: any) => `<li>${esc(c)}</li>`).join('')}
</ul>

<h2>Solutions & Strategic Direction</h2>
<ul>
  ${(review.solutions || []).map((s: any) => `<li>${esc(s)}</li>`).join('')}
</ul>

<h2>Inspiration & Expression Guidance</h2>
<ul>
  ${(review.inspiration_guidance || []).map((i: any) => `<li>${esc(i)}</li>`).join('')}
</ul>

<h2>Next 30-Day Focus</h2>
<ul>
  ${(review.next_30_day_focus || []).map((n: any) => `<li>${esc(n)}</li>`).join('')}
</ul>

</body>
</html>
`;
  }
}
