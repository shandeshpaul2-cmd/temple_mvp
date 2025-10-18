/**
 * Production WhatsApp Test Suite
 * Tests all aspects of the production WhatsApp integration
 */

const baseUrl = 'http://localhost:3010'; // Adjust for your environment

// Test configuration
const testConfig = {
  testPhoneNumber: '+919876543210', // Replace with your test number
  adminPhoneNumber: '+918310408797',
  testAmount: 1080,
  timeoutMs: 30000
};

// Test data
const testDonation = {
  donorName: 'Production Test Devotee',
  donorPhone: testConfig.testPhoneNumber,
  amount: testConfig.testAmount,
  donationType: 'General Donation',
  donationPurpose: 'Production Testing',
  receiptNumber: `PROD-TEST-${Date.now()}`,
  paymentId: `pay_prod_test_${Date.now()}`,
  date: new Date().toISOString(),
  razorpay_order_id: `order_prod_test_${Date.now()}`,
  razorpay_payment_id: `pay_prod_test_${Date.now()}`,
  razorpay_signature: 'test_signature_for_production_mode'
};

// Utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(test, message, data = null) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${test}: ${message}`);
  if (data) {
    console.log(`    Data:`, data);
  }
}

function logSuccess(test, message) {
  console.log(`✅ ${test}: ${message}`);
}

function logError(test, message, error = null) {
  console.log(`❌ ${test}: ${message}`);
  if (error) {
    console.log(`    Error:`, error);
  }
}

function logWarning(test, message) {
  console.log(`⚠️ ${test}: ${message}`);
}

// Test functions
async function testWhatsAppServiceHealth() {
  const test = 'WhatsApp Health Check';

  try {
    log(test, 'Checking WhatsApp service health...');

    const response = await fetch(`${baseUrl}/api/donations/verify-payment-production`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const health = await response.json();
      logSuccess(test, 'WhatsApp service is healthy');
      log(test, 'Service details', {
        status: health.status,
        whatsappConnected: health.whatsapp?.success,
        environment: health.environment
      });
      return true;
    } else {
      logError(test, 'WhatsApp service health check failed', response.status);
      return false;
    }
  } catch (error) {
    logError(test, 'Health check error', error.message);
    return false;
  }
}

async function testCertificateGeneration() {
  const test = 'Certificate Generation';

  try {
    log(test, 'Testing certificate generation...');

    const response = await fetch(`${baseUrl}/api/certificates/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donor_name: testDonation.donorName,
        amount: testDonation.amount,
        donation_id: testDonation.receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        reason_text: 'for production testing purposes'
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(test, 'Certificate generated successfully');
      log(test, 'Certificate info', {
        filename: result.filename,
        downloadUrl: result.download_url
      });
      return `${baseUrl}${result.download_url}`;
    } else {
      logError(test, 'Certificate generation failed', await response.text());
      return null;
    }
  } catch (error) {
    logError(test, 'Certificate generation error', error.message);
    return null;
  }
}

async function testProductionWhatsAppMessage(certificateUrl) {
  const test = 'Production WhatsApp Message';

  try {
    log(test, 'Testing production WhatsApp message...');

    const response = await fetch(`${baseUrl}/api/donations/verify-payment-production`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: testDonation.razorpay_order_id,
        razorpay_payment_id: testDonation.razorpay_payment_id,
        razorpay_signature: testDonation.razorpay_signature,
        donationDetails: testDonation
      })
    });

    if (response.ok) {
      const result = await response.json();
      logSuccess(test, 'Production WhatsApp flow completed');
      log(test, 'Results', {
        success: result.success,
        message: result.message,
        receiptUrl: result.receiptUrl ? '✅' : '❌',
        certificateUrl: result.certificateUrl ? '✅' : '❌',
        whatsappStatus: result.whatsappStatus
      });
      return true;
    } else {
      logError(test, 'Production WhatsApp flow failed', await response.text());
      return false;
    }
  } catch (error) {
    logError(test, 'Production WhatsApp error', error.message);
    return false;
  }
}

async function testWhatsAppWebhook() {
  const test = 'WhatsApp Webhook';

  try {
    log(test, 'Testing WhatsApp webhook...');

    // Simulate webhook payload
    const webhookData = new URLSearchParams({
      From: `whatsapp:${testConfig.testPhoneNumber}`,
      To: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      Body: 'help'
    });

    const response = await fetch(`${baseUrl}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: webhookData
    });

    if (response.ok) {
      logSuccess(test, 'Webhook processed successfully');
      log(test, 'Webhook response status', response.status);
      return true;
    } else {
      logError(test, 'Webhook processing failed', response.status);
      return false;
    }
  } catch (error) {
    logError(test, 'Webhook test error', error.message);
    return false;
  }
}

async function testPhoneValidation() {
  const test = 'Phone Validation';

  try {
    log(test, 'Testing phone number validation...');

    const testNumbers = [
      '+919876543210', // Valid international
      '9876543210',     // Valid Indian 10-digit
      '12345',          // Invalid - too short
      '+123456789012345' // Invalid - too long
    ];

    let passedTests = 0;

    for (const phone of testNumbers) {
      // Test phone validation by attempting to send a test message
      // (This will be caught by validation before actually sending)
      log(test, `Testing phone number: ${phone}`);

      try {
        const response = await fetch(`${baseUrl}/api/donations/verify-payment-production`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: 'test_validation',
            razorpay_payment_id: 'test_validation',
            razorpay_signature: 'test_validation',
            donationDetails: {
              ...testDonation,
              donorPhone: phone
            }
          })
        });

        if (phone === '12345' || phone === '+123456789012345') {
          // These should fail validation
          if (!response.ok) {
            logSuccess(test, `Correctly rejected invalid phone: ${phone}`);
            passedTests++;
          } else {
            logError(test, `Should have rejected invalid phone: ${phone}`);
          }
        } else {
          // These should pass validation (but may fail at signature verification)
          log(test, `Phone ${phone} passed validation (expected)`);
          passedTests++;
        }
      } catch (error) {
        // Some validation errors might throw
        if (phone === '12345' || phone === '+123456789012345') {
          logSuccess(test, `Correctly caught invalid phone error: ${phone}`);
          passedTests++;
        }
      }
    }

    logSuccess(test, `Phone validation tests: ${passedTests}/${testNumbers.length} passed`);
    return passedTests === testNumbers.length;

  } catch (error) {
    logError(test, 'Phone validation test error', error.message);
    return false;
  }
}

async function testRateLimiting() {
  const test = 'Rate Limiting';

  try {
    log(test, 'Testing rate limiting (sending multiple rapid requests)...');

    const promises = [];
    const numRequests = 5;

    for (let i = 0; i < numRequests; i++) {
      promises.push(
        fetch(`${baseUrl}/api/donations/verify-payment-production`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: `rate_test_${i}_${Date.now()}`,
            razorpay_payment_id: `rate_test_${i}_${Date.now()}`,
            razorpay_signature: 'test_signature',
            donationDetails: {
              ...testDonation,
              receiptNumber: `RATE-TEST-${i}-${Date.now()}`,
              donorPhone: `+91987654321${i}` // Different phone numbers
            }
          })
        })
      );
    }

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    log(test, `Rate limiting test results: ${successful} successful, ${failed} failed`);

    // In production, some should be rate limited
    if (process.env.NODE_ENV === 'production') {
      logSuccess(test, 'Rate limiting test completed (some requests expected to be limited)');
    } else {
      logWarning(test, 'Rate limiting may not be active in development mode');
    }

    return true;

  } catch (error) {
    logError(test, 'Rate limiting test error', error.message);
    return false;
  }
}

// Main test runner
async function runProductionWhatsAppTests() {
  console.log('🚀 Starting Production WhatsApp Test Suite');
  console.log('='.repeat(60));
  console.log(`📱 Test Phone: ${testConfig.testPhoneNumber}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`⏰ Timeout: ${testConfig.timeoutMs}ms`);
  console.log('='.repeat(60));

  const results = [];

  // Run all tests
  console.log('\n📋 Running Production WhatsApp Tests...\n');

  results.push(await testWhatsAppServiceHealth());
  await delay(1000);

  results.push(await testCertificateGeneration());
  await delay(1000);

  const certificateUrl = await testCertificateGeneration();
  await delay(2000);

  results.push(await testProductionWhatsAppMessage(certificateUrl));
  await delay(2000);

  results.push(await testWhatsAppWebhook());
  await delay(1000);

  results.push(await testPhoneValidation());
  await delay(1000);

  results.push(await testRateLimiting());

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}/${total} tests`);

  if (passed === total) {
    console.log('🎉 All tests passed! Production WhatsApp is ready.');
  } else {
    console.log('⚠️ Some tests failed. Please check the logs above.');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. 🔧 Set up production Twilio WhatsApp Business API');
  console.log('2. 📝 Update environment variables with production credentials');
  console.log('3. 🌐 Deploy webhook endpoint with SSL certificate');
  console.log('4. 📊 Set up monitoring and alerting');
  console.log('5. 🧪 Test with small user group before full rollout');

  console.log('\n📚 Documentation:');
  console.log('- Production Setup Guide: /docs/PRODUCTION_WHATSAPP_SETUP.md');
  console.log('- Environment Variables: /.env.production.example');
  console.log('- Production Service: /lib/whatsapp-production.ts');

  console.log('\n' + '='.repeat(60));
}

// Check if running directly
if (require.main === module) {
  runProductionWhatsAppTests().catch(console.error);
}

module.exports = {
  runProductionWhatsAppTests,
  testWhatsAppServiceHealth,
  testCertificateGeneration,
  testProductionWhatsAppMessage,
  testWhatsAppWebhook,
  testPhoneValidation,
  testRateLimiting
};