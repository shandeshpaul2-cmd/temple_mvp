'use client'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Share2, Home, Calendar, Clock, User, Phone, IndianRupee, Star, MapPin, Heart } from 'lucide-react'
import { Button } from '@/shared/components/ui'

function PariharaConfirmationContent() {
  const params = useParams()
  const router = useRouter()
  const receiptNumber = params.receiptNumber as string

  const [isLoading, setIsLoading] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (receiptNumber) {
      fetchBookingDetails()
    }
  }, [receiptNumber])

  const fetchBookingDetails = async () => {
    try {
      // TODO: Implement API endpoint to fetch parihara booking details
      // const response = await fetch(`/api/parihara-bookings/${receiptNumber}`)
      // if (!response.ok) {
      //   throw new Error('Booking not found')
      // }
      // const data = await response.json()
      // setBookingDetails(data)

      // For now, using mock data
      setBookingDetails({
        pariharaName: "Shani Shanti Parihara",
        userName: "Devotee Name",
        userPhone: "+91 98765 43210",
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: "8:00 AM - 10:00 AM",
        pariharaPrice: 3000,
        nakshatra: "Rohini",
        gotra: "Bharadwaja",
        specificIssue: "Facing career obstacles and delays in marriage"
      })
    } catch (error) {
      console.error('Error fetching booking details:', error)
      setError('Failed to load booking details')
    }
  }

  if (!receiptNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid parihara booking confirmation</p>
          <Link href="/parihara-pooja">
            <Button>Back to Parihara Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/parihara-pooja">
            <Button>Back to Parihara Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parihara booking details...</p>
        </div>
      </div>
    )
  }

  const handleDownloadReceipt = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement PDF download
      alert('Receipt download will be implemented soon!')
    } catch (error) {
      console.error('Error downloading receipt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareWhatsApp = () => {
    const message = `🔮 Parihara Pooja Booked!\n\n${bookingDetails.pariharaName}\nDate: ${new Date(bookingDetails.preferredDate).toLocaleDateString('en-IN')}\nTime: ${bookingDetails.preferredTime}\nReceipt: ${receiptNumber}\n\nThank you for booking at Guru Seva Mandali!`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleGetDirections = () => {
    const templeAddress = "Guru Seva Mandali, [Your Temple Address Here]"
    const encodedAddress = encodeURIComponent(templeAddress)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-temple-gold/20 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-temple-gold to-red-600"></div>

          <div className="p-8 sm:p-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-temple-maroon mb-3">
                🔮 Parihara Pooja Booked Successfully!
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Your parihara pooja booking has been confirmed
              </p>
              <p className="text-sm text-gray-500">
                May the divine remedies bring peace and remove obstacles from your life
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-2xl text-temple-gold">ॐ</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-temple-gold"></div>
            </div>

            {/* Receipt Number */}
            <div className="bg-temple-cream/30 rounded-xl p-6 border border-temple-gold/20 mb-8">
              <p className="text-sm text-gray-600 mb-2 text-center">Receipt Number</p>
              <p className="text-2xl font-bold text-temple-maroon text-center font-mono tracking-wider">
                {receiptNumber}
              </p>
            </div>

            {/* Parihara Details */}
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <h3 className="font-cinzel text-xl font-bold text-temple-maroon mb-4">Parihara Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parihara Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Parihara Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parihara:</span>
                      <span className="font-medium text-temple-maroon">{bookingDetails.pariharaName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {bookingDetails.preferredDate ? new Date(bookingDetails.preferredDate).toLocaleDateString('en-IN') : 'To be scheduled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{bookingDetails.preferredTime || 'To be scheduled'}</span>
                    </div>
                  </div>
                </div>

                {/* Devotee Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Devotee Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{bookingDetails.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{bookingDetails.userPhone}</span>
                    </div>
                    {bookingDetails.nakshatra && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Nakshatra:
                        </span>
                        <span className="font-medium">{bookingDetails.nakshatra}</span>
                      </div>
                    )}
                    {bookingDetails.gotra && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gotra:</span>
                        <span className="font-medium">{bookingDetails.gotra}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specific Issue */}
              {bookingDetails.specificIssue && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Specific Issue for Parihara:</h4>
                  <p className="text-gray-600 italic">"{bookingDetails.specificIssue}"</p>
                </div>
              )}

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Amount Paid:</span>
                  <div className="flex items-center gap-1 text-temple-maroon font-bold text-lg">
                    <IndianRupee className="w-5 h-5" />
                    <span>{bookingDetails.pariharaPrice?.toLocaleString('en-IN') || '0'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Temple Location Section */}
            <div className="bg-temple-cream/30 rounded-xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-temple-maroon mb-4">
                Visit Our Temple
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-temple-maroon mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Guru Seva Mandali</p>
                    <p className="text-sm text-gray-600">
                      [Your Temple Address Here]<br />
                      City, State - Pincode
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGetDirections}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions on Google Maps
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadReceipt}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-temple-maroon to-red-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Download Receipt (PDF)
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                Share on WhatsApp
              </button>

              <Link href="/" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-temple-gold/20 text-temple-maroon rounded-xl font-semibold hover:bg-temple-gold/30 transition-all duration-300 border-2 border-temple-gold/30">
                  <Home className="w-5 h-5" />
                  Return to Home
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Booking CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Need another parihara pooja?</p>
          <Link href="/parihara-pooja">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Book Another Parihara
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PariharaConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    }>
      <PariharaConfirmationContent />
    </Suspense>
  )
}