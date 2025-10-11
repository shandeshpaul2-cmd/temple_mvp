'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, User, Phone, Mail, MapPin, IndianRupee, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'
import { useRazorpay } from '@/hooks/useRazorpay'

export default function DonatePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { isLoaded, openRazorpay } = useRazorpay()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    amount: '',
    donationPurpose: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSuccess = async (razorpayResponse: any, donationId: string) => {
    try {
      // Verify payment with backend
      const response = await fetch('/api/donations/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          donationId,
          donorInfo: formData,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Navigate to success page with receipt number
        router.push(`/donate/success?receipt=${data.receiptNumber}&id=${data.donationId}`)
      } else {
        alert('Payment verification failed. Please contact support.')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      alert('Something went wrong. Please contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!isLoaded) {
      alert('Payment gateway is loading. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      // Create Razorpay order
      const response = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          donorInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Open Razorpay checkout
      openRazorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: data.amount,
        currency: data.currency,
        name: 'Guru Seva Mandali',
        description: `Donation to ${t.templeName}`,
        order_id: data.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        theme: {
          color: '#8B0000',
        },
        handler: (response: any) => {
          handlePaymentSuccess(response, data.donationId)
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50">
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
            {/* Om Symbol */}
            <div className="om-symbol text-5xl text-temple-maroon mb-4 drop-shadow-lg">
              ॐ
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-temple-maroon mb-2">
              Make a Donation
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Support {t.templeName} with your generous contribution
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-xl text-temple-gold">✦</div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
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
                  icon={<User className="w-5 h-5 text-gray-400" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={errors.phoneNumber}
                    required
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                  />

                  <Input
                    label="Email (Optional)"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    icon={<MapPin className="w-5 h-5 text-gray-400" />}
                  />

                  <Input
                    label="State"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Donation Details Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-temple-maroon mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                Donation Details
              </h2>

              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-temple-maroon">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                        errors.amount
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-temple-gold'
                      } focus:outline-none transition-colors text-lg font-semibold`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                  )}

                  {/* Suggested Amounts */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[101, 201, 501, 1001, 2001, 5001].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                        className="px-4 py-2 rounded-lg border-2 border-temple-gold/30 text-temple-maroon font-semibold hover:bg-temple-gold/10 hover:border-temple-gold transition-all text-sm sm:text-base"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <TextArea
                  label="Purpose of Donation (Optional)"
                  name="donationPurpose"
                  placeholder="Tell us what inspires your donation..."
                  value={formData.donationPurpose}
                  onChange={handleInputChange}
                  rows={3}
                  icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-temple-cream/30 rounded-xl p-4 border border-temple-gold/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                🕉️ <span className="font-semibold">Your contribution matters:</span> After successful payment,
                you'll receive an instant digital receipt and a beautiful certificate via WhatsApp. Join our devotee
                community and receive temple updates and blessings.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Proceed to Payment
                  </span>
                )}
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Secure payment powered by Razorpay
              </p>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-temple-gold/20">
          <h3 className="font-cinzel text-lg font-bold text-temple-maroon mb-4 text-center">
            What You'll Receive
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📧</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Instant Receipt</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📜</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Certificate via WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🙏</span>
              </div>
              <p className="text-sm font-medium text-gray-700">Temple Blessings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
