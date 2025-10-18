'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Calendar, MapPin, Clock, Star } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/contexts/LanguageContext'
import { Input, Button } from '@/shared/components/ui'

interface FormData {
  fullName: string
  phoneNumber: string
  emailAddress: string
  dateOfBirth: string
  timeOfBirth: string
  timePeriod: 'AM' | 'PM'
  placeOfBirth: string
}

export default function AstrologyConsultationPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    timeOfBirth: '',
    timePeriod: 'AM',
    placeOfBirth: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormData]
        return newErrors
      })
    }
  }

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^\d]/g, '') // Only allow numbers

    // Auto-format: add colon after 2 digits
    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2, 4)
    }

    // Limit to HH:MM format
    if (inputValue.length > 5) {
      inputValue = inputValue.slice(0, 5)
    }

    setFormData(prev => ({ ...prev, timeOfBirth: inputValue }))

    // Clear error when user starts typing
    if (errors.timeOfBirth) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.timeOfBirth
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormData]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      if (dob > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future'
      }
    }

    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = 'Time of birth is required'
    } else if (!/^[0-9]{1,2}:[0-9]{2}$/.test(formData.timeOfBirth)) {
      newErrors.timeOfBirth = 'Please enter time in HH:MM format'
    } else {
      const [hours, minutes] = formData.timeOfBirth.split(':')
      const hourNum = parseInt(hours, 10)
      const minNum = parseInt(minutes, 10)

      if (isNaN(hourNum) || isNaN(minNum) || hourNum < 1 || hourNum > 12 || minNum < 0 || minNum > 59) {
        newErrors.timeOfBirth = 'Please enter a valid time (1-12 hours, 00-59 minutes)'
      }
    }

    if (!formData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [selectedConsultation, setSelectedConsultation] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const consultationOptions = [
    { name: 'General Horoscope Analysis', price: 1500 },
    { name: 'Career & Business Guidance', price: 2100 },
    { name: 'Marriage & Relationship Counseling', price: 2100 },
    { name: 'Health Astrology', price: 1600 },
    { name: 'Childbirth & Progeny Analysis', price: 1800 },
    { name: 'Vastu Consultation', price: 3100 },
    { name: 'Muhurta (Auspicious Time)', price: 1100 },
    { name: 'Yearly Predictions', price: 2600 }
  ]

  const handleConsultationSelect = (consultation: { name: string; price: number }) => {
    setSelectedConsultation(consultation.name)
    setAmount(consultation.price.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Astrology consultation form submitted:', formData)

    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }

    if (!selectedConsultation || !amount) {
      alert('Please select a consultation type')
      return
    }

    console.log('Form validation passed, processing consultation booking')

    try {
      // Generate receipt number
      const receiptNumber = `AC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

      // Store consultation booking in database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentType: 'astrology_consultation',
          amount: parseInt(amount),
          userInfo: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            emailAddress: formData.emailAddress
          },
          items: [{
            name: selectedConsultation,
            description: selectedConsultation
          }],
          serviceDetails: {
            preferredDate: new Date().toISOString(),
            birthDetails: {
              dateOfBirth: formData.dateOfBirth,
              timeOfBirth: `${formData.timeOfBirth} ${formData.timePeriod}`,
              placeOfBirth: formData.placeOfBirth
            }
          },
          receiptNumber: receiptNumber,
          paymentId: 'direct-' + Date.now(),
          status: 'completed'
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log('Consultation booking processed successfully')
        // Redirect to success page
        router.push(`/astrology-consultation/success?booking=${data.receiptNumber || receiptNumber}`)
      } else {
        alert('Failed to process consultation booking. Please try again.')
      }
    } catch (error) {
      console.error('Consultation booking error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  const sendWhatsAppToAdmin = (data: FormData) => {
    // Admin WhatsApp number (you should configure this)
    const adminPhoneNumber = '+917760118171' // Admin number

    // Format the consultation details message
    const message = `🔮 *New Astrology Consultation Request* 🔮

📝 *Client Details:*
• Name: ${data.fullName}
• Phone: ${data.phoneNumber}
• Email: ${data.emailAddress}
• Date of Birth: ${new Date(data.dateOfBirth).toLocaleDateString('en-IN')}
• Time of Birth: ${data.timeOfBirth} ${data.timePeriod}
• Birth Location: ${data.placeOfBirth}

📅 *Request Date:* ${new Date().toLocaleDateString('en-IN')}
⏰ *Request Time:* ${new Date().toLocaleTimeString('en-IN')}

🙏 *Please contact the client within 24 hours to discuss consultation requirements and pricing.*

---
*Guru Seva Mandali - Astrology Services*`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${adminPhoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank')
  }

  
  
  // Show astrology consultation form
  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-temple-maroon hover:text-temple-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            {/* Sri Raghavendra Swamy Logo */}
            <div className="mb-4">
              <div className="w-32 h-32 mx-auto overflow-hidden rounded-full drop-shadow-lg">
                <img
                  src="/sri-raghavendra-logo.png"
                  alt="Sri Raghavendra Swamy"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 35%' }}
                />
              </div>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-temple-maroon mb-2">
              Astrology Consultation
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover divine guidance through your birth chart analysis
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-xl text-temple-gold">✦</div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
            </div>
          </div>
        </div>

        {/* Consultation Selection */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-temple-gold/20 p-4 mb-6">
          <h2 className="font-cinzel text-xl font-bold text-temple-maroon mb-3 text-center">
            Select Consultation Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {consultationOptions.map((consultation) => (
              <div
                key={consultation.name}
                onClick={() => handleConsultationSelect(consultation)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedConsultation === consultation.name
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{consultation.name}</span>
                  <span className="text-purple-600 font-semibold text-sm">₹{consultation.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-temple-gold/20 p-4 mb-6">
          <h2 className="font-cinzel text-xl font-bold text-temple-maroon mb-3 text-center">
            What You'll Receive
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <Star className="w-5 h-5 text-temple-maroon" />
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs">Birth Chart Analysis</h3>
              <p className="text-xs text-gray-600">Complete horoscope analysis</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <User className="w-5 h-5 text-temple-maroon" />
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs">Personal Guidance</h3>
              <p className="text-xs text-gray-600">Tailored astrological advice</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <Calendar className="w-5 h-5 text-temple-maroon" />
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs">Future Predictions</h3>
              <p className="text-xs text-gray-600">Insights into your future</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-temple-gold/20 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-temple-maroon mb-4 flex items-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                  required
                  leftIcon={<User className="w-5 h-5 text-gray-400" />}
                />

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                  required
                  leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
                />

                <Input
                  label="Email Address"
                  name="emailAddress"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  error={errors.emailAddress}
                  required
                  leftIcon={<User className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Birth Details Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-temple-maroon mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                Birth Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.dateOfBirth
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-temple-gold'
                      } focus:outline-none transition-colors`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="timeOfBirth"
                        placeholder="9:30"
                        value={formData.timeOfBirth}
                        onChange={handleTimeInputChange}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                          errors.timeOfBirth
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-temple-gold'
                        } focus:outline-none transition-colors`}
                      />
                      <select
                        value={formData.timePeriod}
                        onChange={(e) => handleSelectChange('timePeriod', e.target.value)}
                        className={`px-4 py-3 rounded-xl border-2 ${
                          errors.timeOfBirth
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-temple-gold'
                        } focus:outline-none transition-colors bg-white`}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.timeOfBirth && (
                      <p className="mt-1 text-sm text-red-500">{errors.timeOfBirth}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Just type numbers, colon added automatically (e.g., 930 → 9:30)</p>
                  </div>
                </div>

                <Input
                  label="Location"
                  name="placeOfBirth"
                  placeholder="City where you were born"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  error={errors.placeOfBirth}
                  required
                  leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-temple-cream/30 rounded-xl p-4 border border-temple-gold/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                🔮 <span className="font-semibold">Consultation Process:</span>
                Our expert astrologer will review your birth details and contact you within 24 hours to schedule your consultation session. You'll receive instant confirmation with receipt details via email and WhatsApp.
              </p>
            </div>

            {/* Payment Summary */}
            {selectedConsultation && amount && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-purple-800">Selected Consultation:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {selectedConsultation} - ₹{parseInt(amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-sm text-purple-700">
                  You will receive a confirmation email with receipt details immediately after booking.
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500"
                disabled={!selectedConsultation || !amount}
              >
                {selectedConsultation && amount
                  ? `Book Consultation - ₹${parseInt(amount).toLocaleString('en-IN')}`
                  : 'Select a consultation type to continue'
                }
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                ✨ Instant confirmation with receipt via email • Expert will contact you within 24 hours
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}