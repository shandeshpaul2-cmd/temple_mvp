#!/usr/bin/env node

/**
 * WhatsApp Message Test Script
 * Run this to see how the WhatsApp messages would look without setting up API
 */

// Import the test service
const { whatsappTestService } = require('./lib/whatsapp-test.ts')

async function runTests() {
  console.log('🧪 Starting WhatsApp Message Tests...')
  console.log('=' .repeat(60))

  try {
    // Test 1: Donation Receipt
    console.log('\n📧 TEST 1: Donation Receipt Message')
    console.log('-'.repeat(40))
    await whatsappTestService.testDonationReceipt({
      donorName: 'Test Devotee',
      donorPhone: '+919876543210',
      amount: 1100,
      donationType: 'General Donation',
      donationPurpose: 'Temple Maintenance',
      receiptNumber: 'DN-161024-0001',
      paymentId: 'pay_test_123',
      date: new Date().toISOString()
    })

    // Test 2: Pooja Booking Confirmation
    console.log('\n📧 TEST 2: Pooja Booking Confirmation')
    console.log('-'.repeat(40))
    await whatsappTestService.testPoojaBookingConfirmation({
      devoteeName: 'Test Devotee',
      devoteePhone: '+919876543210',
      poojaName: 'Nithya Pooja',
      amount: 500,
      receiptNumber: 'PB-161024-0001',
      paymentId: 'pay_test_456',
      preferredDate: '2024-10-20',
      preferredTime: '9:00 AM',
      date: new Date().toISOString()
    })

    // Test 3: Admin Notification for Donation
    console.log('\n📧 TEST 3: Admin Notification (Donation)')
    console.log('-'.repeat(40))
    await whatsappTestService.testAdminNotification({
      donorName: 'Test Devotee',
      donorPhone: '+919876543210',
      amount: 1100,
      donationType: 'General Donation',
      donationPurpose: 'Temple Maintenance',
      receiptNumber: 'DN-161024-0001',
      paymentId: 'pay_test_123',
      date: new Date().toISOString()
    }, 'donation')

    // Test 4: Admin Notification for Pooja
    console.log('\n📧 TEST 4: Admin Notification (Pooja)')
    console.log('-'.repeat(40))
    await whatsappTestService.testAdminNotification({
      devoteeName: 'Test Devotee',
      devoteePhone: '+919876543210',
      poojaName: 'Nithya Pooja',
      amount: 500,
      receiptNumber: 'PB-161024-0001',
      paymentId: 'pay_test_456',
      date: new Date().toISOString()
    }, 'pooja')

    console.log('\n✅ All tests completed!')
    console.log('=' .repeat(60))
    console.log('💡 This is TEST MODE - no actual WhatsApp messages were sent')
    console.log('💰 To use real WhatsApp: Follow the setup guide in docs/WHATSAPP_SETUP.md')
    console.log('🆓 Free tier available: 1000 messages/month with Meta WhatsApp Business API')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the tests
runTests()