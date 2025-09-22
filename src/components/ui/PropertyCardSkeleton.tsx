'use client';

interface PropertyCardSkeletonProps {
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'featured';
}

export default function PropertyCardSkeleton({ className = '', variant = 'default' }: PropertyCardSkeletonProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${
      isFeatured 
        ? 'shadow-xl border-2 border-gray-200' 
        : 'shadow-md border border-gray-200'
    } ${className}`}>
      {/* Image Skeleton */}
      <div className={`relative bg-gray-200 animate-pulse ${
        isCompact ? 'aspect-[3/2]' : 'aspect-[4/3]'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Badge Skeletons */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          {isFeatured && (
            <div className="w-20 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          )}
        </div>
        
        {/* Favorite Button Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Image Navigation Skeletons */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Image Counter Skeleton */}
        <div className="absolute bottom-3 right-3">
          <div className="w-12 h-5 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-24 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-16 h-5 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="w-3/4 h-5 bg-gray-300 rounded animate-pulse"></div>
          {!isCompact && (
            <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
          )}
        </div>
        
        {/* Location Skeleton */}
        <div className="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
        
        {/* Property Details Skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-4">
            {/* Bedrooms */}
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
            {/* Bathrooms */}
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-6 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
            {/* Square meters */}
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* View Details Button Skeleton */}
          <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Agent Info Skeleton (for featured cards) */}
        {isFeatured && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse mb-1"></div>
                <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}