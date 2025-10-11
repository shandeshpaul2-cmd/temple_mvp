'use client'

import { MapPin, Navigation, Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function LocationCard() {
  const { t } = useLanguage()
  const googleMapsLink = 'https://maps.app.goo.gl/fbso1qvzNyBAzFio6?g_st=aw'
  const googleMapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8982647891974!2d77.62139407507656!3d12.981506787341771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a9f6b6b6b7%3A0x1234567890abcdef!2sGuru%20Seva%20Mandali!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin'

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-temple-maroon" />
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-temple-maroon">
            {t.location}
          </h3>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm">
          Visit us at our temple
        </p>
      </div>

      {/* Map Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-temple-gold/20 overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

        {/* Map Container */}
        <div className="relative w-full h-48 sm:h-64 bg-gray-100">
          <iframe
            src={googleMapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Address & Actions Section */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-temple-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-temple-maroon" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-temple-maroon text-sm sm:text-base mb-1">
                  {t.templeName}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {t.address}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Get Directions Button */}
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-temple-maroon to-red-700 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Directions</span>
            </a>

            {/* Call Button */}
            <a
              href="tel:+919902820105"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-temple-gold to-yellow-500 text-temple-maroon rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Temple Timings */}
          <div className="bg-temple-cream/30 rounded-xl p-3 sm:p-4 border border-temple-gold/20">
            <p className="font-semibold text-temple-maroon text-xs sm:text-sm mb-2">
              🕉️ Temple Timings
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
              <div>
                <span className="font-medium">Morning:</span>
                <span className="ml-1">6:00 AM - 12:00 PM</span>
              </div>
              <div>
                <span className="font-medium">Evening:</span>
                <span className="ml-1">4:00 PM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
