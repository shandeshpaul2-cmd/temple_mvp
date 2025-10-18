'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BookPoojaPage() {
  const router = useRouter()
  const [poojaName, setPoojaName] = useState('')
  const [amount, setAmount] = useState('')
  const [devoteeName, setDevoteeName] = useState('')
  const [devoteePhone, setDevoteePhone] = useState('')
  const [devoteeEmail, setDevoteeEmail] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [nakshatra, setNakshatra] = useState('')
  const [gotra, setGotra] = useState('')

  const poojaOptions = [
    { name: 'Nithya Pooja', price: 500 },
    { name: 'Padha Pooja', price: 100 },
    { name: 'Panchmrutha Abhisheka', price: 1100 },
    { name: 'Madhu Abhisheka', price: 1600 },
    { name: 'Sarva Seva', price: 2100 },
    { name: 'Vishesha Alankara Seva', price: 3100 },
    { name: 'Belli Kavachadharane', price: 2100 },
    { name: 'Sahasranama Archane', price: 500 },
    { name: 'Vayusthuthi Punashcharne', price: 500 },
    { name: 'Kanakabhisheka', price: 5100 },
    { name: 'Vastra Arpane Seva', price: 1100 }
  ]

  const nakshatraOptions = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
    'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ]

  const handlePoojaSelect = (pooja: { name: string; price: number }) => {
    setPoojaName(pooja.name)
    setAmount(pooja.price.toString())
  }

  const handleBookPooja = async () => {
    if (!poojaName || !amount || !devoteeName || !devoteePhone || !devoteeEmail) {
      alert('Please fill all required fields')
      return
    }

    try {
      // Generate receipt number
      const receiptNumber = `PJ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

      // Store pooja booking in database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentType: 'pooja',
          amount: parseInt(amount),
          userInfo: {
            fullName: devoteeName,
            phoneNumber: devoteePhone,
            emailAddress: devoteeEmail
          },
          items: [{
            name: poojaName,
            description: poojaName
          }],
          serviceDetails: {
            preferredDate,
            preferredTime,
            nakshatra,
            gotra
          },
          receiptNumber: receiptNumber,
          paymentId: 'direct-' + Date.now(),
          status: 'completed'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to confirmation page with real receipt number
        window.location.href = `/book-pooja/confirmation/${data.receiptNumber || receiptNumber}`
      } else {
        alert('Failed to process pooja booking. Please try again.')
      }
    } catch (error) {
      console.error('Pooja booking error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-purple-800 text-center mb-8">
            🕉️ Book Pooja
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Book a pooja at Shri Raghavendra Swamy Brundavana Sannidhi and receive blessings.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Pooja</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {poojaOptions.map((pooja) => (
                  <div
                    key={pooja.name}
                    onClick={() => handlePoojaSelect(pooja)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      poojaName === pooja.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{pooja.name}</span>
                      <span className="text-purple-600 font-semibold">₹{pooja.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Devotee Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={devoteePhone}
                    onChange={(e) => setDevoteePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={devoteeEmail}
                    onChange={(e) => setDevoteeEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nakshatra (Birth Star)
                  </label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Nakshatra</option>
                    {nakshatraOptions.map((nak) => (
                      <option key={nak} value={nak}>{nak}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gotra
                  </label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your gotra (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-purple-800">Selected Pooja:</span>
              <span className="text-xl font-bold text-purple-600">
                {poojaName} - ₹{amount ? parseInt(amount).toLocaleString('en-IN') : '0'}
              </span>
            </div>

            <button
              onClick={handleBookPooja}
              disabled={!poojaName || !amount || !devoteeName || !devoteePhone || !devoteeEmail}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Book Pooja - ₹{amount ? parseInt(amount).toLocaleString('en-IN') : '0'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Divine Scheduling Confirmation</h3>
            <p className="text-sm text-gray-600">
              You will receive a sacred booking confirmation with receipt details on both WhatsApp and email immediately after payment. The temple priest's office will also receive your scheduling details for divine arrangements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}