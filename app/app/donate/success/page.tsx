'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { certificateService, CertificateData } from '@/lib/certificate-service'

interface DonationDetails {
  donorName: string
  donorPhone: string
  amount: number
  donationType: string
  donationPurpose: string
  receiptNumber: string
  paymentId: string
  date: string
}

export default function DonationSuccessPage() {
  const router = useRouter()
  const [donationDetails, setDonationDetails] = useState<DonationDetails | null>(null)
  const [certificateLoading, setCertificateLoading] = useState(false)
  const [certificateError, setCertificateError] = useState<string | null>(null)
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  
  useEffect(() => {
    // Retrieve donation details from sessionStorage
    const storedDetails = sessionStorage.getItem('donationDetails')
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails)
        setDonationDetails(details)
      } catch (error) {
        console.error('Error parsing donation details:', error)
        router.push('/donate')
      }
    } else {
      // No donation details found, redirect to donate page
      router.push('/donate')
    }
  }, [router])

  
  const handleDonateAgain = () => {
    sessionStorage.removeItem('donationDetails')
    router.push('/donate')
  }

  const handleGenerateCertificate = async () => {
    if (!donationDetails) return

    setCertificateLoading(true)
    setCertificateError(null)

    try {
      const certificateData: CertificateData = {
        donor_name: donationDetails.donorName,
        amount: donationDetails.amount,
        donation_id: donationDetails.receiptNumber,
        donation_date: new Date(donationDetails.date).toISOString().split('T')[0],
        payment_mode: 'Razorpay',
        org_name: 'Shri Raghavendra Swamy Brundavana Sannidhi, Halasuru',
        org_subtitle: 'Guru Seva Mandali (Regd.)',
        show_80g_note: true,
      }

      const result = await certificateService.generateAndDownload(certificateData)

      if (result.success) {
        setCertificateGenerated(true)
      } else {
        setCertificateError(result.error || 'Failed to generate certificate')
      }

    } catch (error) {
      console.error('Certificate generation error:', error)
      setCertificateError('Failed to generate certificate. Please try again.')
    } finally {
      setCertificateLoading(false)
    }
  }

  if (!donationDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              🙏 Donation Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your generous contribution to Shri Raghavendra Swamy Brundavana Sannidhi
            </p>
          </div>

          {/* Donation Details */}
          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-orange-800 mb-4">Donation Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Receipt Number:</span>
                <span className="font-medium">{donationDetails.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donor Name:</span>
                <span className="font-medium">{donationDetails.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-medium">{donationDetails.donorPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donation Type:</span>
                <span className="font-medium">{donationDetails.donationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Purpose:</span>
                <span className="font-medium">{donationDetails.donationPurpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(donationDetails.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-800">Amount Paid:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{donationDetails.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">📜 Download Your Certificate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate an official donation certificate for your records. This certificate includes your donation details and is valid for tax purposes under Section 80G.
            </p>

            {certificateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">{certificateError}</p>
              </div>
            )}

            {certificateGenerated && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">✅ Certificate generated successfully! Check your downloads folder.</p>
              </div>
            )}

            <button
              onClick={handleGenerateCertificate}
              disabled={certificateLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {certificateLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Certificate...
                </>
              ) : (
                <>
                  📄 Download Certificate
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleDonateAgain}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              🙏 Donate Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              🏠 Go Home
            </button>
          </div>

          {/* WhatsApp Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">📱 WhatsApp Notification</h3>
            <p className="text-sm text-gray-600">
              You will receive a confirmation message with your receipt details on WhatsApp shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}