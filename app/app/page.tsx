'use client'

import Link from 'next/link'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { LocationCard } from '@/components/shared/LocationCard'
import { ArrowRight, Phone, MapPin, Heart, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        {/* Admin Login and Language Selector */}
        <div className="flex justify-between items-center pt-3">
          <Link
            href="/admin/login"
            className="flex items-center justify-center w-8 h-8 text-temple-maroon hover:text-temple-gold transition-colors border border-temple-maroon/30 hover:border-temple-gold/50 rounded-md"
            title="Admin Login"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
          </Link>
          <LanguageSelector />
        </div>

        {/* Compact Hero Section */}
        <header className="text-center pt-4 pb-6 sm:pt-8 sm:pb-10">
          {/* Sri Raghavendra Swamy Logo - Cropped to remove text */}
          <div className="mb-3 sm:mb-4">
            <div className="w-24 h-24 sm:w-36 sm:h-36 mx-auto overflow-hidden rounded-full drop-shadow-lg">
              <img
                src="/sri-raghavendra-logo.png"
                alt="Sri Raghavendra Swamy"
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center 35%' }}
              />
            </div>
          </div>

          {/* Temple Title */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold text-temple-maroon leading-tight px-2">
              {t.templeDeity}
            </h1>
            <p className="text-lg sm:text-2xl text-temple-gold font-semibold">
              {t.templeName}
            </p>
            <p className="text-sm sm:text-lg text-gray-600 font-medium">
              {t.templeSubtitle}
            </p>
          </div>

          {/* Address */}
          <div className="flex items-start justify-center gap-1.5 text-gray-600 mt-3 max-w-2xl mx-auto px-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] sm:text-sm text-left leading-snug">
              {t.address}
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 my-4 sm:my-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
            <div className="text-base sm:text-xl text-temple-gold">✦</div>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
          </div>
        </header>

        {/* Services Section - Mobile Optimized */}
        <main className="pb-8 sm:pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-cinzel font-bold text-temple-maroon mb-1 sm:mb-2">
                {t.ourServices}
              </h2>
              <p className="text-gray-600 text-xs sm:text-base">{t.chooseService}</p>
            </div>

            {/* Service Cards - 2 Columns on Mobile */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 px-2 sm:px-4 mb-8 sm:mb-16">
              {/* Donation Service */}
              <Link href="/donate" className="group block">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-temple-cream p-3 sm:p-8 border border-temple-gold/20 sm:border-2 hover:border-temple-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                  {/* Top Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

                  {/* Icon Circle */}
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-temple-maroon to-red-700 rounded-full flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Heart className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 sm:space-y-3">
                    <h3 className="font-cinzel text-base sm:text-3xl font-bold text-temple-maroon text-center">
                      {t.donation}
                    </h3>

                    <p className="text-gray-700 text-[10px] sm:text-base leading-snug sm:leading-relaxed hidden sm:block">
                      {t.donationDesc}
                    </p>

                    {/* Features - Hidden on mobile, shown on desktop */}
                    <div className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 hidden sm:block">
                      {t.donationFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <div className="w-1 h-1 rounded-full bg-temple-gold"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-2 sm:pt-4">
                      <div className="inline-flex items-center gap-1 sm:gap-2 text-temple-maroon font-semibold text-xs sm:text-lg group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                        <span className="hidden sm:inline">{t.makeDonation}</span>
                        <span className="sm:hidden text-[11px]">Donate</span>
                        <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-28 sm:h-28 bg-temple-gold/10 rounded-full blur-2xl"></div>
                </div>
              </Link>

              {/* Pooja Booking Service */}
              <Link href="/book-pooja" className="group block">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-orange-50 p-3 sm:p-8 border border-temple-gold/20 sm:border-2 hover:border-temple-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                  {/* Top Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-temple-maroon via-temple-gold to-temple-maroon"></div>

                  {/* Icon Circle */}
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-temple-gold to-yellow-600 rounded-full flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto">
                    <Calendar className="w-6 h-6 sm:w-10 sm:h-10 text-temple-maroon" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 sm:space-y-3">
                    <h3 className="font-cinzel text-base sm:text-3xl font-bold text-temple-maroon text-center">
                      {t.bookPooja}
                    </h3>

                    <p className="text-gray-700 text-[10px] sm:text-base leading-snug sm:leading-relaxed hidden sm:block">
                      {t.bookPoojaDesc}
                    </p>

                    {/* Features - Hidden on mobile, shown on desktop */}
                    <div className="space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 hidden sm:block">
                      {t.poojaFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <div className="w-1 h-1 rounded-full bg-temple-gold"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-2 sm:pt-4">
                      <div className="inline-flex items-center gap-1 sm:gap-2 text-temple-maroon font-semibold text-xs sm:text-lg group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                        <span className="hidden sm:inline">{t.bookAPuja}</span>
                        <span className="sm:hidden text-[11px]">Book</span>
                        <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-28 sm:h-28 bg-temple-maroon/10 rounded-full blur-2xl"></div>
                </div>
              </Link>
            </div>

            {/* Location Section */}
            <div className="px-2 sm:px-4 mb-8 sm:mb-16">
              <LocationCard />
            </div>
          </div>
        </main>

        {/* Compact Footer */}
        <footer className="border-t border-temple-gold/20 py-6 sm:py-10">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <div className="text-center space-y-3 sm:space-y-4">
              <h3 className="font-cinzel text-base sm:text-xl font-semibold text-temple-maroon">
                {t.contactUs}
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
                {/* Phone */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-temple-gold/20 rounded-full flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-temple-maroon" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] sm:text-xs text-gray-500">{t.phone}</p>
                    <div className="flex gap-1 sm:gap-1.5 text-temple-maroon font-semibold text-xs sm:text-sm">
                      <a href="tel:+919902820105" className="hover:underline">99028 20105</a>
                      <span>/</span>
                      <a href="tel:+917019337306" className="hover:underline">70193 37306</a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-temple-gold/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-temple-maroon" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] sm:text-xs text-gray-500">{t.location}</p>
                    <p className="text-temple-maroon font-semibold text-xs sm:text-sm">Halasuru, Bangalore</p>
                  </div>
                </div>
              </div>

              {/* Temple Motto */}
              <div className="pt-3 sm:pt-4 border-t border-temple-gold/20">
                <p className="text-temple-maroon font-medium text-xs sm:text-base mb-0.5">
                  🕉️ {t.motto}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  {t.tagline}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
