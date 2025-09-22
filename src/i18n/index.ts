import { useEffect, useState } from 'react';

type Messages = Record<string, any>;

const messages: Record<string, Messages> = {
  en: require('./locales/en.json'),
  fr: require('./locales/fr.json'),
};

// Global state for translation
let globalLocale = 'en';
let subscribers: (() => void)[] = [];

// Helper function to get nested value from object
function getNestedValue(obj: any, keys: string[]): any {
  return keys.reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
}

// Helper function to replace parameters in string
function replaceParameters(str: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce((result, [param, val]) => {
    return result.replace(new RegExp(`{${param}}`, 'g'), String(val));
  }, str);
}

// Subscribe to locale changes
function subscribe(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

// Notify all subscribers
function notify() {
  subscribers.forEach(callback => callback());
}

export function useTranslation() {
  const [locale, setLocale] = useState(globalLocale);

  useEffect(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') || 'en';
      globalLocale = savedLocale;
      setLocale(savedLocale);
    }

    // Subscribe to changes
    const unsubscribe = subscribe(() => {
      setLocale(globalLocale);
    });

    return unsubscribe;
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    
    // Try to get value in current locale
    let value = getNestedValue(messages[locale], keys);
    
    // Fallback to English if not found
    if (value === undefined) {
      value = getNestedValue(messages['en'], keys);
    }
    
    // Return key if still not found
    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters if provided
    return params ? replaceParameters(value, params) : value;
  };

  const changeLanguage = (newLocale: string) => {
    globalLocale = newLocale;
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    notify();
  };

  return {
    t,
    locale,
    changeLanguage,
    isRTL: false,
  };
}

export function formatPrice(price: number, currency: string = 'ZAR', locale: string = 'en'): string {
  if (locale === 'fr') {
    return `${price.toLocaleString('fr-FR')} R`;
  }
  return `R ${price.toLocaleString('en-ZA')}`;
}

export function formatPropertyType(type: string, locale: string = 'en'): string {
  const typeKey = `property.${type.toLowerCase()}`;
  const messages_locale = messages[locale] || messages['en'];
  
  const keys = typeKey.split('.');
  let value: any = messages_locale;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return type; // Return original if not found
    }
  }
  
  return typeof value === 'string' ? value : type;
}

export const availableLocales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];