'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyGrid from '@/components/property/PropertyGrid';
import ContactForm from '@/components/forms/ContactForm';
import { Agent, Property } from '@/types/property';
import { sampleProperties, additionalAgents } from '@/data/sampleProperties';
import { useTranslation } from '@/i18n/translation';

interface AgentProfilePageProps {
  params: {
    id: string;
  };
}

export default function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Find the agent
  const agent = useMemo(() => {
    const propertyAgents = sampleProperties.map(p => p.agent);
    const allAgents = [...propertyAgents, ...additionalAgents];
    return allAgents.find(a => a.id === params.id);
  }, [params.id]);

  // Get agent's properties
  const agentProperties = useMemo(() => {
    return sampleProperties.filter(p => p.agent.id === params.id);
  }, [params.id]);

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Agent Profile Header */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Agent Photo and Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                    {agent.profileImage && !imageError ? (
                      <img
                        src={agent.profileImage}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{agent.name}</h1>
                  <p className="text-blue-600 font-semibold text-lg mb-1">{agent.agency}</p>
                  {agent.licenseNumber && (
                    <p className="text-sm text-gray-500 mb-6">License: {agent.licenseNumber}</p>
                  )}

                  {/* Contact Actions */}
                  <div className="space-y-4">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center justify-center space-x-2 w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{agent.phone}</span>
                    </a>

                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-center space-x-2 w-full p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{agent.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Agent Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About {agent.name}</h2>
                  
                  {agent.bio && (
                    <div className="mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {agent.bio}
                      </p>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{agentProperties.length}</div>
                      <div className="text-gray-600">Active Listings</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                      <div className="text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                      <div className="text-gray-600">Happy Clients</div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Residential Properties
                      </span>
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        First-Time Buyers
                      </span>
                      <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Investment Properties
                      </span>
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        Sandton
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        Johannesburg CBD
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        Rosebank
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        Bryanston
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agent's Properties */}
        {agentProperties.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {agent.name}'s Current Listings
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse through the properties currently being marketed by {agent.name}
                </p>
              </div>

              <PropertyGrid properties={agentProperties} />
            </div>
          </section>
        )}

        {/* Contact Form */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch with {agent.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ready to start your property journey? Send a message and {agent.name} will get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <ContactForm 
                onSubmit={(data) => {
                  console.log('Contact form submitted to agent:', agent.id, data);
                  // Handle form submission - would typically send to API
                }}
              />
            </div>
          </div>
        </section>

        {/* Reviews Section (Future Enhancement) */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Client Testimonials
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See what clients are saying about their experience with {agent.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sample testimonials */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Excellent service! {agent.name.split(' ')[0]} helped us find our dream home and made the entire process smooth and stress-free."
                </p>
                <div className="text-sm text-gray-500">
                  - Sarah M., Sandton
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Professional, knowledgeable, and always responsive. Highly recommend {agent.name} for anyone looking to buy or sell property."
                </p>
                <div className="text-sm text-gray-500">
                  - Michael J., Rosebank
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Outstanding market knowledge and negotiation skills. {agent.name} got us the best possible deal on our investment property."
                </p>
                <div className="text-sm text-gray-500">
                  - Lisa K., Bryanston
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}