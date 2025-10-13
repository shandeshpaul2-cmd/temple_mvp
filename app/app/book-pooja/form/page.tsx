'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Phone, IndianRupee, Check, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import PaymentPortal, { PaymentItem } from '@/components/payment/PaymentPortal'

interface PoojaService {
  id: number
  poojaName: string
  description: string
  price: number
  displayOrder: number
}

interface FormData {
  name: string
  phone: string
  nakshatra: string
  date: string
  timeSlot: string
}

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
]

const NAKSHATRAS = [
  'Ashwini (अश्विनी)',
  'Bharani (भरणी)',
  'Krittika (कृत्तिका)',
  'Rohini (रोहिणी)',
  'Mrigashirsha (मृगशिरा)',
  'Ardra (आर्द्रा)',
  'Punarvasu (पुनर्वसु)',
  'Pushya (पुष्य)',
  'Ashlesha (आश्लेषा)',
  'Magha (मघा)',
  'Purva Phalguni (पूर्व फाल्गुनी)',
  'Uttara Phalguni (उत्तर फाल्गुनी)',
  'Hasta (हस्त)',
  'Chitra (चित्रा)',
  'Swati (स्वाति)',
  'Vishakha (विशाखा)',
  'Anuradha (अनुराधा)',
  'Jyeshtha (ज्येष्ठा)',
  'Mula (मूल)',
  'Purva Ashadha (पूर्वाषाढ़ा)',
  'Uttara Ashadha (उत्तराषाढ़ा)',
  'Shravana (श्रवण)',
  'Dhanishta (धनिष्ठा)',
  'Shatabhisha (शतभिषा)',
  'Purva Bhadrapada (पूर्व भाद्रपदा)',
  'Uttara Bhadrapada (उत्तर भाद्रपदा)',
  'Revati (रेवती)',
]

function BookingFormPageContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service')

  const [service, setService] = useState<PoojaService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    nakshatra: '',
    date: '',
    timeSlot: '',
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (!serviceId) {
      router.push('/book-pooja')
      return
    }
    fetchService()
  }, [serviceId, router])

  const fetchService = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch('/api/pooja-services', {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }
      const services: PoojaService[] = await response.json()
      const selectedService = services.find(s => s.id === parseInt(serviceId!))
      setService(selectedService || null)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Error fetching service:', error)
      setService(null)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      // Remove any non-digit characters for validation
      const cleanPhone = formData.phone.replace(/\D/g, '')

      // Accept 10-digit numbers (with or without +91 prefix)
      if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
        // Valid 10-digit number starting with 6-9
      } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        // Valid 12-digit number starting with 91 (country code)
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        // Valid 11-digit number starting with 0
      } else {
        newErrors.phone = 'Please enter a valid phone number (10-digit or with +91)'
      }
    }

    
    if (!formData.date) {
      newErrors.date = 'Please select a date'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Cannot select past dates'
      }
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot'
    }

    if (!formData.nakshatra) {
      newErrors.nakshatra = 'Please select your Nakshatra'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    console.log('Service:', service)

    if (!validateForm()) {
      console.log('Form validation failed:', errors)
      return
    }

    console.log('Form validation passed, showing payment portal')
    setShowPayment(true)
  }

  const handlePaymentSuccess = (receiptNumber: string, paymentId: string) => {
    router.push(`/book-pooja/confirmation/${receiptNumber}`)
  }

  const handlePaymentError = (error: string) => {
    alert(error)
    setShowPayment(false)
  }

  const handleBackFromPayment = () => {
    setShowPayment(false)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Payment items for the portal
  const paymentItems: PaymentItem[] = service ? [
    {
      id: 'pooja_' + service.id + '_' + Date.now(),
      name: service.poojaName,
      description: service.description,
      amount: service.price,
      type: 'pooja',
      metadata: {
        poojaId: service.id,
        preferredDate: formData.date,
        preferredTime: formData.timeSlot,
        nakshatra: formData.nakshatra,
      },
    },
  ] : []

  // Show payment portal when form is submitted
  if (showPayment && service) {
    return (
      <PaymentPortal
        items={paymentItems}
        userInfo={{
          fullName: formData.name,
          phoneNumber: formData.phone,
        }}
        onBack={handleBackFromPayment}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="om-symbol text-3xl text-temple-maroon mb-4 animate-pulse">ॐ</div>
          <div className="w-10 h-10 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Preparing your booking form...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Service not found</p>
          <Link href="/book-pooja" className="text-temple-maroon hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-4xl py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/book-pooja"
            className="inline-flex items-center gap-2 text-temple-maroon hover:text-temple-gold transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back to Services</span>
          </Link>

          <div className="text-center">
            <div className="om-symbol text-2xl sm:text-3xl text-temple-maroon mb-2">
              ॐ
            </div>
            <h1 className="font-cinzel text-lg sm:text-2xl font-bold text-temple-maroon mb-1">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              Fill in your details to confirm the pooja service
            </p>
          </div>
        </div>

  
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-temple-gold/20 p-4 sm:p-6">
            <h3 className="font-semibold text-temple-maroon mb-4">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-temple-gold focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-temple-gold focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number (9876543210 or +919876543210)"
                    maxLength={15}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Star className="inline w-4 h-4 mr-1" />
                  Nakshatra (Birth Star) *
                </label>
                <select
                  value={formData.nakshatra}
                  onChange={(e) => handleInputChange('nakshatra', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-temple-gold focus:border-transparent ${
                    errors.nakshatra ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your Nakshatra</option>
                  {NAKSHATRAS.map(nakshatra => (
                    <option key={nakshatra} value={nakshatra}>{nakshatra}</option>
                  ))}
                </select>
                {errors.nakshatra && <p className="text-red-500 text-xs mt-1">{errors.nakshatra}</p>}
              </div>
            </div>
          </div>

          {/* Pooja Details */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-temple-gold/20 p-4 sm:p-6">
            <h3 className="font-semibold text-temple-maroon mb-4">Pooja Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-temple-gold focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Time Slot *
                </label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-temple-gold focus:border-transparent ${
                    errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select time slot</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
              </div>
            </div>

            </div>

          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-temple-cream to-orange-50 rounded-xl p-4 sm:p-6 border-2 border-temple-gold/20">
            <h3 className="font-semibold text-temple-maroon mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium text-temple-maroon">{service.poojaName}</span>
              </div>
              {formData.date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(formData.date).toLocaleDateString('en-IN')}</span>
                </div>
              )}
              {formData.timeSlot && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formData.timeSlot}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-temple-maroon">Total Amount:</span>
                  <div className="flex items-center gap-1 font-bold text-temple-maroon text-lg">
                    <IndianRupee className="w-5 h-5" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/book-pooja"
              className="flex-1 px-6 py-3 border-2 border-temple-maroon text-temple-maroon rounded-lg font-semibold hover:bg-temple-maroon hover:text-white transition-colors text-center"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-temple-maroon to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Proceed to Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BookingFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="om-symbol text-3xl text-temple-maroon mb-4 animate-pulse">ॐ</div>
          <div className="w-10 h-10 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <BookingFormPageContent />
    </Suspense>
  )
}