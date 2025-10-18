/**
 * Production-Ready WhatsApp Service for Twilio WhatsApp Business API
 * Includes rate limiting, error handling, delivery tracking, and compliance features
 */

export interface ProductionWhatsAppConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  webhookUrl?: string;
  webhookToken?: string;
  rateLimitPerSecond: number;
  rateLimitPerMinute: number;
  businessProfileId?: string;
  enableDeliveryReports: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface MessageMetrics {
  sent: number;
  delivered: number;
  failed: number;
  read: number;
  lastSentTime?: Date;
  averageDeliveryTime?: number;
}

export interface DeliveryReport {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'undelivered';
  timestamp: Date;
  errorCode?: string;
  errorMessage?: string;
  deliveryTime?: number;
}

export interface WhatsAppTemplate {
  name: string;
  namespace?: string;
  language: {
    code: string;
    policy: 'deterministic' | 'fallback';
  };
  components: Array<{
    type: 'body' | 'header' | 'footer';
    text?: string;
    parameters?: Array<{ type: string; text: string }>;
  }>;
}

export interface ProductionWhatsAppMessage {
  phoneNumber: string;
  message: string;
  type: 'donation' | 'pooja_booking' | 'parihara_pooja' | 'astrology_consultation' | 'template';
  templateName?: string;
  templateParams?: string[];
  mediaUrl?: string;
  priority?: 'high' | 'normal' | 'low';
  deliveryCallbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface RateLimiter {
  tokens: number;
  lastRefill: Date;
  windowStart: Date;
  countInWindow: number;
}

class ProductionWhatsAppService {
  private config: ProductionWhatsAppConfig;
  private adminPhoneNumber = '+918310408797';
  private templeName = 'Shri Raghavendra Swamy Brundavana Sannidhi';

  // Rate limiting
  private rateLimiter: RateLimiter = {
    tokens: 50,
    lastRefill: new Date(),
    windowStart: new Date(),
    countInWindow: 0
  };

  // Metrics tracking
  private metrics: MessageMetrics = {
    sent: 0,
    delivered: 0,
    failed: 0,
    read: 0
  };

  // Message queue for high-priority messages
  private messageQueue: ProductionWhatsAppMessage[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
      webhookUrl: process.env.WHATSAPP_WEBHOOK_URL,
      webhookToken: process.env.WHATSAPP_WEBHOOK_TOKEN,
      rateLimitPerSecond: parseInt(process.env.WHATSAPP_RATE_LIMIT_PER_SECOND || '50'),
      rateLimitPerMinute: parseInt(process.env.WHATSAPP_RATE_LIMIT_PER_MINUTE || '1000'),
      businessProfileId: process.env.WHATSAPP_BUSINESS_PROFILE_ID,
      enableDeliveryReports: process.env.WHATSAPP_ENABLE_DELIVERY_REPORTS === 'true',
      logLevel: (process.env.WHATSAPP_LOG_LEVEL as any) || 'info'
    };

    this.validateConfiguration();
    this.startMetricsInterval();
  }

  /**
   * Validate production configuration
   */
  private validateConfiguration(): void {
    const required = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_NUMBER'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required WhatsApp configuration: ${missing.join(', ')}`);
    }

    if (process.env.NODE_ENV === 'production' && process.env.WHATSAPP_TEST_MODE === 'true') {
      this.log('warn', '⚠️ WhatsApp test mode is enabled in production environment');
    }

    // Validate phone number format
    if (!this.config.phoneNumber.startsWith('+')) {
      throw new Error('TWILIO_WHATSAPP_NUMBER must be in E.164 format (e.g., +1234567890)');
    }
  }

  /**
   * Enhanced logging with levels
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] >= levels[this.config.logLevel]) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [WhatsApp-${level.toUpperCase()}] ${message}`;

      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Rate limiting with token bucket algorithm
   */
  private async checkRateLimit(): Promise<boolean> {
    const now = new Date();

    // Refill tokens based on time elapsed
    const timeSinceRefill = now.getTime() - this.rateLimiter.lastRefill.getTime();
    const tokensToAdd = Math.floor(timeSinceRefill / 1000) * this.config.rateLimitPerSecond;

    this.rateLimiter.tokens = Math.min(
      this.config.rateLimitPerSecond,
      this.rateLimiter.tokens + tokensToAdd
    );
    this.rateLimiter.lastRefill = now;

    // Check per-minute limit
    if (now.getTime() - this.rateLimiter.windowStart.getTime() > 60000) {
      this.rateLimiter.windowStart = now;
      this.rateLimiter.countInWindow = 0;
    }

    if (this.rateLimiter.countInWindow >= this.config.rateLimitPerMinute) {
      this.log('warn', 'Rate limit exceeded: per-minute limit reached');
      return false;
    }

    if (this.rateLimiter.tokens < 1) {
      this.log('warn', 'Rate limit exceeded: no tokens available');
      return false;
    }

    this.rateLimiter.tokens--;
    this.rateLimiter.countInWindow++;
    return true;
  }

  /**
   * Enhanced phone number validation and formatting
   */
  private validateAndFormatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Remove any non-digit characters
    let cleanPhone = phoneNumber.replace(/\D/g, '');

    // Validate length and format
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      throw new Error(`Invalid phone number length: ${phoneNumber}`);
    }

    // Add country code if not present (assuming India for temple use case)
    if (!cleanPhone.startsWith('91')) {
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      } else {
        throw new Error(`Invalid Indian phone number: ${phoneNumber}. Please include country code or use 10-digit number.`);
      }
    }

    // Ensure it starts with +
    const formattedPhone = '+' + cleanPhone;

    // Additional validation for Indian numbers
    if (cleanPhone.startsWith('91') && cleanPhone.length !== 12) {
      throw new Error(`Invalid Indian phone number: ${phoneNumber}`);
    }

    return formattedPhone;
  }

  /**
   * Send WhatsApp message with production features
   */
  public async sendMessage(messageData: ProductionWhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Validate phone number
      const formattedPhone = this.validateAndFormatPhoneNumber(messageData.phoneNumber);

      // Check rate limiting
      const canSend = await this.checkRateLimit();
      if (!canSend) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }

      // Log message attempt
      this.log('info', `Sending WhatsApp message to ${formattedPhone}`, {
        type: messageData.type,
        messageLength: messageData.message.length,
        hasMedia: !!messageData.mediaUrl,
        priority: messageData.priority
      });

      // Check test mode
      if (process.env.WHATSAPP_TEST_MODE === 'true') {
        this.log('info', '🧪 TEST MODE - Message would be sent:', {
          to: formattedPhone,
          message: messageData.message.substring(0, 100) + '...',
          mediaUrl: messageData.mediaUrl
        });
        this.metrics.sent++;
        return { success: true, messageId: `test_${Date.now()}` };
      }

      // Prepare message payload
      const formData = new URLSearchParams();
      formData.append('To', `whatsapp:${formattedPhone}`);
      formData.append('From', `whatsapp:${this.config.phoneNumber}`);

      if (messageData.templateName && messageData.templateParams) {
        // Send template message
        formData.append('ContentSid', messageData.templateName);
        formData.append('ContentVariables', JSON.stringify(
          messageData.templateParams.reduce((acc, param, index) => {
            acc[index + 1] = param;
            return acc;
          }, {} as Record<string, string>)
        ));
      } else {
        // Send regular message
        formData.append('Body', messageData.message);
      }

      // Add media if provided
      if (messageData.mediaUrl) {
        formData.append('MediaUrl', messageData.mediaUrl);
      }

      // Add delivery callback if enabled
      if (this.config.enableDeliveryReports && messageData.deliveryCallbackUrl) {
        formData.append('StatusCallback', messageData.deliveryCallbackUrl);
      }

      // Send message via Twilio API
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': `${this.templeName} WhatsApp Service/1.0`
          },
          body: formData.toString()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        this.metrics.failed++;
        this.log('error', 'Twilio API error', {
          status: response.status,
          error: data,
          phoneNumber: formattedPhone
        });

        return {
          success: false,
          error: data.message || 'Twilio API error',
          messageId: data.sid
        };
      }

      this.metrics.sent++;
      this.metrics.lastSentTime = new Date();

      this.log('info', '✅ WhatsApp message sent successfully', {
        messageId: data.sid,
        to: formattedPhone,
        status: data.status
      });

      return { success: true, messageId: data.sid };

    } catch (error) {
      this.metrics.failed++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.log('error', 'Error sending WhatsApp message', {
        error: errorMessage,
        phoneNumber: messageData.phoneNumber
      });

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Send donation receipt with certificate link (production version)
   */
  public async sendDonationReceipt(
    details: any,
    pdfUrl?: string,
    certificateUrl?: string
  ): Promise<{ success: boolean; receiptMessageId?: string; certificateMessageId?: string; error?: string }> {
    try {
      const recipient = this.validateAndFormatPhoneNumber(details.donorPhone);

      // Send receipt message
      const receiptMessage = `🙏 *Donation Receipt* 🙏

Dear ${details.donorName},

Thank you for your generous contribution to ${this.templeName}!

🧾 *Receipt Details:*
• Receipt Number: ${details.receiptNumber}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
• Donation Type: ${details.donationType}
• Date: ${new Date(details.date).toLocaleDateString('en-IN')}

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: ${this.adminPhoneNumber}

---
*${this.templeName}*
*Service to Humanity is Service to God*`;

      const receiptResult = await this.sendMessage({
        phoneNumber: recipient,
        message: receiptMessage,
        type: 'donation',
        mediaUrl: pdfUrl,
        priority: 'high',
        metadata: {
          receiptNumber: details.receiptNumber,
          amount: details.amount,
          type: 'receipt'
        }
      });

      if (!receiptResult.success) {
        return { success: false, error: receiptResult.error };
      }

      let certificateMessageId: string | undefined;

      // Send certificate link message if provided
      if (certificateUrl) {
        const certificateMessage = `📄 *Download Your Donation Certificate*\n\nDear ${details.donorName},\n\nThank you once again for your generous donation to ${this.templeName}.\n\nYou can download your official donation certificate using the secure link below:\n${certificateUrl}\n\nIf you have any trouble accessing the certificate, reply to this message and our team will assist you.\n\n🙏 May Sri Raghavendra Swamy bless you and your family!`;

        const certificateResult = await this.sendMessage({
          phoneNumber: recipient,
          message: certificateMessage,
          type: 'donation',
          priority: 'high',
          metadata: {
            receiptNumber: details.receiptNumber,
            amount: details.amount,
            type: 'certificate'
          }
        });

        if (certificateResult.success) {
          certificateMessageId = certificateResult.messageId;
        }
      }

      // Send admin notification
      await this.sendAdminNotification(details);

      return {
        success: true,
        receiptMessageId: receiptResult.messageId,
        certificateMessageId
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('error', 'Error sending donation receipt', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Send admin notification
   */
  private async sendAdminNotification(details: any): Promise<void> {
    const adminMessage = `🙏 *New Donation Received* 🙏

📝 *Donor Details:*
• Name: ${details.donorName}
• Phone: ${details.donorPhone}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
• Type: ${details.donationType}

🧾 *Transaction Details:*
• Receipt Number: ${details.receiptNumber}
• Payment ID: ${details.paymentId}
• Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📍 *Temple:* ${this.templeName}
📅 *Notification Time:* ${new Date().toLocaleString('en-IN')}`;

    await this.sendMessage({
      phoneNumber: this.adminPhoneNumber,
      message: adminMessage,
      type: 'donation',
      priority: 'normal'
    });
  }

  /**
   * Get current metrics
   */
  public getMetrics(): MessageMetrics {
    return { ...this.metrics };
  }

  /**
   * Test connection and configuration
   */
  public async testConnection(): Promise<{ success: boolean; details: any }> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}.json`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')}`
          }
        }
      );

      const accountData = await response.json();

      return {
        success: response.ok,
        details: {
          accountStatus: accountData.status,
          friendlyName: accountData.friendly_name,
          type: accountData.type,
          whatsappNumber: this.config.phoneNumber,
          rateLimits: {
            perSecond: this.config.rateLimitPerSecond,
            perMinute: this.config.rateLimitPerMinute
          },
          testMode: process.env.WHATSAPP_TEST_MODE === 'true',
          metrics: this.metrics
        }
      };

    } catch (error) {
      return {
        success: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Start metrics collection interval
   */
  private startMetricsInterval(): void {
    setInterval(() => {
      if (this.metrics.sent > 0) {
        this.log('info', 'WhatsApp metrics summary', {
          sent: this.metrics.sent,
          delivered: this.metrics.delivered,
          failed: this.metrics.failed,
          deliveryRate: ((this.metrics.delivered / this.metrics.sent) * 100).toFixed(2) + '%'
        });
      }
    }, 60000); // Log metrics every minute
  }

  /**
   * Queue high-priority messages
   */
  public queueMessage(messageData: ProductionWhatsAppMessage): void {
    this.messageQueue.push(messageData);
    this.processMessageQueue();
  }

  /**
   * Process message queue
   */
  private async processMessageQueue(): Promise<void> {
    if (this.isProcessingQueue || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      await this.sendMessage(message);
      // Small delay between queued messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessingQueue = false;
  }
}

// Export singleton instance
export const productionWhatsAppService = new ProductionWhatsAppService();
export default productionWhatsAppService;
