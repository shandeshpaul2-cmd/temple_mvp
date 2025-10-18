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
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Invalid parihara booking confirmation</p>
        <Link href="/parihara-pooja">
          <Button>Back to Parihara Services</Button>
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/parihara-pooja">
          <Button>Back to Parihara Services</Button>
        </Link>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    const templeAddress = "Sri Raghavendra Brindavana Sannidhi, #12, 1st Main Road, Girinagar, 1st Phase, Bengaluru, Karnataka - 560085"
    const encodedAddress = encodeURIComponent(templeAddress)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  const handleCallUs = () => {
    window.open('tel:+917760118171', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-red-100 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600"></div>

          <div className="p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-3xl font-bold text-red-800 mb-3">
                Parihara Pooja Booked Successfully
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Your parihara pooja booking has been confirmed
              </p>
              <p className="text-sm text-gray-500">
                May the divine remedies bring peace and remove obstacles from your life
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-400"></div>
              <div className="text-2xl text-red-400">✦</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-400"></div>
            </div>

            {/* Receipt Number */}
            <div className="bg-red-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Parihara Booking Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt Number:</span>
                  <span className="font-medium text-red-800 font-mono">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parihara Service:</span>
                  <span className="font-medium text-red-800">{bookingDetails.pariharaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Booked Successfully
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Horoscope Analysis</p>
                    <p className="text-gray-600 text-sm">
                      Our astrologer will analyze your horoscope to identify specific doshas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Contact Within 24 Hours</p>
                    <p className="text-gray-600 text-sm">
                      Our team will contact you to discuss the specific parihara rituals needed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Payment & Scheduling</p>
                    <p className="text-gray-600 text-sm">
                      Finalize the parihara scope, pricing, and schedule the auspicious date and time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Parihara Performance</p>
                    <p className="text-gray-600 text-sm">
                      Sacred rituals performed to remove obstacles and bring divine blessings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Devotee Information */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-blue-800 mb-3">Devotee Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-blue-800">{bookingDetails.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-blue-800">{bookingDetails.userPhone}</span>
                </div>
                {bookingDetails.nakshatra && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nakshatra:</span>
                    <span className="font-medium text-blue-800">{bookingDetails.nakshatra}</span>
                  </div>
                )}
                {bookingDetails.gotra && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gotra:</span>
                    <span className="font-medium text-blue-800">{bookingDetails.gotra}</span>
                  </div>
                )}
                {bookingDetails.specificIssue && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Specific Issue:</p>
                    <p className="text-gray-700 italic">"{bookingDetails.specificIssue}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Temple Location Section */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-red-800 mb-4 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Visit Our Temple
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="font-medium text-gray-800">Sri Raghavendra Brindavana Sannidhi</p>
                  <p className="text-sm text-gray-600 mt-1">
                    #12, 1st Main Road, Girinagar, 1st Phase<br />
                    Bengaluru, Karnataka - 560085
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGetDirections}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </button>
                  <button
                    onClick={handleCallUs}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleDownloadReceipt}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-blue-400 disabled:to-indigo-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Download Receipt...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share on WhatsApp
              </button>

              <Link href="/" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] shadow-lg">
                  <Home className="w-5 h-5" />
                  Return to Home
                </button>
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500">
              Thank you for choosing our authentic Vedic parihara services
            </p>
          </div>
        </div>

        {/* Additional Booking CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need another parihara pooja?</p>
          <Link href="/parihara-pooja">
            <Button variant="outline" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-200 hover:bg-red-50">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    }>
      <PariharaConfirmationContent />
    </Suspense>
  )
}