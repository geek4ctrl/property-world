import { SearchFilters } from '@/types';
import PropertySearch from '../property/PropertySearch';
import { useTranslation } from '@/i18n/translation';

interface HeroSectionProps {
  readonly onSearch: (filters: SearchFilters) => void;
  readonly loading?: boolean;
}

export default function HeroSection({ onSearch, loading = false }: HeroSectionProps) {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base background image */}
        <div 
          className="absolute inset-0 bg-black/40"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/30 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-purple-500/20" />
        
        {/* Floating elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-l from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-float" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-10">
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 lg:mb-8 drop-shadow-2xl animate-fadeInUp">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto mb-8 lg:mb-12 drop-shadow-lg animate-fadeInUp leading-relaxed" style={{ animationDelay: '200ms' }}>
            {t('hero.subtitle')}
          </p>
          
          {/* Enhanced Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <div className="group text-center p-6 rounded-2xl glass-card hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2 group-hover:text-blue-200 transition-colors duration-300">
                50,000+
              </div>
              <div className="text-blue-200 font-semibold text-sm sm:text-base group-hover:text-white transition-colors duration-300">
                {t('hero.properties_listed')}
              </div>
            </div>
            <div className="group text-center p-6 rounded-2xl glass-card hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2 group-hover:text-purple-200 transition-colors duration-300">
                15,000+
              </div>
              <div className="text-blue-200 font-semibold text-sm sm:text-base group-hover:text-white transition-colors duration-300">
                {t('hero.happy_clients')}
              </div>
            </div>
            <div className="group text-center p-6 rounded-2xl glass-card hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/25">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2 group-hover:text-green-200 transition-colors duration-300">
                2,500+
              </div>
              <div className="text-blue-200 font-semibold text-sm sm:text-base group-hover:text-white transition-colors duration-300">
                {t('hero.trusted_agents')}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="max-w-6xl mx-auto animate-fadeInUp" style={{ animationDelay: '600ms' }}>
          <div className="glass-card p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
            <div className="relative">
              <PropertySearch onSearch={onSearch} loading={loading} variant="hero" />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
          <div className="flex flex-col items-center text-white/60 hover:text-white transition-colors duration-300 cursor-pointer">
            <span className="text-sm font-medium mb-2 hidden sm:block">Scroll to explore</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}