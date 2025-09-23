'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    // Start fade out animation
    setTransitionStage('fade-out');
    
    const timer = setTimeout(() => {
      // Update content and start fade in
      setDisplayChildren(children);
      setTransitionStage('fade-in');
    }, 150); // Half of the transition duration

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        ${transitionStage === 'fade-out' ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}
        ${className}
      `}
    >
      {displayChildren}
    </div>
  );
}

// Loading component for page transitions
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading page...</p>
      </div>
    </div>
  );
}

// Route transition wrapper for use with Next.js App Router
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <PageTransition key={pathname}>
      {children}
    </PageTransition>
  );
}