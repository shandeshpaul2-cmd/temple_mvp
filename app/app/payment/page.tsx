'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PaymentPortal from '@/features/payments/components/payment/PaymentPortal'

function PaymentContent() {
  const searchParams = useSearchParams()

  // Extract payment parameters
  const paymentType = searchParams.get('type') || 'donation' // donation, pooja, parihara_pooja
  const amount = parseInt(searchParams.get('amount') || '0')
  const serviceName = searchParams.get('serviceName') || ''
  const serviceId = searchParams.get('serviceId') || ''
  const name = searchParams.get('name') || ''
  const phone = searchParams.get('phone') || ''

  // Additional service details
  const preferredDate = searchParams.get('preferredDate') || ''
  const preferredTime = searchParams.get('preferredTime') || ''
  const nakshatra = searchParams.get('nakshatra') || ''
  const gotra = searchParams.get('gotra') || ''

  const handleBack = () => {
    // Navigate back based on payment type
    switch (paymentType) {
      case 'parihara_pooja':
        window.location.href = '/parihara-pooja'
        break
      case 'pooja':
        window.location.href = '/book-pooja'
        break
      case 'donation':
      default:
        window.location.href = '/donate'
        break
    }
  }

  const handleSuccess = (receiptNumber: string, paymentId: string) => {
    // Redirect to appropriate success page
    let redirectUrl = '/'

    switch (paymentType) {
      case 'parihara_pooja':
        redirectUrl = `/parihara-pooja/confirmation?service=${serviceId}&serviceName=${encodeURIComponent(serviceName)}&amount=${amount}&receipt=${receiptNumber}&paymentId=${paymentId}`
        break
      case 'pooja':
        redirectUrl = `/book-pooja/confirmation/${receiptNumber}`
        break
      case 'donation':
      default:
        redirectUrl = `/donate/success?receipt=${receiptNumber}&paymentId=${paymentId}`
        break
    }

    window.location.href = redirectUrl
  }

  const handleError = (error: string) => {
    console.error('Payment error:', error)
    // Stay on payment page with error message
  }

  // Prepare payment items based on payment type
  const paymentItems = [
    {
      id: serviceId || '1',
      name: serviceName || (paymentType === 'donation' ? 'General Donation' : 'Service'),
      description: getServiceDescription(paymentType, serviceName),
      amount: amount,
      type: paymentType === 'donation' ? 'donation' as const : 'pooja' as const,
      metadata: {
        paymentType,
        serviceType: paymentType,
        preferredDate,
        preferredTime,
        nakshatra,
        gotra,
        bookingDate: new Date().toISOString()
      }
    }
  ]

  // Prepare user info
  const userInfo = {
    fullName: name || 'Devotee',
    phoneNumber: phone || '9876543210'
  }

  return (
    <div className="min-h-screen">
      <PaymentPortal
        items={paymentItems}
        userInfo={userInfo}
        onBack={handleBack}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

function getServiceDescription(paymentType: string, serviceName: string): string {
  switch (paymentType) {
    case 'parihara_pooja':
      return 'Parihara Pooja Booking - Sacred remedies to overcome planetary doshas'
    case 'pooja':
      return `Pooja Service: ${serviceName}`
    case 'donation':
    default:
      return `Donation to ${serviceName || 'Shri Raghavendra Swamy Brundavana Sannidhi'}`
  }
}

export default function UnifiedPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temple-cream via-white to-red-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment portal...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}