'use client';

import PropertyCardSkeleton from '@/components/ui/PropertyCardSkeleton';

interface PropertyGridSkeletonProps {
  readonly count?: number;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'featured';
}

export default function PropertyGridSkeleton({ 
  count = 6, 
  className = '',
  variant = 'default' 
}: PropertyGridSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <PropertyCardSkeleton 
          key={`skeleton-${index}`} 
          variant={index === 0 && variant === 'featured' ? 'featured' : variant}
        />
      ))}
    </div>
  );
}