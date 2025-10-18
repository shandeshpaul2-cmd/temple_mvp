'use client'

import { useState, useEffect } from 'react'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  useEffect(() => {
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
    if (!amount || !donorName || !donorPhone) {
      alert('Please fill all fields')
      return
    }

    try {
      const receiptNumber = `DN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

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
            phoneNumber: donorPhone
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
        const donationDetails = {
          donorName,
          donorPhone,
          amount: parseInt(amount),
          donationType: 'General Donation',
          donationPurpose: 'Temple Maintenance',
          receiptNumber: data.receiptNumber || receiptNumber,
          paymentId: data.paymentId || 'direct-' + Date.now(),
          date: new Date().toISOString()
        }
        sessionStorage.setItem('donationDetails', JSON.stringify(donationDetails))
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
            <h1 className="text-4xl font-bold text-center mb-2">
              🙏 Make a Sacred Donation
            </h1>
            <p className="text-center text-orange-100">
              Your generous contribution helps us maintain the temple and serve the community
            </p>
          </div>

          <div className="p-8">
            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-3">
                <span className="text-3xl">🕉️</span>
                <span className="ml-3 text-lg font-medium text-orange-800">Support Divine Service</span>
              </div>
              <p className="text-gray-700 text-center">
                Every contribution brings blessings and helps continue the sacred traditions
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Donation Amount (₹) *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {[500, 1100, 2100, 5100, 11000, 21000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all ${
                        amount === amt.toString()
                          ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 bg-white text-gray-700'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-center text-lg font-semibold"
                    placeholder="Enter custom amount"
                    min="1"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                </div>
              </div>

              <button
                onClick={handleDonate}
                disabled={!amount || !donorName || !donorPhone}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02] shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
              >
                🙏 Donate ₹{amount ? parseInt(amount).toLocaleString('en-IN') : '0'} ✨
              </button>
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">📜</span>
                <h3 className="font-bold text-orange-800 ml-3 text-lg">Divine Acknowledgments</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-sm text-gray-700">Instant WhatsApp receipt with 80G tax exemption certificate</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-sm text-gray-700">Priest office notification for your generous support</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-sm text-gray-700">Sacred blessings from Shri Raghavendra Swamy Brundavana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}