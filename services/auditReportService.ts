import { AuditBrandReview } from './auditService';

// Re-export the type for convenience
export type { AuditBrandReview };

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
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
  }

  /**
   * Get color based on score
   */
  private static getScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // amber
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  /**
   * FlowWing Logo SVG
   */
  private static readonly LOGO_SVG = `
    <svg width="50" height="50" viewBox="20 20 65 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(59,130,246);stop-opacity:1"/>
          <stop offset="100%" style="stop-color:rgb(147,51,234);stop-opacity:1"/>
        </linearGradient>
      </defs>
      <path d="M25 50 Q30 30, 50 25 T75 30 Q80 35, 75 45 Q70 55, 50 60 T30 55 Q25 52, 25 50 Z" fill="url(#wingGradient)" opacity="0.9"/>
      <path d="M35 45 L45 45" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 50 L48 50" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M41 55 L51 55" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="60" cy="45" r="3" fill="white" opacity="0.8"/>
    </svg>
  `;

  /**
   * Generate complete HTML audit report
   */
  static generateHTML(review: AuditBrandReview, companyName?: string): string {
    const esc = this.escapeHtml;
    const scoreColor = this.getScoreColor(review.overall_score || 0);
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Social Media Audit Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1e293b;
      background: white;
      padding: 0;
    }

    .report-container {
      width: 100%;
      margin: 0 auto;
      background: white;
    }
    
    /* Header */
    .report-header {
      background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
      color: white;
      padding: 3rem 2rem;
      position: relative;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .brand-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }
    
    .report-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .report-subtitle {
      font-size: 1.1rem;
      opacity: 0.95;
      font-weight: 300;
    }
    
    .report-date {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    /* Score Section */
    .score-section {
      background: linear-gradient(to bottom, #fafafa, white);
      padding: 4rem 2rem;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .score-label {
      font-size: 1rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2rem;
      font-weight: 600;
    }
    
    .score-circle-container {
      position: relative;
      width: 250px;
      height: 250px;
      margin: 0 auto;
    }
    
    .score-circle-svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    
    .score-circle-bg {
      fill: none;
      stroke: #e2e8f0;
      stroke-width: 12;
    }
    
    .score-circle-progress {
      fill: none;
      stroke: ${scoreColor};
      stroke-width: 12;
      stroke-linecap: round;
      stroke-dasharray: 565.48;
      stroke-dashoffset: ${565.48 - (565.48 * (review.overall_score || 0)) / 100};
      transition: stroke-dashoffset 1.5s ease;
    }
    
    .score-circle-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    
    .score-value {
      font-size: 4.5rem;
      font-weight: 800;
      color: ${scoreColor};
      line-height: 1;
      display: block;
    }
    
    .score-max {
      font-size: 1.5rem;
      color: #94a3b8;
      display: block;
      margin-top: 0.5rem;
    }
    
    /* Content */
    .report-content {
      padding: 3rem 2rem;
    }
    
    .section {
      margin-bottom: 3rem;
    }
    
    .section-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 3px solid #3b82f6;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .section-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    .subsection {
      margin-bottom: 2rem;
    }
    
    .subsection-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 1rem;
    }
    
    /* Clarity Cards */
    .clarity-grid {
      display: grid;
      gap: 1.5rem;
    }
    
    .clarity-card {
      padding: 1.5rem;
      background: linear-gradient(to right, #f0f9ff, #faf5ff);
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .clarity-label {
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .clarity-text {
      color: #475569;
      line-height: 1.8;
    }
    
    /* Platform Cards */
    .platform-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      transition: all 0.3s;
    }
    
    .platform-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
      transform: translateY(-2px);
    }
    
    .platform-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    
    .platform-name {
      font-size: 1.5rem;
      font-weight: 800;
      text-transform: uppercase;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 2px;
    }
    
    .platform-summary {
      font-style: italic;
      color: #64748b;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #cbd5e1;
    }
    
    .insight-section {
      margin-bottom: 1.5rem;
    }
    
    .insight-header {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .insight-header.working {
      color: #10b981;
    }
    
    .insight-header.working::before {
      content: "✓";
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #d1fae5;
      border-radius: 50%;
      font-size: 14px;
    }
    
    .insight-header.hurting {
      color: #ef4444;
    }
    
    .insight-header.hurting::before {
      content: "⚠";
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #fee2e2;
      border-radius: 50%;
      font-size: 14px;
    }
    
    .insight-header.actions {
      color: #3b82f6;
    }
    
    .insight-header.actions::before {
      content: "→";
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #dbeafe;
      border-radius: 50%;
      font-weight: bold;
      font-size: 16px;
    }
    
    .insight-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .insight-list li {
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      background: #fafafa;
      border-radius: 6px;
      position: relative;
      padding-left: 2.5rem;
      color: #475569;
      transition: all 0.2s;
    }
    
    .insight-list li:hover {
      background: #f1f5f9;
      transform: translateX(4px);
    }
    
    .insight-list li::before {
      content: "•";
      position: absolute;
      left: 1rem;
      color: #94a3b8;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    /* Focus Areas */
    .focus-list {
      display: grid;
      gap: 1rem;
    }
    
    .focus-item {
      padding: 1rem 1.5rem;
      background: linear-gradient(to right, #eff6ff, #faf5ff);
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      font-weight: 500;
      color: #334155;
      transition: all 0.2s;
    }
    
    .focus-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.15);
    }
    
    /* Solution Cards */
    .solution-card {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
    }
    
    .solution-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .solution-title {
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }
    
    .solution-text {
      color: #475569;
      line-height: 1.8;
    }
    
    /* Guidance Cards */
    .guidance-card {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      background: #fafafa;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    
    .guidance-platform {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      color: white;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .guidance-text {
      color: #475569;
      line-height: 1.8;
    }
    
    /* Next Steps */
    .next-steps-section {
      background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
      color: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      margin-top: 2rem;
    }
    
    .next-steps-section .section-title {
      color: white;
      border-bottom-color: rgba(255, 255, 255, 0.3);
    }
    
    .next-steps-section .section-icon {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .next-steps-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .next-steps-list li {
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      padding-left: 2rem;
    }
    
    .next-steps-list li:last-child {
      border-bottom: none;
    }
    
    .next-steps-list li::before {
      content: "→";
      position: absolute;
      left: 0;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    /* Footer */
    .report-footer {
      background: #0f172a;
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .footer-text {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    @media print {
      body {
        background: white;
      }
      .report-container {
        box-shadow: none;
      }
      .platform-card:hover {
        transform: none;
      }
      .section {
        page-break-inside: avoid;
      }
      .platform-card {
        page-break-inside: avoid;
      }
    }
    
    /* Client Title Section */
    .client-title-section {
      background: white;
      padding: 3rem 2rem;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .client-label {
      font-size: 0.85rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    .client-name {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #3b82f6, #9333ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- Header -->
    <header class="report-header">
      <div class="logo-section">
        ${this.LOGO_SVG}
        <span class="brand-name">FlowWing</span>
      </div>
      <h1 class="report-title">Brand Social Media Audit</h1>
      <p class="report-subtitle">Comprehensive Analysis & Strategic Recommendations</p>
      <p class="report-date">Generated on ${today}</p>
    </header>

    <!-- Client Title Section -->
    ${companyName ? `
    <section class="client-title-section">
      <div class="client-label">Audit Report Prepared For</div>
      <h2 class="client-name">${esc(companyName)}</h2>
    </section>
    ` : ''}

    <!-- Score Section -->
    <section class="score-section">
      <div class="score-label">Overall Score</div>
      <div class="score-circle-container">
        <svg class="score-circle-svg" viewBox="0 0 200 200">
          <circle class="score-circle-bg" cx="100" cy="100" r="90" />
          <circle class="score-circle-progress" cx="100" cy="100" r="90" />
        </svg>
        <div class="score-circle-content">
          <span class="score-value">${review.overall_score || 0}</span>
          <span class="score-max">out of 100</span>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="report-content">
      
      <!-- Executive Summary -->
      ${review.executive_summary ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">1</span>
          Executive Summary
        </h2>
        ${review.executive_summary.positioning || review.executive_summary.description ? `
          <p class="clarity-text" style="margin-bottom: 1.5rem; font-size: 1.05rem; line-height: 1.8;">
            ${esc(review.executive_summary.positioning || review.executive_summary.description || '')}
          </p>
        ` : ''}
        <div class="clarity-grid" style="grid-template-columns: 1fr; gap: 1rem;">
          ${review.executive_summary.primary_issue || review.executive_summary.issue ? `
            <div class="clarity-card" style="border-left-color: #ef4444;">
              <div class="clarity-label" style="color: #ef4444;">! Primary Issue</div>
              <div class="clarity-text">${esc(review.executive_summary.primary_issue || review.executive_summary.issue)}</div>
            </div>
          ` : ''}
          ${review.executive_summary.biggest_opportunity || review.executive_summary.opportunity ? `
            <div class="clarity-card" style="border-left-color: #10b981;">
              <div class="clarity-label" style="color: #10b981;">+ Biggest Opportunity</div>
              <div class="clarity-text">${esc(review.executive_summary.biggest_opportunity || review.executive_summary.opportunity)}</div>
            </div>
          ` : ''}
        </div>
      </section>
      ` : ''}

      <!-- Platform Priority Order -->
      ${review.platform_priority_order && review.platform_priority_order.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">2</span>
          Platform Priority (Next 30 Days)
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;">
          ${review.platform_priority_order.map((platform: any, index: number) => `
            <div style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1.25rem;
              background: ${index === 0 ? 'linear-gradient(135deg, #3b82f6, #9333ea)' : '#f8fafc'};
              color: ${index === 0 ? 'white' : '#475569'};
              border: ${index === 0 ? 'none' : '2px solid #e2e8f0'};
              border-radius: 8px;
              font-weight: ${index === 0 ? '700' : '600'};
              font-size: 0.95rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              ${index === 0 ? 'box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);' : ''}
            ">
              <span style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: ${index === 0 ? 'rgba(255,255,255,0.2)' : '#e2e8f0'};
                border-radius: 50%;
                font-size: 0.8rem;
                font-weight: 700;
              ">${index + 1}</span>
              ${esc(platform)}
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}
      
      <!-- Brand Clarity -->
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">3</span>
          Brand Clarity
        </h2>
        <div class="clarity-grid">
          <div class="clarity-card">
            <div class="clarity-label">Current Positioning</div>
            <div class="clarity-text">${esc(review.brand_clarity?.current_positioning || 'Not available')}</div>
          </div>
          <div class="clarity-card">
            <div class="clarity-label">Core Tension</div>
            <div class="clarity-text">${esc(review.brand_clarity?.core_tension || 'Not available')}</div>
          </div>
          <div class="clarity-card">
            <div class="clarity-label">Recommended Focus</div>
            <div class="clarity-text">${esc(review.brand_clarity?.recommended_focus || 'Not available')}</div>
          </div>
        </div>
      </section>

      <!-- Strategic Focus Areas -->
      ${review.strategic_focus_areas && review.strategic_focus_areas.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">4</span>
          Strategic Focus Areas
        </h2>
        <div class="focus-list">
          ${review.strategic_focus_areas.map((area: any) => `
            <div class="focus-item">${esc(area)}</div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Platform Reviews -->
      ${review.platforms && review.platforms.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">5</span>
          Platform Reviews
        </h2>
        ${review.platforms.map((platform: any) => `
          <div class="platform-card">
            <div class="platform-header">
              <div class="platform-name">${esc(platform.platform || 'Platform')}</div>
            </div>
            ${platform.diagnosis ? `
              <div class="platform-summary">${esc(platform.diagnosis)}</div>
            ` : ''}
            
            ${platform.what_works && platform.what_works.length > 0 ? `
            <div class="insight-section">
              <div class="insight-header working">What's Working</div>
              <ul class="insight-list">
                ${platform.what_works.map((item: any) => `<li>${esc(item)}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${platform.what_hurts && platform.what_hurts.length > 0 ? `
            <div class="insight-section">
              <div class="insight-header hurting">What's Hurting</div>
              <ul class="insight-list">
                ${platform.what_hurts.map((item: any) => `<li>${esc(item)}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
            
            ${platform.actions && platform.actions.length > 0 ? `
            <div class="insight-section">
              <div class="insight-header actions">Priority Actions</div>
              <ul class="insight-list">
                ${platform.actions.map((item: any) => `<li>${esc(item)}</li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Content Patterns -->
      ${review.content_patterns && review.content_patterns.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">6</span>
          Content & Messaging Patterns
        </h2>
        <ul class="insight-list">
          ${review.content_patterns.map((pattern: any) => `<li>${esc(pattern)}</li>`).join('')}
        </ul>
      </section>
      ` : ''}

      <!-- Solutions -->
      ${review.solutions && review.solutions.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">7</span>
          Solutions & Strategic Direction
        </h2>
        ${review.solutions.map((solution: any) => `
          <div class="solution-card">
            <div class="solution-title">${esc(solution.title || solution)}</div>
            ${solution.description ? `
              <div class="solution-text">${esc(solution.description)}</div>
            ` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Inspiration Guidance -->
      ${review.inspiration_guidance && review.inspiration_guidance.length > 0 ? `
      <section class="section">
        <h2 class="section-title">
          <span class="section-icon">8</span>
          Inspiration & Expression Guidance
        </h2>
        ${review.inspiration_guidance.map((guidance: any) => `
          <div class="guidance-card">
            <div class="guidance-platform">${esc(guidance.platform || 'Platform')}</div>
            <div class="guidance-text">${esc(guidance.guidance || guidance)}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Next 30 Days -->
      ${review.next_30_day_focus && review.next_30_day_focus.length > 0 ? `
      <section class="section next-steps-section">
        <h2 class="section-title">
          <span class="section-icon">9</span>
          Next 30-Day Focus
        </h2>
        <ul class="next-steps-list">
          ${review.next_30_day_focus.map((item: any) => `<li>${esc(item)}</li>`).join('')}
        </ul>
      </section>
      ` : ''}
      
    </div>

    <!-- Footer -->
    <footer class="report-footer">
      <div class="footer-logo">
        ${this.LOGO_SVG}
        <span style="font-weight: 700; font-size: 1.2rem;">FlowWing</span>
      </div>
      <p class="footer-text">Your Partner in Social Media Growth</p>
      <p class="footer-text" style="font-size: 0.8rem; margin-top: 0.5rem;">© ${new Date().getFullYear()} FlowWing. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
`;
  }
}
