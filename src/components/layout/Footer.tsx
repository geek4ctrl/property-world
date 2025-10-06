import Link from 'next/link';
import { useTranslation } from '@/i18n/translation';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="animate-fadeInUp">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Tanoluxe</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.company_description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/propertyworld" className="group p-3 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25" aria-label={t('footer.follow_twitter')}>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://facebook.com/propertyworld" className="group p-3 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/25" aria-label={t('footer.follow_facebook')}>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/propertyworld" className="group p-3 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-700/25" aria-label={t('footer.follow_linkedin')}>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.544c0-1.445.839-2.525 1.883-2.525.888 0 1.317.666 1.317 1.466 0 .893-.568 2.229-.861 3.467-.245 1.04.522 1.887 1.55 1.887 1.86 0 3.291-1.963 3.291-4.792 0-2.503-1.799-4.253-4.371-4.253-2.976 0-4.727 2.234-4.727 4.546 0 .901.344 1.869.775 2.392.085.103.097.194.072.299-.079.33-.254 1.037-.289 1.183-.047.196-.154.238-.355.144-1.332-.619-2.166-2.566-2.166-4.126 0-3.298 2.397-6.325 6.918-6.325 3.634 0 6.457 2.589 6.457 6.043 0 3.606-2.275 6.504-5.431 6.504-1.061 0-2.059-.552-2.401-1.209 0 0-.524 1.999-.652 2.489-.236.906-.873 2.04-1.301 2.734C9.525 23.67 10.74 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('footer.all_properties')}
              </Link></li>
              <li><Link href="/properties?listing=sale" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('footer.properties_for_sale')}
              </Link></li>
              <li><Link href="/properties?listing=rent" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('footer.properties_to_rent')}
              </Link></li>
              <li><Link href="/agents" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('footer.find_agent')}
              </Link></li>
              <li><Link href="/valuations" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('footer.property_valuations')}
              </Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
              {t('footer.property_types')}
            </h3>
            <ul className="space-y-3">
              <li><Link href="/properties?type=house" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('property.houses')}
              </Link></li>
              <li><Link href="/properties?type=apartment" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('property.apartments')}
              </Link></li>
              <li><Link href="/properties?type=townhouse" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('property.townhouses')}
              </Link></li>
              <li><Link href="/properties?type=flat" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('property.flats')}
              </Link></li>
              <li><Link href="/properties?type=commercial" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {t('property.commercial')}
              </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              {t('footer.contact_us')}
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center group hover:text-white transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{t('footer.phone_number')}</span>
              </li>
              <li className="flex items-center group hover:text-white transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-300">{t('footer.email_address')}</span>
              </li>
              <li className="flex items-start group hover:text-white transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  {t('footer.street_address')}<br />
                  {t('footer.city_postal')}<br />
                  {t('footer.country')}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105 relative group">
              <span className="relative z-10">{t('footer.privacy_policy')}</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105 relative group">
              <span className="relative z-10">{t('footer.terms_of_service')}</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105 relative group">
              <span className="relative z-10">{t('footer.sitemap')}</span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}