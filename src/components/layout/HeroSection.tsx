import { SearchFilters } from '@/types';
import PropertySearch from '../property/PropertySearch';

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover thousands of properties for sale and rent across South Africa. 
            From luxury homes to affordable apartments, find your dream property today.
          </p>
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50,000+</div>
              <div className="text-blue-200">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15,000+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2,500+</div>
              <div className="text-blue-200">Trusted Agents</div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <PropertySearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}