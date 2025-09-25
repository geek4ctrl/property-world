'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/property/ImageGallery';
import PropertyImageCarousel from '@/components/property/PropertyImageCarousel';
import { sampleProperties } from '@/data/sampleProperties';
import { Button } from '@/components/ui/FormComponents';

export default function GalleryDemo() {
  const [selectedProperty, setSelectedProperty] = useState(sampleProperties[0]);
  const [currentDemo, setCurrentDemo] = useState<'gallery' | 'carousel'>('gallery');

  const propertyOptions = sampleProperties.slice(0, 3); // First 3 properties for demo

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Gallery Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our enhanced image gallery with full-screen viewing, thumbnail navigation, 
            and responsive design. Perfect for showcasing property photos.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Selector */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose Property</h3>
              <div className="space-y-2">
                {propertyOptions.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedProperty.id === property.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🏠</div>
                      <div>
                        <div className="font-medium">{property.title}</div>
                        <div className="text-sm text-gray-500">
                          {property.images.length} images
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Type Selector */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Gallery Type</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentDemo('gallery')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    currentDemo === 'gallery'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🖼️</div>
                    <div>
                      <div className="font-medium">Full Image Gallery</div>
                      <div className="text-sm text-gray-500">
                        With fullscreen viewer & thumbnails
                      </div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentDemo('carousel')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    currentDemo === 'carousel'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🔄</div>
                    <div>
                      <div className="font-medium">Property Card Carousel</div>
                      <div className="text-sm text-gray-500">
                        Compact version for property cards
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              {currentDemo === 'gallery' ? 'Full Image Gallery' : 'Property Card Carousel'}
            </h2>
            
            {currentDemo === 'gallery' ? (
              <ImageGallery
                images={selectedProperty.images}
                propertyTitle={selectedProperty.title}
                className="w-full"
              />
            ) : (
              <PropertyImageCarousel
                images={selectedProperty.images}
                propertyTitle={selectedProperty.title}
                className="w-full"
                onImageClick={(index) => alert(`Clicked image ${index + 1}`)}
              />
            )}
          </div>

          {/* Features List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Gallery Features</h2>
            
            <div className="space-y-4">
              {currentDemo === 'gallery' ? (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Full-Screen Viewer</div>
                      <div className="text-gray-600 text-sm">
                        Click on any image to open in fullscreen mode
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Keyboard Navigation</div>
                      <div className="text-gray-600 text-sm">
                        Use arrow keys and Escape in fullscreen mode
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Thumbnail Strip</div>
                      <div className="text-gray-600 text-sm">
                        Quick navigation in fullscreen viewer
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Loading States</div>
                      <div className="text-gray-600 text-sm">
                        Smooth loading animations and error handling
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Hover Navigation</div>
                      <div className="text-gray-600 text-sm">
                        Arrow buttons appear on hover
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Image Counter</div>
                      <div className="text-gray-600 text-sm">
                        Shows current image position
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Dot Indicators</div>
                      <div className="text-gray-600 text-sm">
                        For properties with 5 or fewer images
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <div className="font-semibold">Click to Expand</div>
                      <div className="text-gray-600 text-sm">
                        Callback for opening full gallery
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex items-start space-x-3">
                <div className="text-green-600 mt-1">✅</div>
                <div>
                  <div className="font-semibold">Responsive Design</div>
                  <div className="text-gray-600 text-sm">
                    Optimized for all screen sizes
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-green-600 mt-1">✅</div>
                <div>
                  <div className="font-semibold">Accessibility</div>
                  <div className="text-gray-600 text-sm">
                    Full keyboard support and ARIA labels
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-2">Current Property</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Title:</strong> {selectedProperty.title}</div>
                <div><strong>Type:</strong> {selectedProperty.propertyType}</div>
                <div><strong>Images:</strong> {selectedProperty.images.length}</div>
                <div><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</div>
                <div><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                Full Image Gallery
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Click main image to open fullscreen viewer</div>
                <div>• Navigate with arrow keys or click arrows</div>
                <div>• Click thumbnails to jump to specific images</div>
                <div>• Press Escape to close fullscreen</div>
                <div>• Click backdrop to close fullscreen</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">
                Property Card Carousel
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Hover to reveal navigation arrows</div>
                <div>• Click arrows to navigate images</div>
                <div>• Click dots to jump to specific image</div>
                <div>• Click image to trigger custom action</div>
                <div>• Perfect for property listing cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}