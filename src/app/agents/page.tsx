'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgentGrid from '@/components/agents/AgentGrid';
import AgentSearch from '@/components/agents/AgentSearch';
import { sampleProperties, additionalAgents } from '@/data/sampleProperties';

interface AgentFilters {
  search?: string;
  location?: string;
  agency?: string;
  specialization?: string;
}

export default function AgentsPage() {
  const [filters, setFilters] = useState<AgentFilters>({});

  // Combine all agents from properties and additional agents
  const allAgents = useMemo(() => {
    const propertyAgents = sampleProperties.map(p => p.agent);
    const combined = [...propertyAgents, ...additionalAgents];
    
    // Remove duplicates by ID
    const uniqueAgents = combined.filter((agent, index, self) => 
      index === self.findIndex(a => a.id === agent.id)
    );
    
    return uniqueAgents;
  }, []);

  // Filter agents based on search criteria
  const filteredAgents = useMemo(() => {
    let filtered = allAgents;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchLower) ||
        agent.agency.toLowerCase().includes(searchLower) ||
        agent.bio?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.agency) {
      filtered = filtered.filter(agent => agent.agency === filters.agency);
    }

    // Add more filtering logic as needed

    return filtered;
  }, [allAgents, filters]);

  // Get unique agencies for filter dropdown
  const agencies = useMemo(() => {
    const agencySet = new Set(allAgents.map(agent => agent.agency));
    return Array.from(agencySet).sort();
  }, [allAgents]);

  const handleSearch = (newFilters: AgentFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Perfect Agent
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect with experienced real estate professionals who know your area and can help you achieve your property goals.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{allAgents.length}+</div>
                  <div className="text-gray-600">Expert Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{agencies.length}+</div>
                  <div className="text-gray-600">Partner Agencies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AgentSearch 
              onSearch={handleSearch}
              agencies={agencies}
            />
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredAgents.length === allAgents.length 
                    ? 'All Agents' 
                    : (() => {
                        const agentCountText = `${filteredAgents.length} Agent${filteredAgents.length !== 1 ? 's' : ''} Found`;
                        return filters.search ? `${agentCountText} for "${filters.search}"` : agentCountText;
                      })()
                  }
                </h2>
                <p className="text-gray-600 mt-1">
                  Choose from our network of professional real estate agents
                </p>
              </div>
            </div>

            <AgentGrid agents={filteredAgents} />
          </div>
        </section>

        {/* Why Choose Our Agents Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Agents?
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our agents are carefully selected professionals with proven track records in the South African property market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Licensed & Certified</h3>
                <p className="text-gray-600">All our agents are fully licensed and certified professionals.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Expertise</h3>
                <p className="text-gray-600">Deep knowledge of local markets and neighborhoods.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Client-Focused</h3>
                <p className="text-gray-600">Committed to providing exceptional service and results.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Response</h3>
                <p className="text-gray-600">Quick response times and proactive communication.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}