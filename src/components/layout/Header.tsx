'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback, memo } from 'react';
import { useTranslation } from '@/i18n/translation';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/FormComponents_clean';

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Helper function to get navigation link classes
  const getNavLinkClasses = (path: string, exact = false) => {
    const baseClasses = "px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out";
    const activeClasses = "text-blue-600";
    const inactiveClasses = "text-gray-700 hover:text-blue-600";
    
    return `${baseClasses} ${isActive(path, exact) ? activeClasses : inactiveClasses}`;
  };

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center transition-colors duration-200" prefetch={true}>
              <span className="text-xl font-bold text-blue-600 hover:text-blue-700">PropertyWorld</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block flex-1">
            <div className="flex items-center justify-center space-x-6">
              <Link 
                href="/" 
                className={getNavLinkClasses('/', true)}
                prefetch={true}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href="/properties" 
                className={getNavLinkClasses('/properties')}
                prefetch={true}
              >
                {t('navigation.properties')}
              </Link>
              <Link 
                href="/map" 
                className={getNavLinkClasses('/map')}
                prefetch={true}
              >
                {t('navigation.map_view')}
              </Link>
              <div className="relative group">
                <button className={`nav-item px-3 py-2 text-sm font-medium transition-all-normal hover-scale relative ${
                  isActive('/buy') ? 'text-blue-600 after:w-full' : 'text-gray-700 hover:text-blue-600 after:w-0'
                }`}>
                  {t('navigation.buy')}
                  <svg className="w-3 h-3 ml-1 inline transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all-normal transform group-hover:translateY-0 translateY-2 z-50 animate-fade-in">
                  <div className="py-1">
                    <Link href="/buy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium hover-lift transition-all-fast" prefetch={true}>🏡 {t('navigation.buy_home_portal')}</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/buy/calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast" prefetch={true}>💰 {t('navigation.mortgage_calculator')}</Link>
                    <Link href="/buy/guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast" prefetch={true}>📖 {t('navigation.buying_guide')}</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/properties?listing=sale&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast" prefetch={false}>{t('navigation.houses_for_sale')}</Link>
                    <Link href="/properties?listing=sale&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast" prefetch={false}>{t('navigation.apartments_for_sale')}</Link>
                    <Link href="/properties?listing=sale&type=townhouse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast" prefetch={false}>{t('navigation.townhouses_for_sale')}</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className={`nav-item px-3 py-2 text-sm font-medium transition-all-normal hover-scale relative ${
                  pathname.includes('listing=rent') ? 'text-blue-600 after:w-full' : 'text-gray-700 hover:text-blue-600 after:w-0'
                }`}>
                  {t('navigation.rent')}
                  <svg className="w-3 h-3 ml-1 inline transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all-normal transform group-hover:translateY-0 translateY-2 z-50 animate-fade-in">
                  <div className="py-1">
                    <Link href="/properties?listing=rent&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast">{t('navigation.houses_to_rent')}</Link>
                    <Link href="/properties?listing=rent&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast">{t('navigation.apartments_to_rent')}</Link>
                    <Link href="/properties?listing=rent&type=flat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover-lift transition-all-fast">{t('navigation.flats_to_rent')}</Link>
                  </div>
                </div>
              </div>
              <Link 
                href="/agents" 
                className={getNavLinkClasses('/agents')}
              >
                {t('navigation.find_agent')}
              </Link>
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:block flex-shrink-0">
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Link 
                href="/saved" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all-normal hover-scale whitespace-nowrap"
              >
                <svg className="w-4 h-4 inline mr-1 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {t('common.favorite')}
              </Link>
              
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all-normal hover-scale"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                      </span>
                    </div>
                    <span className="whitespace-nowrap">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                    <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 animate-fade-in">
                      <div className="py-1">
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4m4 4v-4m4 4v-4" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    {t('auth.sign_in')}
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="whitespace-nowrap">
                      {t('auth.sign_up')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-all-normal hover-scale p-2 rounded-md"
              aria-label="Toggle menu"
            >
              <svg className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t shadow-lg">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md transition-all-normal hover:bg-blue-50 ${isActive('/', true) ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu} 
                prefetch={true}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href="/properties" 
                className={`block px-3 py-2 rounded-md transition-all-normal hover:bg-blue-50 ${isActive('/properties') ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu} 
                prefetch={true}
              >
                {t('navigation.properties')}
              </Link>
              <Link 
                href="/buy" 
                className={`block px-3 py-2 rounded-md transition-all-normal hover:bg-blue-50 ${isActive('/buy') ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu} 
                prefetch={true}
              >
                {t('navigation.buy')}
              </Link>
              <Link 
                href="/properties?listing=rent" 
                className={`block px-3 py-2 rounded-md transition-all-normal hover:bg-blue-50 ${pathname.includes('listing=rent') ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu}
              >
                {t('navigation.rent')}
              </Link>
              <Link 
                href="/agents" 
                className={`block px-3 py-2 ${isActive('/agents') ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu}
              >
                {t('navigation.find_agent')}
              </Link>
              <Link 
                href="/saved" 
                className={`block px-3 py-2 ${isActive('/saved') ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`} 
                onClick={closeMenu}
              >
                {t('common.favorite')}
              </Link>
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 mx-3 rounded"></div>
              ) : user ? (
                <>
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" 
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" 
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors" 
                    onClick={closeMenu}
                  >
                    {t('auth.sign_in')}
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg mx-3 mt-2 text-center" 
                    onClick={closeMenu}
                  >
                    {t('auth.sign_up')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;