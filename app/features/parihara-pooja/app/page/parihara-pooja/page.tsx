'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/contexts/LanguageContext'
import { Button } from '@/shared/components/ui'

interface PariharaService {
  id: number
  poojaName: string
  displayOrder: number
}

export default function PariharaPoojaPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [services, setServices] = useState<PariharaService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string>('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      // Updated list of pooja services - simplified
      const pariharaServices: PariharaService[] = [
        { id: 1, poojaName: "Ganahoma", displayOrder: 1 },
        { id: 2, poojaName: "Satyanarayana Pooja", displayOrder: 2 },
        { id: 3, poojaName: "Sarvamoolamantra Homa", displayOrder: 3 },
        { id: 4, poojaName: "Sarvatarayamantra Homa", displayOrder: 4 },
        { id: 5, poojaName: "Navagraha Homa", displayOrder: 5 },
        { id: 6, poojaName: "Navagraha Sandhi Homa", displayOrder: 6 },
        { id: 7, poojaName: "Vayusthuthi Homa", displayOrder: 7 },
        { id: 8, poojaName: "Narasimhastuthi Homa", displayOrder: 8 },
        { id: 9, poojaName: "Shivasthuthi Homa", displayOrder: 9 },
        { id: 10, poojaName: "Durga Homa", displayOrder: 10 },
        { id: 11, poojaName: "Mruthyunjaya Homa", displayOrder: 11 },
        { id: 12, poojaName: "Dhanvantari Homa", displayOrder: 12 },
        { id: 13, poojaName: "Vaastu Homa", displayOrder: 13 },
        { id: 14, poojaName: "Rakshogna Homa", displayOrder: 14 },
        { id: 15, poojaName: "Sudharshana Homa", displayOrder: 15 },
        { id: 16, poojaName: "Aghora Homa", displayOrder: 16 },
        { id: 17, poojaName: "Bhoovaraha Homa", displayOrder: 17 },
        { id: 18, poojaName: "Panchamarista Shanthi", displayOrder: 18 },
        { id: 19, poojaName: "Balarista Shanthi", displayOrder: 19 },
        { id: 20, poojaName: "Aikyamatyasukta Homa", displayOrder: 20 },
        { id: 21, poojaName: "Pavamana Homa", displayOrder: 21 },
        { id: 22, poojaName: "Rudra Homa", displayOrder: 22 },
        { id: 23, poojaName: "Narasimhamoola Mantra Homa", displayOrder: 23 },
        { id: 24, poojaName: "Vanadurga Homa", displayOrder: 24 },
        { id: 25, poojaName: "Manyusukta Homa", displayOrder: 25 },
        { id: 26, poojaName: "Swayamvaraparvathi Homa", displayOrder: 26 },
        { id: 27, poojaName: "Durga Namaskara", displayOrder: 27 },
        { id: 28, poojaName: "Ashlesha Bali Pooja", displayOrder: 28 },
        { id: 29, poojaName: "Balaganapathi Homa", displayOrder: 29 },
        { id: 30, poojaName: "Hayagreeva Mantra Homa", displayOrder: 30 },
        { id: 31, poojaName: "Saraswathi Mantra Homa", displayOrder: 31 },
        { id: 32, poojaName: "Chandika Yaga", displayOrder: 32 },
        { id: 33, poojaName: "Raghavendramoolamantra Homa", displayOrder: 33 },
        { id: 34, poojaName: "Shani Shanthi", displayOrder: 34 },
        { id: 35, poojaName: "Srisuktha Homa", displayOrder: 35 },
        { id: 36, poojaName: "Dakshinamurthy Mantra Homa", displayOrder: 36 }
      ]
      setServices(pariharaServices)
    } catch (error) {
      console.error('Error fetching parihara services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value
    setSelectedService(serviceId)
  }

  const handleBookNow = () => {
    if (selectedService) {
      // Navigate to booking form with selected service
      router.push(`/parihara-pooja/form?service=${selectedService}`)
    }
  }

  
  const handleCallNow = () => {
    // Temple phone number
    window.open('tel:+917760118171', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-red-50">
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
            {/* Sri Raghavendra Swamy Logo */}
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
              Parihara Pooja Services
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Sacred remedies to overcome planetary doshas and remove life obstacles
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
              <div className="text-base sm:text-xl text-temple-gold">✦</div>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
            </div>
          </div>
        </div>

        {/* Important Information - Moved to Top */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-red-200 mb-6">
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-temple-maroon mb-3 text-center">
            Important Information
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-temple-maroon font-bold text-xs">!</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold">Consultation Required:</span> For complex doshas, we recommend a personal consultation before booking.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-temple-maroon font-bold text-xs">!</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="font-semibold">Timing:</span> Parihara poojas are performed on auspicious days based on planetary positions.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleCallNow}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-temple-gold to-temple-gold/80 text-temple-maroon rounded-lg font-semibold hover:from-temple-gold/90 hover:to-temple-gold/70 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap border border-temple-gold/30"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              Call Now
            </button>
          </div>
        </div>

        {/* Services Dropdown */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-temple-maroon border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading parihara services...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-temple-gold/20 overflow-hidden">
            {/* Top Accent */}
            <div className="h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

            <div className="p-6 sm:p-8">
              
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-temple-maroon mb-6 text-center">
                Select a Pooja Service
              </h2>

              {/* Dropdown Select */}
              <div className="mb-6">
                <select
                  value={selectedService}
                  onChange={handleSelectService}
                  className="w-full px-4 py-3 rounded-xl border-2 border-temple-gold/20 focus:border-temple-gold focus:outline-none transition-colors text-gray-700 bg-white leading-loose"
                  style={{ lineHeight: '2' }}
                >
                  <option value="" style={{ padding: '8px 0' }}>Choose a pooja service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id} style={{ padding: '8px 0' }}>
                      {service.poojaName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedService}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                Book Parihara Pooja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}