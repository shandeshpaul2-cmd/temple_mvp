'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Calendar, MapPin, Clock, Star, Sparkles, Heart } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/contexts/LanguageContext'
import { Input, Button } from '@/shared/components/ui'
import { LanguageSelector } from '@/shared/components/common/LanguageSelector'

interface FormData {
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  timeOfBirth: string
  timePeriod: 'AM' | 'PM'
  placeOfBirth: string
  starSign: string
}


export default function AstrologyConsultationPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    timeOfBirth: '',
    timePeriod: 'AM',
    placeOfBirth: '',
    starSign: '',
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

  // Function to calculate star sign based on date of birth
  const getStarSign = (dateString: string): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate()

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊'
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎'
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏'
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐'
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑'
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒'
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces ♓'

    return ''
  }

  // Auto-update star sign when date of birth changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      starSign: name === 'dateOfBirth' ? getStarSign(value) : prev.starSign
    }))

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
    console.log('Validating form data:', formData)
    const newErrors: Partial<FormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.nameRequired
      console.log('Name validation failed')
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.phoneRequired
      console.log('Phone number validation failed - empty')
    } else {
      // More flexible phone validation - accept 6-15 digits
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '')
      if (cleanPhone.length < 6 || cleanPhone.length > 15) {
        newErrors.phoneNumber = t.validPhone
        console.log('Phone number validation failed - invalid length:', cleanPhone.length)
      }
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t.dobRequired
      console.log('Date of birth validation failed - empty')
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      if (dob > today) {
        newErrors.dateOfBirth = t.dobFuture
        console.log('Date of birth validation failed - future date')
      }
    }

    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = t.timeRequired
      console.log('Time of birth validation failed - empty')
    } else if (!/^[0-9]{1,2}:[0-9]{2}$/.test(formData.timeOfBirth)) {
      newErrors.timeOfBirth = t.timeFormat
      console.log('Time of birth validation failed - format')
    } else {
      const [hours, minutes] = formData.timeOfBirth.split(':')
      const hourNum = parseInt(hours, 10)
      const minNum = parseInt(minutes, 10)

      if (isNaN(hourNum) || isNaN(minNum) || hourNum < 1 || hourNum > 12 || minNum < 0 || minNum > 59) {
        newErrors.timeOfBirth = t.validTime
        console.log('Time of birth validation failed - invalid values')
      }
    }

    if (!formData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = t.locationRequired
      console.log('Place of birth validation failed')
    }

    console.log('Validation errors found:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Astrology consultation form submitted:', formData)

    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      alert(t.fillRequiredCorrectly)
      return
    }

    console.log('Form validation passed, processing consultation booking')

    try {
      // Generate receipt number
      const receiptNumber = `AC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      console.log('Generated receipt number:', receiptNumber)

      const payload = {
        paymentType: 'astrology_consultation',
        userInfo: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        },
        items: [{
          name: 'Vedic Astrology Consultation',
          description: 'Comprehensive birth chart analysis and personal guidance'
        }],
        serviceDetails: {
          preferredDate: new Date().toISOString(),
          birthDetails: {
            dateOfBirth: formData.dateOfBirth,
            timeOfBirth: `${formData.timeOfBirth} ${formData.timePeriod}`,
            placeOfBirth: formData.placeOfBirth,
            starSign: formData.starSign
          }
        },
        receiptNumber: receiptNumber,
        paymentId: 'direct-' + Date.now(),
        status: 'completed'
      }

      console.log('Sending payload:', payload)

      // Store consultation booking in database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        console.log('Consultation booking processed successfully')
        console.log('Redirecting to success page with booking:', data.receiptNumber || receiptNumber)
        // Redirect to success page
        router.push(`/astrology-consultation/success?booking=${data.receiptNumber || receiptNumber}`)
      } else {
        console.error('API returned error:', data)
        alert(t.bookingFailed)
      }
    } catch (error) {
      console.error('Consultation booking error:', error)
      alert(t.somethingWentWrong)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t.backToHome}</span>
            </Link>
            <LanguageSelector />
          </div>

          <div className="text-center">
            {/* Sri Raghavendra Swamy Logo */}
            <div className="mb-4">
              <div className="w-32 h-32 mx-auto overflow-hidden rounded-full drop-shadow-lg border-4 border-purple-200">
                <img
                  src="/sri-raghavendra-logo.png"
                  alt="Sri Raghavendra Swamy"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 35%' }}
                />
              </div>
            </div>

            <h1 className="font-cinzel text-4xl font-bold text-purple-800 mb-3">
              {t.astrologyConsultation}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t.astrologySubtitle}
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="text-2xl text-purple-400">✦</div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>
        </div>

        {/* Service Benefits */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-semibold">{t.whatYouReceive}</span>
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-purple-800 mb-2">
              {t.completeLifeGuidance}
            </h2>
            <p className="text-gray-600">{t.allInclusiveConsultation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-purple-800 mb-2">{t.birthChartAnalysis}</h3>
              <p className="text-sm text-gray-600">{t.birthChartDesc}</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-purple-800 mb-2">{t.personalGuidance}</h3>
              <p className="text-sm text-gray-600">{t.personalGuidanceDesc}</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-purple-800 mb-2">{t.futurePredictions}</h3>
              <p className="text-sm text-gray-600">{t.futurePredictionsDesc}</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-purple-800 mb-2">{t.remediesSolutions}</h3>
              <p className="text-sm text-gray-600">{t.remediesSolutionsDesc}</p>
            </div>
          </div>
        </div>

  
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"></div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="font-cinzel text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                {t.personalInformation}
              </h2>

              <div className="space-y-6">
                <Input
                  label={t.fullName}
                  name="fullName"
                  placeholder={t.enterYourFullName}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                  required
                  leftIcon={<User className="w-5 h-5 text-gray-400" />}
                />

                <Input
                  label={t.phoneNumber}
                  name="phoneNumber"
                  type="tel"
                  placeholder={t.enterYourPhone}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                  required
                  leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Birth Details Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="font-cinzel text-2xl font-bold text-purple-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                {t.birthDetails}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t.dateOfBirth} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleDateChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-5 py-4 rounded-xl border-2 text-lg ${
                        errors.dateOfBirth
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-purple-500'
                      } focus:outline-none transition-colors`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      {t.timeOfBirth} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="timeOfBirth"
                        placeholder="9:30"
                        value={formData.timeOfBirth}
                        onChange={handleTimeInputChange}
                        className={`flex-1 px-5 py-4 rounded-xl border-2 text-lg ${
                          errors.timeOfBirth
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-purple-500'
                        } focus:outline-none transition-colors`}
                      />
                      <select
                        value={formData.timePeriod}
                        onChange={(e) => handleSelectChange('timePeriod', e.target.value)}
                        className={`px-5 py-4 rounded-xl border-2 text-lg font-semibold ${
                          errors.timeOfBirth
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-purple-500'
                        } focus:outline-none transition-colors bg-white`}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {errors.timeOfBirth && (
                      <p className="mt-2 text-sm text-red-500">{errors.timeOfBirth}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">{t.timeInputHelper}</p>
                  </div>
                </div>

                <Input
                  label={t.birthLocation}
                  name="placeOfBirth"
                  placeholder={t.enterYourFullName}
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  error={errors.placeOfBirth}
                  required
                  leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
                />

                {/* Moon Sign (Rashi) Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {t.moonSign}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="starSign"
                      value={formData.starSign}
                      readOnly
                      placeholder={t.enterYourFullName}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-lg font-semibold text-purple-700 cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Star className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {t.autoCalculated}
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation Process */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2 text-sm">{t.consultationProcess}</h3>
              <div className="bg-white/60 rounded-md p-3 mb-2 border border-purple-100">
                <p className="font-semibold text-purple-900 text-xs mb-0.5">{t.importantNote}</p>
                <p className="text-xs text-gray-700 leading-snug">{t.astrologerContact}</p>
              </div>
              <div className="text-xs text-gray-700 space-y-1">
                <p>• {t.instantConfirmation}</p>
                <p>• {t.callWithin24hrs}</p>
                <p>• {t.expertAnalysis}</p>
                <p>• {t.completeAnalysis}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full py-5 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                {t.bookConsultation}
              </Button>

              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-gray-600">
                  {t.instantConfirmation}
                </p>
                <p className="text-xs text-gray-500">
                  {t.trustedByThousands}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}