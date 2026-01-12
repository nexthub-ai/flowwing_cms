import crypto from 'crypto';
import puppeteer from 'puppeteer';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_url: string;
  public_id: string;
  bytes: number;
}

export class CloudinaryService { 
  static generateSignature(params: {
    folder: string;
    publicId: string;
    timestamp: number;
  }): { signature: string; timestamp: number } {
    const { folder, publicId, timestamp } = params;
    
    const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const cloudinarySecret = process.env.CLOUDINARY_API_SECRET!;
    
    const signature = crypto
      .createHash('sha1')
      .update(signatureBase + cloudinarySecret)
      .digest('hex');

    return { signature, timestamp };
  }

  
  static async htmlToScreenshot(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 }); // Retina quality
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      // Take full page screenshot
      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'png',
      });

      return Buffer.from(screenshotBuffer);
    } finally {
      await browser.close();
    }
  }


  static async screenshotToPdf(screenshotBuffer: Buffer): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Convert buffer to base64 data URL
      const base64Image = screenshotBuffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      // Create HTML with the image
      const imageHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { margin: 0; padding: 0; }
              body { display: flex; justify-content: center; align-items: center; }
              img { width: 100%; height: auto; display: block; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
          </body>
        </html>
      `;
      
      await page.setContent(imageHtml, { waitUntil: 'networkidle0' });
      
      // Generate PDF from the image
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

 
  static async uploadScreenshot(params: {
    screenshotBuffer: Buffer;
    publicId: string;
    folder?: string;
  }): Promise<CloudinaryUploadResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = params.folder || 'audit-reports';
    
    // Generate signature
    const { signature } = this.generateSignature({
      folder,
      publicId: params.publicId,
      timestamp,
    });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(params.screenshotBuffer)], { type: 'image/png' }), 'report.png');
    formData.append('public_id', params.publicId);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const uploadResult = await cloudinaryResponse.json();

    // Build public download URL
    const publicDownloadUrl = this.buildDownloadUrl(uploadResult.secure_url);

    return {
      secure_url: uploadResult.secure_url,
      public_url: publicDownloadUrl,
      public_id: uploadResult.public_id,
      bytes: uploadResult.bytes,
    };
  }

 
  static async htmlToPdf(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Upload PDF to Cloudinary
   */
  static async uploadPdf(params: {
    pdfBuffer: Buffer;
    publicId: string;
    folder?: string;
  }): Promise<CloudinaryUploadResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = params.folder || 'audit-reports';
    
    // Generate signature
    const { signature } = this.generateSignature({
      folder,
      publicId: params.publicId,
      timestamp,
    });

    // Prepare form data
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(params.pdfBuffer)], { type: 'application/pdf' }), 'report.pdf');
    formData.append('public_id', params.publicId);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const uploadResult = await cloudinaryResponse.json();

    // Build public download URL
    const publicDownloadUrl = this.buildDownloadUrl(uploadResult.secure_url);

    return {
      secure_url: uploadResult.secure_url,
      public_url: publicDownloadUrl,
      public_id: uploadResult.public_id,
      bytes: uploadResult.bytes,
    };
  }

  /**
   * Upload HTML content to Cloudinary as raw file
   */
  static async uploadHtml(params: {
    htmlContent: string;
    publicId: string;
    folder?: string;
  }): Promise<CloudinaryUploadResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = params.folder || 'audit-reports';
    
    // Generate signature
    const { signature } = this.generateSignature({
      folder,
      publicId: params.publicId,
      timestamp,
    });

    // Prepare form data
    const htmlBlob = Buffer.from(params.htmlContent, 'utf-8');
    const formData = new FormData();
    formData.append('file', new Blob([htmlBlob], { type: 'text/html' }), 'report.html');
    formData.append('public_id', params.publicId);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const uploadResult = await cloudinaryResponse.json();

    // Build public download URL
    const publicDownloadUrl = this.buildDownloadUrl(uploadResult.secure_url);

    return {
      secure_url: uploadResult.secure_url,
      public_url: publicDownloadUrl,
      public_id: uploadResult.public_id,
      bytes: uploadResult.bytes,
    };
  }

  /**
   * Build public download URL with attachment flag
   */
  static buildDownloadUrl(secureUrl: string): string {
    return secureUrl.replace(
      '/raw/upload/',
      '/raw/upload/fl_attachment/'
    );
  }
 
  static async uploadAuditReport(params: {
    runId: string;
    htmlContent: string;
  }): Promise<CloudinaryUploadResult> {
    const publicId = `audits/${params.runId}-${Date.now()}`;
    
    // Upload HTML directly to Cloudinary
    return this.uploadHtml({
      htmlContent: params.htmlContent,
      publicId,
      folder: 'audit-reports',
    });
  }

 
  static async deleteFile(publicId: string): Promise<boolean> {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `public_id=${publicId}&timestamp=${timestamp}`;
    const cloudinarySecret = process.env.CLOUDINARY_API_SECRET!;
    
    const signature = crypto
      .createHash('sha1')
      .update(signatureBase + cloudinarySecret)
      .digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/raw/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    return response.ok;
  }
}
