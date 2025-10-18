/**
 * Production API route for verifying Razorpay payments with enhanced WhatsApp features
 * Uses production WhatsApp service with certificate attachments, delivery tracking, and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { RazorpayService } from '@/lib/razorpay-service'
import { productionWhatsAppService } from '@/lib/whatsapp-production'
import { certificateService } from '@/lib/certificate-service'

const razorpayService = new RazorpayService()

interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  donationDetails: any;
}

interface VerificationResponse {
  success: boolean;
  message: string;
  payment_id?: string;
  receiptUrl?: string;
  certificateUrl?: string;
  whatsappStatus?: {
    receiptSent: boolean;
    certificateSent: boolean;
    adminNotified: boolean;
    receiptMessageId?: string;
    certificateMessageId?: string;
  };
  metrics?: any;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerificationResponse>> {
  const startTime = Date.now();

  try {
    const body: PaymentVerificationRequest = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationDetails } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required payment verification parameters'
        },
        { status: 400 }
      )
    }

    if (!donationDetails || !donationDetails.donorPhone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid donation details provided'
        },
        { status: 400 }
      )
    }

    console.log(`🔍 Processing payment verification for ${razorpay_payment_id}`, {
      donorName: donationDetails.donorName,
      amount: donationDetails.amount,
      phone: donationDetails.donorPhone?.replace(/(\d{2})\d{8}(\d{2})/, '$1********$2') // Mask phone number in logs
    });

    // Verify payment signature
    const isValid = razorpayService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      console.error(`❌ Invalid payment signature for ${razorpay_payment_id}`);

      // Notify admin about potential fraud attempt
      await notifyAdminAboutFailedVerification(donationDetails, 'Invalid signature');

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payment signature'
        },
        { status: 400 }
      )
    }

    console.log(`✅ Payment signature verified for ${razorpay_payment_id}`);

    // Process successful payment
    const result = await processSuccessfulPayment(
      razorpay_payment_id,
      donationDetails,
      startTime
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Payment verification error:', error);

    const processingTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: false,
        message: 'Payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime
      },
      { status: 500 }
    )
  }
}

/**
 * Process successful payment with all notifications
 */
async function processSuccessfulPayment(
  paymentId: string,
  donationDetails: any,
  startTime: number
): Promise<VerificationResponse> {
  let receiptUrl: string | undefined;
  let certificateUrl: string | undefined;
  let whatsappStatus: any = {
    receiptSent: false,
    certificateSent: false,
    adminNotified: false
  };

  try {
    // Step 1: Generate receipt URL
    receiptUrl = await generateReceiptUrl(donationDetails, paymentId);

    // Step 2: Generate certificate PDF
    certificateUrl = await generateCertificateUrl(donationDetails);

    // Step 3: Send WhatsApp notifications
    whatsappStatus = await sendWhatsAppNotifications(
      donationDetails,
      receiptUrl,
      certificateUrl
    );

    // Step 4: Log success metrics
    const processingTime = Date.now() - startTime;
    const metrics = productionWhatsAppService.getMetrics();

    console.log(`🎉 Payment processing completed for ${paymentId}`, {
      processingTime,
      whatsappStatus,
      hasReceipt: !!receiptUrl,
      hasCertificate: !!certificateUrl,
      totalMessagesSent: metrics.sent
    });

    return {
      success: true,
      message: 'Payment verified and notifications sent successfully',
      payment_id: paymentId,
      receiptUrl,
      certificateUrl,
      whatsappStatus,
      metrics: {
        processingTime,
        whatsappMetrics: metrics
      }
    };

  } catch (error) {
    console.error('❌ Error processing successful payment:', error);

    // Attempt to notify admin about processing failure
    await notifyAdminAboutProcessingError(donationDetails, paymentId, error);

    return {
      success: false,
      message: 'Payment verified but notification processing failed',
      payment_id: paymentId,
      error: error instanceof Error ? error.message : 'Unknown error',
      whatsappStatus,
      receiptUrl,
      certificateUrl
    };
  }
}

/**
 * Generate receipt URL
 */
async function generateReceiptUrl(donationDetails: any, paymentId: string): Promise<string | undefined> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const receiptResponse = await fetch(`${baseUrl}/api/receipts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...donationDetails,
        paymentId
      })
    });

    if (receiptResponse.ok) {
      const receiptData = await receiptResponse.json();
      console.log(`📄 Receipt generated: ${receiptData.receiptUrl}`);
      return receiptData.receiptUrl;
    } else {
      console.error('❌ Failed to generate receipt:', await receiptResponse.text());
    }
  } catch (error) {
    console.error('❌ Receipt generation error:', error);
  }

  return undefined;
}

/**
 * Generate certificate URL
 */
async function generateCertificateUrl(donationDetails: any): Promise<string | undefined> {
  try {
    const certificateData = certificateService.formatDonationData(donationDetails);
    const certificateResult = await certificateService.generateCertificate(certificateData);

    if (certificateResult.success && certificateResult.download_url) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const fullUrl = `${baseUrl}${certificateResult.download_url}`;
      console.log(`📜 Certificate generated: ${fullUrl}`);
      return fullUrl;
    } else {
      console.error('❌ Certificate generation failed:', certificateResult.error);
    }
  } catch (error) {
    console.error('❌ Certificate generation error:', error);
  }

  return undefined;
}

/**
 * Send WhatsApp notifications with production service
 */
async function sendWhatsAppNotifications(
  donationDetails: any,
  receiptUrl?: string,
  certificateUrl?: string
): Promise<any> {
  try {
    console.log(`📱 Sending WhatsApp notifications to ${donationDetails.donorPhone}`);

    // Use production WhatsApp service
    const result = await productionWhatsAppService.sendDonationReceipt(
      donationDetails,
      receiptUrl,
      certificateUrl
    );

    if (result.success) {
      console.log(`✅ WhatsApp notifications sent successfully`, {
        receiptMessageId: result.receiptMessageId,
        certificateMessageId: result.certificateMessageId
      });
    } else {
      console.error(`❌ WhatsApp notifications failed: ${result.error}`);
    }

    return {
      receiptSent: !!result.receiptMessageId,
      certificateSent: !!result.certificateMessageId,
      adminNotified: true, // Service handles admin notification internally
      receiptMessageId: result.receiptMessageId,
      certificateMessageId: result.certificateMessageId
    };

  } catch (error) {
    console.error('❌ WhatsApp notification error:', error);

    return {
      receiptSent: false,
      certificateSent: false,
      adminNotified: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Notify admin about failed payment verification
 */
async function notifyAdminAboutFailedVerification(
  donationDetails: any,
  reason: string
): Promise<void> {
  try {
    const adminMessage = `🚨 *Payment Verification Failed*

❌ *Failed Verification Details:*
• Donor: ${donationDetails.donorName}
• Phone: ${donationDetails.donorPhone}
• Amount: ₹${donationDetails.amount?.toLocaleString('en-IN')}
• Receipt: ${donationDetails.receiptNumber}
• Reason: ${reason}
• Time: ${new Date().toLocaleString('en-IN')}

🔍 Please review this transaction immediately.

📊 Current WhatsApp Metrics: ${JSON.stringify(productionWhatsAppService.getMetrics())}`;

    await productionWhatsAppService.sendMessage({
      phoneNumber: process.env.ADMIN_PHONE_NUMBER || '+918310408797',
      message: adminMessage,
      type: 'template',
      priority: 'high'
    });

  } catch (error) {
    console.error('Failed to notify admin about verification failure:', error);
  }
}

/**
 * Notify admin about processing errors
 */
async function notifyAdminAboutProcessingError(
  donationDetails: any,
  paymentId: string,
  error: any
): Promise<void> {
  try {
    const adminMessage = `⚠️ *Payment Processing Error*

✅ *Payment was verified but processing failed:*
• Payment ID: ${paymentId}
• Donor: ${donationDetails.donorName}
• Phone: ${donationDetails.donorPhone}
• Amount: ₹${donationDetails.amount?.toLocaleString('en-IN')}
• Error: ${error instanceof Error ? error.message : 'Unknown error'}
• Time: ${new Date().toLocaleString('en-IN')}

🔧 Please check logs and manually send receipts if needed.`;

    await productionWhatsAppService.sendMessage({
      phoneNumber: process.env.ADMIN_PHONE_NUMBER || '+918310408797',
      message: adminMessage,
      type: 'template',
      priority: 'high'
    });

  } catch (whatsappError) {
    console.error('Failed to notify admin about processing error:', whatsappError);
  }
}

/**
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  try {
    const healthCheck = await productionWhatsAppService.testConnection();

    return NextResponse.json({
      status: 'healthy',
      service: 'payment-verification-production',
      timestamp: new Date().toISOString(),
      whatsapp: healthCheck,
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'payment-verification-production',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}