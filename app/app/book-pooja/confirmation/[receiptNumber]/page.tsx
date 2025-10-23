'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Share2, Calendar, User, Phone, CheckCircle, Home } from 'lucide-react'
import { LanguageSelector } from '@/shared/components/common/LanguageSelector'

export default function PoojaConfirmationPage() {
  const params = useParams()
  const receiptNumber = params.receiptNumber as string
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        console.log('🔍 Fetching booking details for receipt:', receiptNumber)

        const response = await fetch(`/api/bookings/${receiptNumber}`)

        if (!response.ok) {
          console.error('❌ Failed to fetch booking details:', response.status)
          setBookingDetails(null)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        console.log('📋 Received booking data:', data)

        if (data) {
          const bookingDetails = {
            receiptNumber: data.receiptNumber,
            poojaName: data.poojaName,
            devoteeName: data.userName,
            devoteePhone: data.userPhone,
            amount: data.poojaPrice,
            bookingDate: data.createdAt,
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            nakshatra: data.nakshatra || 'Not specified',
            gotra: data.gothra || 'Not specified',
            status: data.bookingStatus || 'confirmed',
            paymentId: data.paymentId || 'direct-' + Date.now(),
            paymentDate: data.createdAt
          }

          console.log('✅ Processed booking details:', bookingDetails)
          setBookingDetails(bookingDetails)
        } else {
          console.log('❌ No booking data received')
          setBookingDetails(null)
        }
      } catch (error) {
        console.error('❌ Error fetching booking details:', error)
        setBookingDetails(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetails()
  }, [receiptNumber])

  
  const handleShareWhatsApp = () => {
    const message = `🙏 Pooja Booking Confirmation\n\nTemple: Shri Raghavendra Swamy Brundavana Sannidhi\nPooja: ${bookingDetails?.poojaName}\nDate: ${bookingDetails?.preferredDate}\nTime: ${bookingDetails?.preferredTime}\nReceipt: ${bookingDetails?.receiptNumber}\nAmount: ₹${bookingDetails?.amount}\n\nThank you for your booking!`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">Could not find booking details for receipt: {receiptNumber}</p>
          <Link href="/book-pooja" className="text-blue-600 hover:text-blue-800 underline">
            Back to Pooja Booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/book-pooja"
              className="flex items-center gap-2 text-green-700 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Pooja Booking</span>
            </Link>
            <LanguageSelector />
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Pooja Booking Confirmed!</h1>
            <p className="text-gray-600">Thank you for your devotion. Your booking has been confirmed.</p>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">🙏 Pooja Booking Receipt</h2>
              <p className="text-green-100">Shri Raghavendra Swamy Brundavana Sannidhi</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Booking Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receipt Number:</span>
                      <span className="font-mono font-semibold">{bookingDetails.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pooja Name:</span>
                      <span className="font-medium">{bookingDetails.poojaName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Date:</span>
                      <span className="font-medium">{bookingDetails.preferredDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Time:</span>
                      <span className="font-medium">{bookingDetails.preferredTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        {bookingDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Devotee Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{bookingDetails.devoteeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{bookingDetails.devoteePhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nakshatra:</span>
                      <span className="font-medium">{bookingDetails.nakshatra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gotra:</span>
                      <span className="font-medium">{bookingDetails.gotra}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Payment Details</h3>
                  <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-amber-700">₹{bookingDetails.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono text-xs">{bookingDetails.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="text-sm">{new Date(bookingDetails.paymentDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Share Confirmation</h3>
              <div className="flex justify-center">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share on WhatsApp
                </button>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">📝 Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive at the temple 15 minutes before the scheduled time</li>
                <li>• Carry this receipt (digital or print) for verification</li>
                <li>• For any changes, please contact the temple at least 24 hours in advance</li>
                <li>• The pooja will be performed as per temple traditions and schedule</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <p className="text-sm text-gray-600">
            🙏 Thank you for your devotion and support to the temple
          </p>
        </div>
      </div>
    </div>
  )
}