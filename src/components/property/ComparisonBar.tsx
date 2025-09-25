'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useComparison } from '@/contexts/ComparisonContext';
import { formatPrice } from '@/lib/utils';

export default function ComparisonBar() {
  const { comparedProperties, removeFromComparison, clearComparison, comparisonCount } = useComparison();

  if (comparisonCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Selected properties */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900 mr-4">
                Compare Properties ({comparisonCount}/3)
              </h3>
            </div>
            
            {/* Property thumbnails */}
            <div className="flex space-x-3">
              {comparedProperties.map((property) => (
                <div key={property.id} className="relative group">
                  <div className="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden mr-3">
                      <Image
                        src={property.images[0]?.url || '/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {property.title}
                      </p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromComparison(property.id)}
                      className="ml-2 p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${property.title} from comparison`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add more placeholder if less than 3 */}
              {comparisonCount < 3 && (
                <div className="flex items-center justify-center w-20 h-16 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-xs text-gray-500">Add more</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Clear All
            </button>
            
            <Link
              href="/compare"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}