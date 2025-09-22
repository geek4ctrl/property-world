'use client';

import Link from 'next/link';
import { useState, useCallback, memo } from 'react';
import { useTranslation } from '@/i18n/translation';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" prefetch={true}>
              <span className="text-xl font-bold text-blue-600">PropertyWorld</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block flex-1">
            <div className="flex items-center justify-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                prefetch={true}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href="/properties" 
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                prefetch={true}
              >
                {t('navigation.properties')}
              </Link>
              <Link 
                href="/map" 
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                prefetch={true}
              >
                {t('navigation.map_view')}
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                  {t('navigation.buy')}
                  <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/buy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium" prefetch={true}>🏡 {t('navigation.buy_home_portal')}</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/buy/calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={true}>💰 {t('navigation.mortgage_calculator')}</Link>
                    <Link href="/buy/guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={true}>📖 {t('navigation.buying_guide')}</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/properties?listing=sale&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>{t('navigation.houses_for_sale')}</Link>
                    <Link href="/properties?listing=sale&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>{t('navigation.apartments_for_sale')}</Link>
                    <Link href="/properties?listing=sale&type=townhouse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>{t('navigation.townhouses_for_sale')}</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                  {t('navigation.rent')}
                  <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/properties?listing=rent&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('navigation.houses_to_rent')}</Link>
                    <Link href="/properties?listing=rent&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('navigation.apartments_to_rent')}</Link>
                    <Link href="/properties?listing=rent&type=flat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('navigation.flats_to_rent')}</Link>
                  </div>
                </div>
              </div>
              <Link 
                href="/agents" 
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {t('navigation.find_agent')}
              </Link>
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:block flex-shrink-0">
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Link 
                href="/saved" 
                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {t('common.favorite')}
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {t('navigation.sign_in')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu} prefetch={true}>{t('navigation.home')}</Link>
              <Link href="/properties" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu} prefetch={true}>{t('navigation.properties')}</Link>
              <Link href="/buy" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu} prefetch={true}>{t('navigation.buy')}</Link>
              <Link href="/properties?listing=rent" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu}>{t('navigation.rent')}</Link>
              <Link href="/agents" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu}>{t('navigation.find_agent')}</Link>
              <Link href="/saved" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={closeMenu}>{t('common.favorite')}</Link>
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              <Link href="/login" className="block px-3 py-2 bg-blue-600 text-white rounded-lg" onClick={closeMenu}>{t('navigation.sign_in')}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;