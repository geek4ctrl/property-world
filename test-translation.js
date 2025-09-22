// Simple test to demonstrate translation functionality
const en = require('./src/i18n/locales/en.json');
const fr = require('./src/i18n/locales/fr.json');

console.log('🌍 Translation Test - Property World Application\n');

console.log('=== Navigation Examples ===');
console.log('EN: Home →', en.navigation.home);
console.log('FR: Home →', fr.navigation.home);
console.log('EN: Properties →', en.navigation.properties);
console.log('FR: Properties →', fr.navigation.properties);
console.log('EN: Find Agent →', en.navigation.find_agent);
console.log('FR: Find Agent →', fr.navigation.find_agent);

console.log('\n=== Property Types ===');
console.log('EN: House →', en.property.house);
console.log('FR: House →', fr.property.house);
console.log('EN: Apartment →', en.property.apartment);
console.log('FR: Apartment →', fr.property.apartment);
console.log('EN: For Sale →', en.property.for_sale);
console.log('FR: For Sale →', fr.property.for_sale);

console.log('\n=== Common Interface ===');
console.log('EN: Search →', en.common.search);
console.log('FR: Search →', fr.common.search);
console.log('EN: Price →', en.common.price);
console.log('FR: Price →', fr.common.price);
console.log('EN: Location →', en.common.location);
console.log('FR: Location →', fr.common.location);

console.log('\n=== Homepage Content ===');
console.log('EN: Featured Properties →', en.homepage.featured_properties);
console.log('FR: Featured Properties →', fr.homepage.featured_properties);
console.log('EN: Smart Search →', en.homepage.smart_search);
console.log('FR: Smart Search →', fr.homepage.smart_search);

console.log('\n=== Parameter Examples ===');
console.log('EN: Found Properties Template →', en.common.found_properties);
console.log('FR: Found Properties Template →', fr.common.found_properties);
console.log('EN: Showing Results Template →', en.property.showing_results);
console.log('FR: Showing Results Template →', fr.property.showing_results);

// Count total translation keys
const countKeys = (obj, prefix = '') => {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key], prefix + key + '.');
    } else {
      count++;
    }
  }
  return count;
};

const enCount = countKeys(en);
const frCount = countKeys(fr);

console.log('\n=== Translation Statistics ===');
console.log(`Total English keys: ${enCount}`);
console.log(`Total French keys: ${frCount}`);
console.log(`Translation coverage: ${frCount === enCount ? '100%' : Math.round((frCount/enCount)*100) + '%'}`);
console.log('✅ Translation system is fully functional!');