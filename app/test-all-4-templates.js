/**
 * Test script to send all 4 WhatsApp message templates
 */

const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Dynamic import for ES modules
async function testAllTemplates() {
  const { whatsappService } = await import('./lib/whatsapp.ts');

  console.log('🚀 Testing All 4 WhatsApp Message Templates...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Donation Receipt
  console.log('📄 Test 1: Sending Donation Receipt...');
  const donationDetails = {
    donorName: 'Test Donor',
    donorPhone: '7760118171',
    amount: 5000,
    donationType: 'General Donation',
    donationPurpose: 'Temple Maintenance',
    receiptNumber: 'DON-TEST-001',
    paymentId: 'pay_test123456',
    date: new Date().toISOString()
  };

  try {
    await whatsappService.sendDonationReceiptToDonor(
      donationDetails,
      'https://example.com/certificates/donation-certificate.pdf',
      false
    );
    console.log('✅ Donation receipt sent successfully\n');
  } catch (error) {
    console.error('❌ Error sending donation receipt:', error.message, '\n');
  }

  // Wait 2 seconds between messages
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Pooja Booking Confirmation
  console.log('🙏 Test 2: Sending Pooja Booking Confirmation...');
  const poojaDetails = {
    devoteeName: 'Test Devotee',
    devoteePhone: '7760118171',
    poojaName: 'Satyanarayana Pooja',
    amount: 3000,
    receiptNumber: 'POOJA-TEST-001',
    paymentId: 'pay_test789012',
    preferredDate: '2025-10-25',
    preferredTime: '10:00 AM',
    nakshatra: 'Rohini',
    gotra: 'Kashyapa',
    date: new Date().toISOString()
  };

  try {
    await whatsappService.sendPoojaBookingConfirmationToDevotee(poojaDetails, false);
    console.log('✅ Pooja booking confirmation sent successfully\n');
  } catch (error) {
    console.error('❌ Error sending pooja booking:', error.message, '\n');
  }

  // Wait 2 seconds between messages
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Astrology Consultation
  console.log('🔮 Test 3: Sending Astrology Consultation Confirmation...');
  const astrologyDetails = {
    clientName: 'Test Client',
    clientPhone: '7760118171',
    consultationType: 'Complete Horoscope Reading',
    amount: 0,
    receiptNumber: 'ASTRO-TEST-001',
    paymentId: 'pay_test345678',
    preferredDate: '2025-10-26',
    preferredTime: '2:00 PM',
    birthDetails: {
      dateOfBirth: '1990-01-15',
      timeOfBirth: '08:30 AM',
      placeOfBirth: 'Bangalore',
      starSign: 'Capricorn'
    },
    concerns: ['Career', 'Marriage'],
    date: new Date().toISOString()
  };

  try {
    await whatsappService.sendAstrologyConsultationConfirmation(astrologyDetails, false);
    console.log('✅ Astrology consultation confirmation sent successfully\n');
  } catch (error) {
    console.error('❌ Error sending astrology consultation:', error.message, '\n');
  }

  // Wait 2 seconds between messages
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Parihara Pooja
  console.log('🔮 Test 4: Sending Parihara Pooja Confirmation...');
  const pariharaDetails = {
    devoteeName: 'Test Devotee',
    devoteePhone: '7760118171',
    poojaName: 'Navagraha Parihara Pooja',
    amount: 5000,
    receiptNumber: 'PARIHARA-TEST-001',
    paymentId: 'pay_test901234',
    date: new Date().toISOString()
  };

  try {
    await whatsappService.sendPariharaPoojaConfirmationToDevotee(pariharaDetails);
    console.log('✅ Parihara pooja confirmation sent successfully\n');
  } catch (error) {
    console.error('❌ Error sending parihara pooja:', error.message, '\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ All 4 message templates have been sent!');
  console.log('📱 Check your WhatsApp at: 7760118171');
}

// Run the test
testAllTemplates().catch(console.error);
