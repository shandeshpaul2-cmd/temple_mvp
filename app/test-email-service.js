// Test script for email service
const { EmailService } = require('./lib/email-service')

async function testEmailService() {
  console.log('Testing Email Service...')

  // Test donation receipt
  console.log('\n1. Testing donation receipt...')
  const donationResult = await EmailService.sendDonationReceipt(
    'test@example.com',
    'Test Devotee',
    1000,
    'TEST-1234',
    'General Donation',
    'Test Gotra',
    'https://example.com/certificate.pdf'
  )
  console.log('Donation email result:', donationResult)

  // Test pooja booking confirmation
  console.log('\n2. Testing pooja booking confirmation...')
  const poojaResult = await EmailService.sendPoojaBookingConfirmation(
    'test@example.com',
    'Test Devotee',
    'Nithya Pooja',
    'PB-1234',
    new Date().toISOString(),
    500
  )
  console.log('Pooja booking email result:', poojaResult)

  // Test astrology consultation confirmation
  console.log('\n3. Testing astrology consultation confirmation...')
  const astrologyResult = await EmailService.sendAstrologyConsultationConfirmation(
    'test@example.com',
    'Test Client',
    'General Astrology Consultation',
    'AC-1234',
    new Date().toISOString(),
    1500
  )
  console.log('Astrology consultation email result:', astrologyResult)

  // Test admin notifications
  console.log('\n4. Testing admin notifications...')

  const adminDonationResult = await EmailService.sendDonationNotificationToAdmin(
    'Test Devotee',
    1000,
    'TEST-1234',
    'General Donation',
    'devotee@example.com',
    '9876543210',
    'Test Gotra'
  )
  console.log('Admin donation notification result:', adminDonationResult)

  const adminPoojaResult = await EmailService.sendPoojaBookingNotificationToAdmin(
    'Test Devotee',
    'Nithya Pooja',
    'PB-1234',
    new Date().toISOString(),
    'devotee@example.com',
    '9876543210'
  )
  console.log('Admin pooja notification result:', adminPoojaResult)

  const adminAstrologyResult = await EmailService.sendAstrologyConsultationNotificationToAdmin(
    'Test Client',
    'General Astrology Consultation',
    'AC-1234',
    new Date().toISOString(),
    'client@example.com',
    '9876543210',
    {
      dateOfBirth: '1990-01-01',
      timeOfBirth: '10:30 AM',
      placeOfBirth: 'Bangalore, India'
    }
  )
  console.log('Admin astrology notification result:', adminAstrologyResult)

  console.log('\n✅ Email service testing completed!')
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailService().catch(console.error)
}

module.exports = { testEmailService }