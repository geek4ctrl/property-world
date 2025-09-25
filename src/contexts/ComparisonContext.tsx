'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Property } from '@/types';

interface ComparisonContextType {
  comparedProperties: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  maxReached: boolean;
  comparisonCount: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_PROPERTIES = 3;

interface ComparisonProviderProps {
  readonly children: ReactNode;
}

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  const addToComparison = useCallback((property: Property): boolean => {
    if (comparedProperties.length >= MAX_COMPARISON_PROPERTIES) {
      return false; // Can't add more
    }

    if (comparedProperties.some(p => p.id === property.id)) {
      return false; // Already in comparison
    }

    setComparedProperties(prev => [...prev, property]);
    return true; // Successfully added
  }, [comparedProperties]);

  const removeFromComparison = useCallback((propertyId: string) => {
    setComparedProperties(prev => prev.filter(p => p.id !== propertyId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparedProperties([]);
  }, []);

  const isInComparison = useCallback((propertyId: string): boolean => {
    return comparedProperties.some(p => p.id === propertyId);
  }, [comparedProperties]);

  const maxReached = comparedProperties.length >= MAX_COMPARISON_PROPERTIES;
  const comparisonCount = comparedProperties.length;

  const value: ComparisonContextType = useMemo(() => ({
    comparedProperties,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    maxReached,
    comparisonCount,
  }), [comparedProperties, addToComparison, removeFromComparison, clearComparison, isInComparison, maxReached, comparisonCount]);

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}

export default ComparisonContext;