'use client';

interface SearchSkeletonProps {
  readonly className?: string;
}

export default function SearchSkeleton({ className = '' }: SearchSkeletonProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location Skeleton */}
        <div className="space-y-2">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Property Type Skeleton */}
        <div className="space-y-2">
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Price Range Skeleton */}
        <div className="space-y-2">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Bedrooms Skeleton */}
        <div className="space-y-2">
          <div className="w-18 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Search Button Skeleton */}
        <div className="flex items-end">
          <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Filter Toggles Skeleton */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="w-20 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-18 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}