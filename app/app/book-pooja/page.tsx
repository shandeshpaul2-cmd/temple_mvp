'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, IndianRupee, Clock, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'

interface PoojaService {
  id: number
  poojaName: string
  description: string
  price: number
  displayOrder: number
}

export default function BookPoojaPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [services, setServices] = useState<PoojaService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<number | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/pooja-services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectService = (serviceId: number) => {
    setSelectedService(serviceId)
    // Navigate to booking form with selected service
    router.push(`/book-pooja/form?service=${serviceId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-4xl py-4 sm:py-6">
        {/* Header - Compact */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-temple-maroon hover:text-temple-gold transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back to Home</span>
          </Link>

          <div className="text-center">
            {/* Sri Raghavendra Swamy Logo - Cropped to remove text */}
            <div className="mb-2">
              <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto overflow-hidden rounded-full drop-shadow-lg">
                <img
                  src="/sri-raghavendra-logo.png"
                  alt="Sri Raghavendra Swamy"
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 35%' }}
                />
              </div>
            </div>

            <h1 className="font-cinzel text-xl sm:text-3xl font-bold text-temple-maroon mb-1 sm:mb-2">
              Book a Pooja Service
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Choose from our sacred pooja services
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-base sm:text-xl text-temple-gold">✦</div>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
            </div>
          </div>
        </div>

        {/* Information Section - Compact */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-temple-gold/20 p-4 sm:p-6 mb-6">
          <h2 className="font-cinzel text-base sm:text-xl font-bold text-temple-maroon mb-3 sm:mb-4 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <span className="text-temple-maroon font-bold text-sm sm:text-base">1</span>
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs sm:text-sm">Select</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">Choose your pooja</p>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <span className="text-temple-maroon font-bold text-sm sm:text-base">2</span>
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs sm:text-sm">Fill Details</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">Add your info</p>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-temple-gold/20 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
                <span className="text-temple-maroon font-bold text-sm sm:text-base">3</span>
              </div>
              <h3 className="font-semibold text-temple-maroon mb-1 text-xs sm:text-sm">Confirmed</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">Get confirmation</p>
            </div>
          </div>
        </div>

        {/* Services List - Compact Design */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading services...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-temple-gold/20 overflow-hidden">
            {/* Top Accent */}
            <div className="h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

            {/* Services List */}
            <div className="divide-y divide-gray-100">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group hover:bg-temple-cream/30 transition-all duration-200 cursor-pointer"
                  onClick={() => handleSelectService(service.id)}
                >
                  <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    {/* Number Badge */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-temple-gold/30 transition-colors">
                      <span className="text-temple-maroon font-bold text-sm sm:text-base">{index + 1}</span>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-temple-maroon mb-0.5 sm:mb-1 group-hover:text-temple-gold transition-colors truncate">
                        {service.poojaName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-temple-maroon font-semibold">
                          <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{service.price.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-temple-maroon to-red-700 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm group-hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
