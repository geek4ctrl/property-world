'use client';

interface MapSidebarSkeletonProps {
  readonly className?: string;
}

export default function MapSidebarSkeleton({ className = '' }: MapSidebarSkeletonProps) {
  return (
    <div className={`bg-white shadow-lg ${className}`}>
      {/* Header Skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-6 bg-gray-300 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-16 h-4 bg-gray-300 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-6 h-5 bg-gray-300 rounded animate-pulse mx-auto mb-1"></div>
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-6 h-5 bg-gray-300 rounded animate-pulse mx-auto mb-1"></div>
              <div className="w-12 h-3 bg-gray-300 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Property Skeleton */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Property Image Skeleton */}
          <div className="aspect-video bg-gray-300 rounded-lg animate-pulse"></div>
          
          {/* Property Info Skeleton */}
          <div className="space-y-3">
            <div className="w-3/4 h-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
            
            <div className="flex items-center justify-between">
              <div className="w-20 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
            
            {/* Property Stats Skeleton */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse mx-auto mb-1"></div>
                <div className="w-6 h-3 bg-gray-300 rounded animate-pulse mx-auto"></div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse mx-auto mb-1"></div>
                <div className="w-6 h-3 bg-gray-300 rounded animate-pulse mx-auto"></div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse mx-auto mb-1"></div>
                <div className="w-6 h-3 bg-gray-300 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
            
            {/* View Details Button Skeleton */}
            <div className="w-full h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}