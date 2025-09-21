'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">PropertyWorld</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/properties" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Properties
              </Link>
              <Link 
                href="/map" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Map View
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Buy
                  <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link href="/buy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium">🏡 Buy Home Portal</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/buy/calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">💰 Mortgage Calculator</Link>
                    <Link href="/buy/guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📖 Buying Guide</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/properties?listing=sale&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Houses for Sale</Link>
                    <Link href="/properties?listing=sale&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Apartments for Sale</Link>
                    <Link href="/properties?listing=sale&type=townhouse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Townhouses for Sale</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  Rent
                  <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link href="/properties?listing=rent&type=house" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Houses to Rent</Link>
                    <Link href="/properties?listing=rent&type=apartment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Apartments to Rent</Link>
                    <Link href="/properties?listing=rent&type=flat" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Flats to Rent</Link>
                  </div>
                </div>
              </div>
              <Link 
                href="/agents" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Find an Agent
              </Link>
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link 
                href="/saved" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved
              </Link>
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/properties" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Properties</Link>
              <Link href="/buy" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Buy</Link>
              <Link href="/properties?listing=rent" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Rent</Link>
              <Link href="/agents" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Find an Agent</Link>
              <Link href="/saved" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Saved Properties</Link>
              <Link href="/login" className="block px-3 py-2 bg-blue-600 text-white rounded-lg">Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}