'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PaymentLoadingButton from '../components/PaymentLoadingButton'
import { LanguageSelector } from '@/shared/components/common/LanguageSelector'
import { useLanguage } from '@/shared/contexts/contexts/LanguageContext'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BookPoojaPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [poojaName, setPoojaName] = useState('')
  const [amount, setAmount] = useState('')
  const [devoteeName, setDevoteeName] = useState('')
  const [devoteePhone, setDevoteePhone] = useState('')
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
    if (!poojaName || !amount || !devoteeName || !devoteePhone) {
      alert(t.pleaseFillRequiredFields)
      return
    }

    try {
      // Generate receipt number and payment ID once
      const receiptNumber = `PJ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      const paymentId = 'direct-' + Date.now()

      // Store pooja booking details in session storage immediately
      const poojaDetails = {
        poojaName,
        devoteeName,
        devoteePhone,
        amount: parseInt(amount),
        preferredDate,
        preferredTime,
        nakshatra,
        gotra,
        receiptNumber,
        paymentId,
        date: new Date().toISOString()
      }
      sessionStorage.setItem('poojaDetails', JSON.stringify(poojaDetails))

      // Process payment in background with optimistic UI
      const paymentPromise = fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentType: 'pooja',
          amount: parseInt(amount),
          userInfo: {
            fullName: devoteeName,
            phoneNumber: devoteePhone
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
          receiptNumber,
          paymentId,
          status: 'completed'
        })
      })

      // Process payment asynchronously
      const response = await paymentPromise
      const data = await response.json()

      if (data.success) {
        // Update with server-generated data if available
        const updatedDetails = {
          ...poojaDetails,
          receiptNumber: data.receiptNumber || receiptNumber,
          paymentId: data.paymentId || paymentId
        }
        sessionStorage.setItem('poojaDetails', JSON.stringify(updatedDetails))
      }

      // Redirect regardless of API response success (optimistic UI)
      window.location.href = `/book-pooja/confirmation/${receiptNumber}`

    } catch (error) {
      console.error('Pooja booking error:', error)
      alert(t.somethingWentWrong)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Language Selector and Back Button */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.backToHome}</span>
          </Link>
          <LanguageSelector />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-purple-800 text-center mb-8">
            🕉️ {t.bookPooja}
          </h1>

          <p className="text-gray-600 text-center mb-8">
            {t.bookPoojaDesc}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.selectPoojaService}</h2>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.devoteeInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t.enterYourFullName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.phoneNumber} *
                  </label>
                  <input
                    type="tel"
                    value={devoteePhone}
                    onChange={(e) => setDevoteePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t.enterYourPhone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.preferredDate}
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
                    {t.preferredTime}
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
                    {t.nakshatra}
                  </label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">{t.selectNakshatra}</option>
                    {nakshatraOptions.map((nak) => (
                      <option key={nak} value={nak}>{nak}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.gotra}
                  </label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t.enterGotra}
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

            <PaymentLoadingButton
              onClick={handleBookPooja}
              disabled={!poojaName || !amount || !devoteeName || !devoteePhone}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg font-semibold"
              loadingText={t.processing}
            >
              {t.bookPooja} - ₹{amount ? parseInt(amount).toLocaleString('en-IN') : '0'}
            </PaymentLoadingButton>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">{t.importantInformation}</h3>
            <p className="text-sm text-gray-600">
              {t.instantConfirmation}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}