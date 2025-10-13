'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Share2, Home, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

function SuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const receiptNumber = searchParams.get('receipt')
  const donationId = searchParams.get('id')

  const [isLoading, setIsLoading] = useState(false)
  const [donationDetails, setDonationDetails] = useState<any>(null)

  // Fetch donation details from admin API
  useEffect(() => {
    if (receiptNumber) {
      fetchDonationDetails()
    }
  }, [receiptNumber])

  const fetchDonationDetails = async () => {
    try {
      if (!receiptNumber) return
      const response = await fetch(`/api/donations/${encodeURIComponent(receiptNumber)}`)
      if (response.ok) {
        const donation = await response.json()
        if (donation) {
          setDonationDetails(donation)
        }
      }
    } catch (error) {
      console.error('Error fetching donation details:', error)
    }
  }

  if (!receiptNumber || !donationId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Invalid donation details</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
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
    const message = `Thank you for your donation to Guru Seva Mandali! Receipt Number: ${receiptNumber}`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-temple-gold/20 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

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
                🙏 Donation Successful!
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                Your generous contribution has been received
              </p>
              <p className="text-sm text-gray-500">
                May {t.templeDeity} bless you with prosperity and happiness
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

            {/* Donation Details */}
            {donationDetails && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-cinzel text-xl font-bold text-temple-maroon mb-4">Donation Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donation Type:</span>
                    <span className="font-medium text-temple-maroon">{donationDetails.donationType}</span>
                  </div>
                  {donationDetails.donationPurpose && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium">{donationDetails.donationPurpose}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donor Name:</span>
                    <span className="font-medium">{donationDetails.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{donationDetails.userPhone}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Amount Donated:</span>
                      <div className="flex items-center gap-1 text-temple-maroon font-bold text-lg">
                        <span>₹</span>
                        <span>{donationDetails.amount?.toLocaleString('en-IN') || '0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">✓ Successful</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {donationDetails.createdAt ? new Date(donationDetails.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next Section */}
            <div className="bg-gradient-to-r from-orange-50 to-temple-cream/50 rounded-xl p-6 mb-8">
              <h3 className="font-cinzel text-lg font-bold text-temple-maroon mb-4">
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-sm">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    You'll receive an <span className="font-semibold">instant digital receipt</span> at your registered email
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-sm">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    A <span className="font-semibold">beautiful certificate</span> will be sent to your WhatsApp number
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-temple-maroon font-bold text-sm">3</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    You'll be added to our <span className="font-semibold">WhatsApp devotee community</span> for temple updates
                  </p>
                </div>
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

        {/* Additional Donation CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Want to make another contribution?</p>
          <Link href="/donate">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Heart className="w-4 h-4" fill="currentColor" />
              Make Another Donation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DonateSuccessPage() {
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
