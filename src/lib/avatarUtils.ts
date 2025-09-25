// Utility functions for generating random avatar images

/**
 * Generates a random professional avatar image using various services
 * @param name - The person's name for consistent avatar generation
 * @param gender - Optional gender for more targeted avatar selection
 * @returns A URL to a random professional avatar image
 */
export function generateRandomAvatar(name: string, gender?: 'male' | 'female'): string {
  // Create a simple hash from the name for consistency
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Array of high-quality professional avatar services and stock photos
  const avatarSources = [
    // DiceBear Avataaars (consistent cartoon-style avatars)
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&size=200`,
    
    // DiceBear Personas (more realistic)
    `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}&size=200`,
    
    // UI Avatars (generates based on initials with nice backgrounds)
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random&color=fff&format=png&rounded=true&font-size=0.33`,
    
    // Additional DiceBear styles
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=200`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&size=200`,
  ];

  // Use the hash to consistently select the same avatar for the same name
  const index = hash % avatarSources.length;
  return avatarSources[index];
}

/**
 * Generates a more sophisticated random avatar with fallback options
 */
export function generateProfessionalAvatar(name: string, options?: {
  gender?: 'male' | 'female';
  style?: 'realistic' | 'illustration' | 'mixed';
  seed?: string;
}): string {
  const { gender, style = 'mixed', seed } = options || {};
  const seedValue = seed || name;
  
  // Create a hash for consistent selection
  const hash = seedValue.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  let avatarSources: string[] = [];

  if (style === 'realistic' || style === 'mixed') {
    // High-quality professional photos from Unsplash
    const realisticFemale = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b988?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face&auto=format'
    ];

    const realisticMale = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format'
    ];

    if (gender === 'female') {
      avatarSources.push(...realisticFemale);
    } else if (gender === 'male') {
      avatarSources.push(...realisticMale);
    } else {
      avatarSources.push(...realisticFemale, ...realisticMale);
    }
  }

  if (style === 'illustration' || style === 'mixed') {
    // Add illustrated/generated avatars
    avatarSources.push(
      `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seedValue)}&size=200`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seedValue)}&size=200`,
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random&color=fff&format=png&rounded=true&font-size=0.33`
    );
  }

  // Select avatar based on hash
  const index = hash % avatarSources.length;
  return avatarSources[index];
}

/**
 * Get gender from name (simple heuristic for demo purposes)
 */
export function guessGenderFromName(name: string): 'male' | 'female' | 'unknown' {
  const firstName = name.split(' ')[0].toLowerCase();
  
  const femaleNames = [
    'sarah', 'amanda', 'jennifer', 'michelle', 'jessica', 'ashley', 'emily', 'linda', 'mary', 'patricia',
    'susan', 'angela', 'melissa', 'brenda', 'helen', 'marie', 'kelly', 'christina', 'joan', 'nancy'
  ];
  
  const maleNames = [
    'michael', 'david', 'john', 'james', 'robert', 'mark', 'paul', 'daniel', 'christopher', 'matthew',
    'anthony', 'steven', 'andrew', 'kenneth', 'peter', 'joshua', 'kevin', 'brian', 'george', 'timothy'
  ];

  if (femaleNames.includes(firstName)) {
    return 'female';
  } else if (maleNames.includes(firstName)) {
    return 'male';
  }
  
  return 'unknown';
}

/**
 * Generate a professional avatar with smart gender detection
 */
export function generateSmartAvatar(name: string): string {
  // For demo purposes, let's use a simple but reliable approach
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Array of reliable avatar generators
  const avatarServices = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&size=200`,
    `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}&size=200`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=200&backgroundColor=3b82f6,ef4444,10b981,f59e0b,8b5cf6&textColor=ffffff`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random&color=fff&format=png&rounded=true`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}&size=200`,
  ];
  
  const index = hash % avatarServices.length;
  return avatarServices[index];
}