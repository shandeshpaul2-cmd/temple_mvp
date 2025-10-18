'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, MapPin, Phone, Star, Calendar } from 'lucide-react'
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
                Consultation Request Confirmed
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Your astrology consultation request has been successfully registered
              </p>
              <p className="text-sm text-gray-500">
                Our expert Vedic astrologer will contact you within 24 hours
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-400"></div>
              <div className="text-2xl text-red-400">✦</div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-400"></div>
            </div>

            {/* Consultation Details */}
            <div className="bg-red-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Consultation Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-medium text-red-800 font-mono">{bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium text-red-800">Vedic Astrology Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium text-red-800">To be discussed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Request Registered
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
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
                    <p className="text-gray-700 font-semibold mb-1">Initial Contact</p>
                    <p className="text-gray-600 text-sm">
                      Our astrologer will contact you within 24 hours via phone to discuss your requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Requirements Discussion</p>
                    <p className="text-gray-600 text-sm">
                      Detailed discussion about your consultation needs and scope
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
                      Finalize consultation scope, pricing, and schedule your session
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Consultation Session</p>
                    <p className="text-gray-600 text-sm">
                      Receive detailed birth chart analysis and personalized guidance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-blue-800 mb-3">Payment Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Important:</span> Payment will be discussed and processed after our astrologer reviews your requirements and finalizes the consultation scope. This ensures you receive personalized service tailored to your specific needs.
                </p>
                <p className="text-gray-600 text-sm">
                  Our astrologer will explain the consultation process and associated fees during your initial call.
                </p>
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

            {/* Action Button */}
            <Link href="/" className="block">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </Link>

            <p className="text-center text-xs text-gray-500 mt-4">
              Thank you for choosing our authentic Vedic astrology services
            </p>
          </div>
        </div>

        {/* Additional Services CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Interested in other spiritual services?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button variant="outline" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-200 hover:bg-red-50">
                Make a Donation
              </Button>
            </Link>
            <Link href="/book-pooja">
              <Button variant="outline" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-200 hover:bg-red-50">
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
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}