'use client'

import { useState, useEffect } from 'react'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setIsRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleDonate = async () => {
    if (!amount || !donorName || !donorPhone || !donorEmail) {
      alert('Please fill all fields')
      return
    }

    try {
      // Generate receipt number
      const receiptNumber = `DN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

      // Store donation in database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentType: 'donation',
          amount: parseInt(amount),
          userInfo: {
            fullName: donorName,
            phoneNumber: donorPhone,
            emailAddress: donorEmail
          },
          items: [{
            name: 'General Donation',
            description: 'Temple Maintenance'
          }],
          receiptNumber: receiptNumber,
          paymentId: 'direct-' + Date.now(),
          status: 'completed'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store donation details in sessionStorage for success page
        const donationDetails = {
          donorName,
          donorPhone,
          donorEmail,
          amount: parseInt(amount),
          donationType: 'General Donation',
          donationPurpose: 'Temple Maintenance',
          receiptNumber: data.receiptNumber || receiptNumber,
          paymentId: data.paymentId || 'direct-' + Date.now(),
          date: new Date().toISOString()
        }
        sessionStorage.setItem('donationDetails', JSON.stringify(donationDetails))

        // Redirect to success page
        window.location.href = '/donate/success'
      } else {
        alert('Failed to process donation. Please try again.')
      }
    } catch (error) {
      console.error('Donation error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-800 text-center mb-8">
            🙏 Make a Donation
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Your generous contribution helps us maintain the temple and serve the community.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (₹) *
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[500, 1100, 2100, 5100, 11000, 21000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      amount === amt.toString()
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter custom amount"
                min="1"
              />
            </div>

            <button
              onClick={handleDonate}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Donate ₹{amount ? parseInt(amount).toLocaleString('en-IN') : '0'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Divine Acknowledgments</h3>
            <p className="text-sm text-gray-600">
              You will receive a donation receipt with sacred certificate on both WhatsApp and email immediately after your contribution. The priest's office will also receive notification of your generous support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}