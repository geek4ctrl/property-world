'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useComparison } from '@/contexts/ComparisonContext';
import { formatPrice } from '@/lib/utils';
import { PropertyErrorBoundary } from '@/components/ui/SpecializedErrorBoundaries';

export default function ComparePage() {
  const { comparedProperties, removeFromComparison, clearComparison, comparisonCount } = useComparison();
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<Record<string, number>>({});

  const handleImageChange = (propertyId: string, index: number) => {
    setSelectedImageIndexes(prev => ({
      ...prev,
      [propertyId]: index
    }));
  };

  if (comparisonCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">No Properties to Compare</h1>
              <p className="text-gray-600 mb-8">
                You haven't selected any properties to compare yet. Browse our listings and click the compare button on properties you're interested in.
              </p>
              <Link 
                href="/properties"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Comparison</h1>
              <p className="text-gray-600">
                Comparing {comparisonCount} {comparisonCount === 1 ? 'property' : 'properties'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={clearComparison}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear All
              </button>
              <Link
                href="/properties"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>

        <PropertyErrorBoundary>
          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <td className="sticky left-0 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Property Details
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4 min-w-80">
                        <div className="text-center">
                          <button
                            onClick={() => removeFromComparison(property.id)}
                            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium transition-colors mb-2"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Property Images */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Images
                    </td>
                    {comparedProperties.map((property) => {
                      const currentImageIndex = selectedImageIndexes[property.id] || 0;
                      const currentImage = property.images[currentImageIndex] || property.images[0];
                      
                      return (
                        <td key={property.id} className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                              <Image
                                src={currentImage?.url || '/placeholder-property.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="320px"
                              />
                              {property.images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between p-2">
                                  <button
                                    onClick={() => handleImageChange(
                                      property.id,
                                      currentImageIndex === 0 ? property.images.length - 1 : currentImageIndex - 1
                                    )}
                                    className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleImageChange(
                                      property.id,
                                      currentImageIndex === property.images.length - 1 ? 0 : currentImageIndex + 1
                                    )}
                                    className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            {property.images.length > 1 && (
                              <div className="text-center text-sm text-gray-500">
                                {currentImageIndex + 1} of {property.images.length}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Property Title */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Title
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                        >
                          {property.title}
                        </Link>
                      </td>
                    ))}
                  </tr>

                  {/* Price */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Price
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(property.price)}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Location */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Location
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        <div className="text-gray-900">
                          {property.address.suburb}, {property.address.city}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.address.province}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Type
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4 capitalize">
                        {property.propertyType.replace('_', ' ').toLowerCase()}
                      </td>
                    ))}
                  </tr>

                  {/* Bedrooms */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Bedrooms
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        {property.bedrooms || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Bathrooms */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Bathrooms
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        {property.bathrooms || 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Size */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Size
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        {property.squareMeters ? `${property.squareMeters} m²` : 'N/A'}
                      </td>
                    ))}
                  </tr>

                  {/* Features */}
                  <tr className="bg-gray-50">
                    <td className="sticky left-0 bg-gray-50 px-6 py-4 font-medium text-gray-900 border-r border-gray-200 align-top">
                      Features
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        <div className="space-y-1">
                          {property.features.map((feature) => (
                            <div key={feature} className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="sticky left-0 bg-white px-6 py-4 font-medium text-gray-900 border-r border-gray-200">
                      Actions
                    </td>
                    {comparedProperties.map((property) => (
                      <td key={property.id} className="px-6 py-4">
                        <div className="space-y-2">
                          <Link
                            href={`/properties/${property.id}`}
                            className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
                          >
                            View Details
                          </Link>
                          <button className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                            Contact Agent
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </PropertyErrorBoundary>
      </div>
      
      <Footer />
    </div>
  );
}