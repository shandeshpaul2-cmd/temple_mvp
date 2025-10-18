'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PaymentPortal from '@/features/payments/components/payment/PaymentPortal'

function PaymentContent() {
  const searchParams = useSearchParams()

  const serviceId = searchParams.get('service')
  const serviceName = searchParams.get('serviceName') || 'Parihara Pooja'
  const amount = parseInt(searchParams.get('amount') || '0')

  const handleBack = () => {
    // Navigate back to parihara pooja selection
    window.location.href = '/parihara-pooja'
  }

  const handleSuccess = (receiptNumber: string, paymentId: string) => {
    // Redirect to confirmation page with booking details
    window.location.href = `/parihara-pooja/confirmation?service=${serviceId}&serviceName=${encodeURIComponent(serviceName)}&amount=${amount}&receipt=${receiptNumber}&paymentId=${paymentId}`
  }

  const handleError = (error: string) => {
    console.error('Payment error:', error)
    // Stay on payment page with error message
  }

  // Prepare payment items for PaymentPortal
  const paymentItems = [
    {
      id: serviceId || '1',
      name: serviceName,
      description: 'Parihara Pooja Booking',
      amount: amount,
      type: 'pooja' as const,
      metadata: {
        serviceType: 'parihara_pooja',
        bookingDate: new Date().toISOString()
      }
    }
  ]

  // Mock user info (in real implementation, this would come from user data)
  const userInfo = {
    fullName: 'Devotee', // This should come from user session/form
    phoneNumber: '9876543210' // This should come from user session/form
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

export default function PaymentPage() {
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