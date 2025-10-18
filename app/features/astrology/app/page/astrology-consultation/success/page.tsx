'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, MapPin, Phone } from 'lucide-react'
import { Button } from '@/shared/components/ui'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingNumber = searchParams.get('booking')

  if (!bookingNumber) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Invalid consultation details</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  const handleGetDirections = () => {
    // Temple address for Google Maps
    const templeAddress = "Sri Raghavendra Brindavana Sannidhi, #12, 1st Main Road, Girinagar, 1st Phase, Bengaluru, Karnataka - 560085"
    const encodedAddress = encodeURIComponent(templeAddress)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  const handleCallUs = () => {
    // Temple phone number
    window.open('tel:+917760118171', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-temple-gold/20 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

          <div className="p-6 sm:p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-temple-maroon mb-2">
                🔮 Consultation Booked Successfully!
              </h1>
              <p className="text-gray-600 mb-2">
                Your astrology consultation has been confirmed
              </p>
              <p className="text-xs text-gray-500">
                Our expert astrologer will guide you on your spiritual journey
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-xl text-temple-gold">✦</div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
            </div>

            {/* Consultation Details */}
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <h3 className="font-cinzel text-xl font-bold text-temple-maroon mb-4">Consultation Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium text-temple-maroon">Birth Chart Analysis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium text-temple-maroon">To be determined</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">✓ Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-6">
              <h3 className="font-cinzel text-base font-bold text-temple-maroon mb-3">
                What happens next?
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-xs">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Our astrologer will <span className="font-semibold">contact you within 24 hours</span> via phone
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-xs">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Schedule your consultation</span> at a convenient time
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-xs">3</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Receive <span className="font-semibold">detailed birth chart analysis</span> and guidance
                  </p>
                </div>
              </div>
            </div>

            {/* Temple Location Section */}
            <div className="bg-temple-cream/30 rounded-xl p-4 mb-6">
              <h3 className="font-cinzel text-base font-bold text-temple-maroon mb-3 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                Visit Our Temple
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="font-medium text-gray-800 text-sm">Sri Raghavendra Brindavana Sannidhi</p>
                  <p className="text-xs text-gray-600 mt-1">
                    #12, 1st Main Road, Girinagar, 1st Phase<br />
                    Bengaluru, Karnataka - 560085
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleGetDirections}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    <MapPin className="w-3 h-3" />
                    Directions
                  </button>
                  <button
                    onClick={handleCallUs}
                    className="flex items-center justify-center gap-1 px-2 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                  >
                    <Phone className="w-3 h-3" />
                    Call Us
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link href="/" className="block">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-temple-gold/20 to-temple-gold/30 text-temple-maroon rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-temple-gold/30">
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Services CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Interested in other spiritual services?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/donate">
              <Button variant="outline" className="inline-flex items-center gap-2">
                Make a Donation
              </Button>
            </Link>
            <Link href="/book-pooja">
              <Button variant="outline" className="inline-flex items-center gap-2">
                Book Pooja Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AstrologySuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}