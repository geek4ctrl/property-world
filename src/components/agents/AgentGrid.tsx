'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Agent } from '@/types/property';

interface AgentGridProps {
  agents: Agent[];
  className?: string;
}

interface AgentCardProps {
  agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Agent Photo */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {agent.profileImage && !imageError ? (
          <img
            src={agent.profileImage}
            alt={agent.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Agent Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
          <p className="text-blue-600 font-medium">{agent.agency}</p>
          {agent.licenseNumber && (
            <p className="text-xs text-gray-500 mt-1">License: {agent.licenseNumber}</p>
          )}
        </div>

        {agent.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {agent.bio}
          </p>
        )}

        {/* Contact Actions */}
        <div className="space-y-3">
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center space-x-2 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{agent.phone}</span>
          </a>

          <a
            href={`mailto:${agent.email}`}
            className="flex items-center justify-center space-x-2 w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>{agent.email}</span>
          </a>

          <Link
            href={`/agents/${agent.id}`}
            className="block w-full p-3 text-center border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AgentGrid({ agents, className = '' }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
        <p className="text-gray-500">Try adjusting your search criteria to find more agents.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}