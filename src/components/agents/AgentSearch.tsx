'use client';

import { useState } from 'react';

interface AgentFilters {
  search?: string;
  location?: string;
  agency?: string;
  specialization?: string;
}

interface AgentSearchProps {
  onSearch: (filters: AgentFilters) => void;
  agencies: string[];
  className?: string;
}

export default function AgentSearch({ onSearch, agencies, className = '' }: AgentSearchProps) {
  const [filters, setFilters] = useState<AgentFilters>({});

  const handleInputChange = (key: keyof AgentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Your Agent</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by Name/Agency */}
        <div>
          <label htmlFor="agent-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or Agency
          </label>
          <div className="relative">
            <input
              id="agent-search"
              type="text"
              placeholder="Enter name or agency..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="agent-location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <input
              id="agent-location"
              type="text"
              placeholder="City or area..."
              value={filters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Agency Filter */}
        <div>
          <label htmlFor="agent-agency" className="block text-sm font-medium text-gray-700 mb-2">
            Agency
          </label>
          <select
            id="agent-agency"
            value={filters.agency || ''}
            onChange={(e) => handleInputChange('agency', e.target.value)}
            className="w-full px-3 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>

        {/* Specialization */}
        <div>
          <label htmlFor="agent-specialization" className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <select
            id="agent-specialization"
            value={filters.specialization || ''}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            className="w-full px-3 py-3 bg-white border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Specializations</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="luxury">Luxury Properties</option>
            <option value="student">Student Accommodation</option>
            <option value="investment">Investment Properties</option>
            <option value="first-time-buyers">First-Time Buyers</option>
            <option value="rentals">Rentals</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Clear All Filters
        </button>
        
        <div className="text-sm text-gray-500">
          Use the filters above to find agents that match your specific needs
        </div>
      </div>
    </div>
  );
}