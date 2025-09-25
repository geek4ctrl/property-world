import { Property, PropertyType, ListingType } from '@/types';

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3 Bedroom House in Sandton',
    description: 'Beautiful modern home with stunning views of the city. Features include a spacious open-plan living area, modern kitchen with granite countertops, three bedrooms with built-in cupboards, and a double garage. The property boasts a private garden and swimming pool, perfect for entertaining.',
    price: 2850000,
    currency: 'ZAR',
    propertyType: PropertyType.HOUSE,
    listingType: ListingType.FOR_SALE,
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    squareMeters: 180,
    erfSize: 450,
    address: {
      street: '15 Wierda Road',
      suburb: 'Sandton',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa'
    },
    images: [
      {
        id: 'img1',
        url: '/house1.svg',
        alt: 'Modern house exterior',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img2',
        url: '/placeholder-property.jpg',
        alt: 'Kitchen and living area',
        isPrimary: false,
        order: 2
      },
      {
        id: 'img3',
        url: '/apartment1.svg',
        alt: 'Master bedroom',
        isPrimary: false,
        order: 3
      },
      {
        id: 'img4',
        url: '/office1.svg',
        alt: 'Bathroom',
        isPrimary: false,
        order: 4
      },
      {
        id: 'img5',
        url: '/townhouse1.svg',
        alt: 'Swimming pool area',
        isPrimary: false,
        order: 5
      },
      {
        id: 'img6',
        url: '/student1.svg',
        alt: 'Garden view',
        isPrimary: false,
        order: 6
      }
    ],
    features: ['Swimming Pool', 'Garden', 'Security System', 'Fiber Internet', 'Air Conditioning'],
    agent: {
      id: 'agent1',
      name: 'Sarah Johnson',
      email: 'sarah@prestigerealty.co.za',
      phone: '+27 11 234 5678',
      agency: 'Prestige Realty',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b988?w=200&h=200&fit=crop&crop=face&auto=format',
      bio: 'Experienced real estate agent specializing in luxury properties in Sandton and surrounding areas.'
    },
    dateAdded: new Date('2024-01-15'),
    dateUpdated: new Date('2024-01-20'),
    isActive: true,
    isFeatured: true,
    views: 245,
    coordinates: {
      lat: -26.1076,
      lng: 28.0567
    }
  },
  {
    id: '2',
    title: 'Luxury Apartment in Cape Town Waterfront',
    description: 'Spectacular waterfront apartment with panoramic views of Table Mountain and the harbor. This luxury unit features floor-to-ceiling windows, premium finishes throughout, and access to world-class amenities including gym, pool, and concierge services.',
    price: 15000,
    currency: 'ZAR',
    propertyType: PropertyType.APARTMENT,
    listingType: ListingType.TO_RENT,
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    squareMeters: 95,
    address: {
      street: 'Clock Tower Centre',
      suburb: 'V&A Waterfront',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa'
    },
    images: [
      {
        id: 'img3',
        url: '/apartment1.svg',
        alt: 'Waterfront apartment building',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img4',
        url: '/placeholder-property.jpg',
        alt: 'Modern apartment interior',
        isPrimary: false,
        order: 2
      }
    ],
    features: ['Ocean View', 'Gym Access', 'Swimming Pool', 'Concierge', 'Balcony', '24/7 Security'],
    agent: {
      id: 'agent2',
      name: 'Michael Chen',
      email: 'michael@waterfront.properties',
      phone: '+27 21 456 7890',
      agency: 'Waterfront Properties',
      profileImage: undefined,
      bio: 'Specialist in luxury waterfront properties with over 10 years of experience in the Cape Town market.'
    },
    dateAdded: new Date('2024-01-10'),
    dateUpdated: new Date('2024-01-18'),
    isActive: true,
    isFeatured: true,
    views: 189,
    coordinates: {
      lat: -33.9058,
      lng: 18.4240
    }
  },
  {
    id: '3',
    title: 'Family Townhouse in Pretoria East',
    description: 'Perfect family home in a secure estate. This spacious townhouse offers comfortable living with three bedrooms, two and a half bathrooms, and a private garden. The complex features excellent security, children\'s play areas, and is close to top schools.',
    price: 1750000,
    currency: 'ZAR',
    propertyType: PropertyType.TOWNHOUSE,
    listingType: ListingType.FOR_SALE,
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    squareMeters: 145,
    erfSize: 200,
    address: {
      street: 'Willow Creek Estate',
      suburb: 'Faerie Glen',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0043',
      country: 'South Africa'
    },
    images: [
      {
        id: 'img5',
        url: '/townhouse1.svg',
        alt: 'Townhouse exterior',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img6',
        url: '/placeholder-property.jpg',
        alt: 'Living room interior',
        isPrimary: false,
        order: 2
      }
    ],
    features: ['Secure Estate', 'Garden', 'Children\'s Play Area', 'Close to Schools', 'Pet Friendly'],
    agent: {
      id: 'agent3',
      name: 'Amanda Williams',
      email: 'amanda@familyhomes.co.za',
      phone: '+27 12 345 6789',
      agency: 'Family Homes Realty',
      profileImage: undefined,
      bio: 'Dedicated to helping families find their perfect home in Pretoria\'s best neighborhoods.'
    },
    dateAdded: new Date('2024-01-12'),
    dateUpdated: new Date('2024-01-22'),
    isActive: true,
    isFeatured: false,
    views: 98,
    coordinates: {
      lat: -25.7461,
      lng: 28.2026
    }
  },
  {
    id: '4',
    title: 'Student Accommodation in Stellenbosch',
    description: 'Modern student flat close to Stellenbosch University. Perfect for students looking for comfortable and affordable accommodation. The unit is fully furnished and includes all utilities. Walking distance to campus and local amenities.',
    price: 4500,
    currency: 'ZAR',
    propertyType: PropertyType.FLAT,
    listingType: ListingType.TO_RENT,
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    squareMeters: 35,
    address: {
      street: '12 University Street',
      suburb: 'Stellenbosch Central',
      city: 'Stellenbosch',
      province: 'Western Cape',
      postalCode: '7600',
      country: 'South Africa'
    },
    images: [
      {
        id: 'img7',
        url: '/student1.svg',
        alt: 'Student flat exterior',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img8',
        url: '/placeholder-property.jpg',
        alt: 'Compact living space',
        isPrimary: false,
        order: 2
      }
    ],
    features: ['Furnished', 'Utilities Included', 'Close to University', 'WiFi Included', 'Laundry Facilities'],
    agent: {
      id: 'agent4',
      name: 'David van der Merwe',
      email: 'david@studentliving.co.za',
      phone: '+27 21 887 9012',
      agency: 'Student Living Solutions',
      profileImage: undefined,
      bio: 'Specializing in student accommodation in the Stellenbosch area for over 8 years.'
    },
    dateAdded: new Date('2024-01-08'),
    dateUpdated: new Date('2024-01-16'),
    isActive: true,
    isFeatured: false,
    views: 67,
    coordinates: {
      lat: -33.9321,
      lng: 18.8602
    }
  },
  {
    id: '5',
    title: 'Commercial Office Space in Rosebank',
    description: 'Prime commercial office space in the heart of Rosebank. This modern office building offers excellent visibility, ample parking, and is perfectly located for business operations. Features include air conditioning, fiber connectivity, and 24/7 security.',
    price: 25000,
    currency: 'ZAR',
    propertyType: PropertyType.OFFICE,
    listingType: ListingType.TO_RENT,
    bedrooms: 0,
    bathrooms: 2,
    garages: 4,
    squareMeters: 150,
    address: {
      street: '196 Oxford Road',
      suburb: 'Rosebank',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2196',
      country: 'South Africa'
    },
    images: [
      {
        id: 'img9',
        url: '/office1.svg',
        alt: 'Modern office building',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img10',
        url: '/placeholder-property.jpg',
        alt: 'Office interior space',
        isPrimary: false,
        order: 2
      }
    ],
    features: ['Air Conditioning', 'Fiber Internet', 'Parking', '24/7 Security', 'Reception Area', 'Meeting Rooms'],
    agent: {
      id: 'agent5',
      name: 'Jennifer Smith',
      email: 'jennifer@commercialspaces.co.za',
      phone: '+27 11 678 9012',
      agency: 'Commercial Spaces Inc',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format',
      bio: 'Commercial real estate specialist with extensive experience in Johannesburg\'s business districts.'
    },
    dateAdded: new Date('2024-01-05'),
    dateUpdated: new Date('2024-01-19'),
    isActive: true,
    isFeatured: false,
    views: 134,
    coordinates: {
      lat: -26.1467,
      lng: 28.0436
    }
  }
];

export const featuredProperties = sampleProperties.filter(p => p.isFeatured);
export const recentProperties = [...sampleProperties]
  .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
  .slice(0, 3);

// Additional sample agents for variety
export const additionalAgents = [
  {
    id: 'agent6',
    name: 'Marcus Thompson',
    email: 'marcus@luxuryestates.co.za',
    phone: '+27 11 555 0123',
    agency: 'Luxury Estates',
    profileImage: undefined,
    bio: 'Luxury property specialist with a focus on high-end residential and commercial properties.'
  },
  {
    id: 'agent7',
    name: 'Priya Sharma',
    email: 'priya@modernhomes.co.za',
    phone: '+27 21 555 0456',
    agency: 'Modern Homes Realty',
    profileImage: undefined,
    bio: 'Expert in contemporary design homes and first-time buyer assistance.'
  },
  {
    id: 'agent8',
    name: 'Johan Pretorius',
    email: 'johan@countryside.properties',
    phone: '+27 12 555 0789',
    agency: 'Countryside Properties',
    profileImage: undefined,
    bio: 'Specializing in farms, rural properties, and lifestyle estates across Gauteng.'
  },
  {
    id: 'agent9',
    name: 'Lisa Wang',
    email: 'lisa@coastalproperties.co.za',
    phone: '+27 21 555 0321',
    agency: 'Coastal Properties',
    profileImage: undefined,
    bio: 'Cape Town coastal property expert with over 15 years of market experience.'
  },
  {
    id: 'agent10',
    name: 'Thabo Mthembu',
    email: 'thabo@emergingareas.co.za',
    phone: '+27 11 555 0654',
    agency: 'Emerging Areas Realty',
    profileImage: undefined,
    bio: 'Investment property specialist focusing on emerging neighborhoods and development areas.'
  }
];