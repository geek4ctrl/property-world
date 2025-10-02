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
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-24 overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-black/30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl animate-fade-in">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 drop-shadow-lg animate-fade-in animation-delay-200">
            {t('hero.subtitle')}
          </p>
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-12 mb-16 animate-fade-in animation-delay-400">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-white drop-shadow-lg">50,000+</div>
              <div className="text-blue-200 font-medium">{t('hero.properties_listed')}</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-white drop-shadow-lg">15,000+</div>
              <div className="text-blue-200 font-medium">{t('hero.happy_clients')}</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl font-bold text-white drop-shadow-lg">2,500+</div>
              <div className="text-blue-200 font-medium">{t('hero.trusted_agents')}</div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="max-w-6xl mx-auto px-4 animate-fade-in animation-delay-600">
          <PropertySearch onSearch={onSearch} loading={loading} variant="hero" />
        </div>
      </div>
    </section>
  );
}