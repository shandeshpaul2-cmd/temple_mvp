/**
 * Certificate Service - Handles DONATION certificate generation ONLY
 * Integrates with Python certificate service via API endpoints
 */

export interface CertificateData {
  donor_name: string;
  amount: string | number;
  donation_id: string;
  donation_date: string; // YYYY-MM-DD format
  payment_mode?: string;
  org_name?: string;
  org_subtitle?: string;
  show_80g_note?: boolean;
}

export interface CertificateResponse {
  success: boolean;
  filename?: string;
  download_url?: string;
  message?: string;
  error?: string;
  details?: string;
}

export interface CertificateServiceConfig {
  baseUrl?: string;
  timeout?: number;
}

class CertificateService {
  private baseUrl: string;
  private timeout: number;

  constructor(config: CertificateServiceConfig = {}) {
    this.baseUrl = config.baseUrl || '/api/certificates';
    this.timeout = config.timeout || 5000; // 5 seconds for faster response
  }

  /**
   * Generate a donation certificate
   */
  async generateCertificate(data: CertificateData): Promise<CertificateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Ensure consistent defaults
          org_name: data.org_name || 'Shri Raghavendra Swamy Brundavana Sannidhi, Halasuru',
          org_subtitle: data.org_subtitle || 'Guru Seva Mandali (Regd.)',
          show_80g_note: data.show_80g_note !== false, // Default to true
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Certificate generation failed',
          details: result.details,
        };
      }

      return {
        success: true,
        filename: result.filename,
        download_url: result.download_url,
        message: result.message,
      };

    } catch (error) {
      console.error('Certificate service error:', error);
      return {
        success: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if certificate service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // Short timeout for health check
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.status === 'healthy';

    } catch (error) {
      console.error('Certificate service health check failed:', error);
      return false;
    }
  }

  /**
   * Download certificate file
   */
  async downloadCertificate(filename: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/download/${encodeURIComponent(filename)}`);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Certificate download error:', error);
      throw error;
    }
  }

  /**
   * Generate certificate and immediately trigger download
   */
  async generateAndDownload(data: CertificateData): Promise<CertificateResponse> {
    const result = await this.generateCertificate(data);

    if (result.success && result.filename) {
      try {
        await this.downloadCertificate(result.filename);
      } catch (error) {
        // Certificate was generated but download failed
        return {
          success: false,
          error: 'Certificate generated but download failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          filename: result.filename,
          download_url: result.download_url,
        };
      }
    }

    return result;
  }

  /**
   * Get certificate download URL for use in links or WhatsApp
   */
  getDownloadUrl(filename: string): string {
    return `${this.baseUrl}/download/${encodeURIComponent(filename)}`;
  }

  /**
   * Generate certificate asynchronously without blocking payment flow
   */
  async generateCertificateAsync(data: CertificateData): Promise<void> {
    // Fire and forget - generate certificate in background
    this.generateCertificate(data).catch(error => {
      console.warn('Async certificate generation failed:', error);
    });
  }

  /**
   * Format donation data from existing donation record
   */
  static formatDonationData(donation: any): CertificateData {
    return {
      donor_name: donation.name || donation.donorName || '',
      amount: donation.amount || donation.donationAmount || 0,
      donation_id: donation.receiptNumber || donation.donationId || '',
      donation_date: donation.createdAt ?
        new Date(donation.createdAt).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0],
      payment_mode: donation.paymentMode || 'Online',
    };
  }
}

// Export singleton instance
export const certificateService = new CertificateService();

export default CertificateService;