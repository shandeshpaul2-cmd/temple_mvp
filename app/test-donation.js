const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestDonation() {
  try {
    // Create test donation
    const donation = await prisma.donation.create({
      data: {
        receiptNumber: 'TEMP/FY/2025-26/TEST_DONATION',
        amount: 1001,
        donationType: 'General Donation',
        donationPurpose: 'Full cycle test donation',
        paymentStatus: 'PENDING',
        paymentMethod: 'mock',
        razorpayOrderId: 'order_test_donation_' + Date.now(),
      }
    })

    console.log('✅ Test donation created:', {
      id: donation.id,
      receiptNumber: donation.receiptNumber,
      amount: donation.amount,
      razorpayOrderId: donation.razorpayOrderId,
      paymentStatus: donation.paymentStatus
    })

    return donation
  } catch (error) {
    console.error('❌ Error creating test donation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestDonation()