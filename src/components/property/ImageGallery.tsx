'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/types/property';
import { Button } from '@/components/ui/FormComponents';

interface ImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
  className?: string;
}

interface FullscreenViewerProps {
  images: PropertyImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  propertyTitle: string;
}

// Fullscreen Image Viewer Component
function FullscreenViewer({
  images,
  currentIndex,
  onClose,
  onNavigate,
  propertyTitle
}: FullscreenViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
        break;
    }
  }, [currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h2 className="text-lg font-semibold truncate max-w-md">
              {propertyTitle}
            </h2>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
            aria-label="Close gallery"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-16">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="text-white text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Failed to load image</p>
          </div>
        ) : (
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className="object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setImageError(true);
            }}
            priority
            sizes="100vw"
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={handlePrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3"
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-3"
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex justify-center">
            <div className="flex space-x-2 max-w-full overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onNavigate(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Image Gallery Component
export default function ImageGallery({ images, propertyTitle, className = '' }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});

  // Sort images by order and ensure primary image is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const navigateToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  if (!sortedImages.length) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-8">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const mainImage = sortedImages[0];
  const thumbnailImages = sortedImages.slice(1);

  return (
    <>
      <div className={`${className}`}>
        {/* Main Image */}
        <div className="relative group mb-4">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            {imageLoading[0] !== false && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            )}
            
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              onClick={() => openFullscreen(0)}
              onLoad={() => handleImageLoad(0)}
              onError={() => handleImageError(0)}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image Counter Overlay */}
            {sortedImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                1 / {sortedImages.length}
              </div>
            )}

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              onClick={() => openFullscreen(0)}
              className="absolute bottom-4 right-4 bg-black/50 text-white hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="View fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Thumbnails Grid */}
        {thumbnailImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {thumbnailImages.slice(0, 3).map((image, index) => {
              const actualIndex = index + 1;
              return (
                <div key={image.id} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {imageLoading[actualIndex] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      </div>
                    )}
                    
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                      onClick={() => openFullscreen(actualIndex)}
                      onLoad={() => handleImageLoad(actualIndex)}
                      onError={() => handleImageError(actualIndex)}
                      sizes="(max-width: 768px) 25vw, 150px"
                    />
                  </div>
                </div>
              );
            })}

            {/* More Images Button */}
            {thumbnailImages.length > 3 && (
              <button
                onClick={() => openFullscreen(4)}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-900/80 text-white flex items-center justify-center hover:bg-gray-900/90 transition-colors group"
              >
                <div className="text-center">
                  <span className="text-lg font-semibold">+{thumbnailImages.length - 3}</span>
                  <p className="text-xs mt-1">More</p>
                </div>
                {thumbnailImages[3] && (
                  <Image
                    src={thumbnailImages[3].url}
                    alt="More images"
                    fill
                    className="object-cover opacity-30 group-hover:opacity-20 transition-opacity"
                    sizes="150px"
                  />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Viewer */}
      {isFullscreenOpen && (
        <FullscreenViewer
          images={sortedImages}
          currentIndex={currentIndex}
          onClose={closeFullscreen}
          onNavigate={navigateToImage}
          propertyTitle={propertyTitle}
        />
      )}
    </>
  );
}