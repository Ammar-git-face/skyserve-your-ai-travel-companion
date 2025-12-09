export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  image: string;
  amenities: string[];
  description: string;
}

export interface CarRental {
  id: string;
  company: string;
  carType: string;
  model: string;
  city: string;
  pricePerDay: number;
  currency: string;
  image: string;
  features: string[];
  seats: number;
}

export interface Eatery {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  address: string;
  image: string;
  specialties: string[];
}

export const hotels: Record<string, Hotel[]> = {
  'London': [
    {
      id: 'HTL001',
      name: 'The Ritz London',
      city: 'London',
      address: '150 Piccadilly, London W1J 9BR',
      rating: 5,
      pricePerNight: 450000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Room Service', 'Concierge', 'Gym'],
      description: 'Iconic luxury hotel in the heart of London with world-class service.'
    },
    {
      id: 'HTL002',
      name: 'Premier Inn Westminster',
      city: 'London',
      address: '82-83 Eccleston Square, London SW1V 1PS',
      rating: 4,
      pricePerNight: 85000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      amenities: ['WiFi', 'Restaurant', 'Bar', '24hr Reception'],
      description: 'Comfortable and affordable hotel near Victoria Station.'
    }
  ],
  'Dubai': [
    {
      id: 'HTL003',
      name: 'Burj Al Arab Jumeirah',
      city: 'Dubai',
      address: 'Jumeirah Street, Dubai',
      rating: 5,
      pricePerNight: 1200000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      amenities: ['WiFi', 'Private Beach', 'Spa', 'Helipad', 'Butler Service', 'Pool'],
      description: 'The world\'s most luxurious hotel with iconic sail design.'
    },
    {
      id: 'HTL004',
      name: 'JW Marriott Marquis',
      city: 'Dubai',
      address: 'Sheikh Zayed Road, Dubai',
      rating: 5,
      pricePerNight: 180000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      amenities: ['WiFi', 'Pool', 'Spa', 'Multiple Restaurants', 'Gym'],
      description: 'Twin-tower luxury hotel in the heart of Dubai.'
    }
  ],
  'Abuja': [
    {
      id: 'HTL005',
      name: 'Transcorp Hilton Abuja',
      city: 'Abuja',
      address: '1 Aguiyi Ironsi Street, Maitama, Abuja',
      rating: 5,
      pricePerNight: 95000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Tennis Court'],
      description: 'Premier 5-star hotel in Nigeria\'s capital city.'
    }
  ],
  'New York': [
    {
      id: 'HTL006',
      name: 'The Plaza Hotel',
      city: 'New York',
      address: '768 5th Ave, New York, NY 10019',
      rating: 5,
      pricePerNight: 680000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Concierge', 'Butler Service'],
      description: 'Legendary luxury hotel overlooking Central Park.'
    }
  ],
  'Paris': [
    {
      id: 'HTL007',
      name: 'Hôtel Plaza Athénée',
      city: 'Paris',
      address: '25 Avenue Montaigne, 75008 Paris',
      rating: 5,
      pricePerNight: 520000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      amenities: ['WiFi', 'Spa', 'Michelin Restaurant', 'Concierge', 'Garden'],
      description: 'Iconic Parisian palace hotel on Avenue Montaigne.'
    }
  ]
};

export const carRentals: Record<string, CarRental[]> = {
  'London': [
    {
      id: 'CAR001',
      company: 'Hertz',
      carType: 'Luxury',
      model: 'Mercedes E-Class',
      city: 'London',
      pricePerDay: 45000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      features: ['GPS', 'Leather Seats', 'Bluetooth', 'Automatic'],
      seats: 5
    },
    {
      id: 'CAR002',
      company: 'Enterprise',
      carType: 'Economy',
      model: 'Ford Focus',
      city: 'London',
      pricePerDay: 18000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      features: ['GPS', 'Bluetooth', 'Manual'],
      seats: 5
    }
  ],
  'Dubai': [
    {
      id: 'CAR003',
      company: 'Budget',
      carType: 'Luxury SUV',
      model: 'Range Rover Sport',
      city: 'Dubai',
      pricePerDay: 85000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      features: ['GPS', 'Leather', 'Panoramic Roof', '4WD', 'Automatic'],
      seats: 5
    }
  ],
  'Abuja': [
    {
      id: 'CAR004',
      company: 'Avis Nigeria',
      carType: 'SUV',
      model: 'Toyota Land Cruiser',
      city: 'Abuja',
      pricePerDay: 35000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      features: ['GPS', 'Air Conditioning', '4WD', 'Automatic'],
      seats: 7
    }
  ],
  'New York': [
    {
      id: 'CAR005',
      company: 'National',
      carType: 'Sedan',
      model: 'Tesla Model 3',
      city: 'New York',
      pricePerDay: 55000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
      features: ['Autopilot', 'Electric', 'Premium Audio', 'GPS'],
      seats: 5
    }
  ]
};

export const eateries: Record<string, Eatery[]> = {
  'London': [
    {
      id: 'EAT001',
      name: 'Sketch',
      city: 'London',
      cuisine: 'French/British',
      rating: 4.8,
      priceRange: '$$$$',
      address: '9 Conduit St, London W1S 2XG',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      specialties: ['Afternoon Tea', 'Tasting Menu', 'Michelin Starred']
    },
    {
      id: 'EAT002',
      name: 'Dishoom',
      city: 'London',
      cuisine: 'Indian',
      rating: 4.6,
      priceRange: '$$',
      address: '12 Upper St Martin\'s Lane, London',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      specialties: ['Bacon Naan Roll', 'Black Daal', 'Chai']
    }
  ],
  'Dubai': [
    {
      id: 'EAT003',
      name: 'At.mosphere',
      city: 'Dubai',
      cuisine: 'International',
      rating: 4.9,
      priceRange: '$$$$',
      address: 'Burj Khalifa, Level 122, Dubai',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      specialties: ['Fine Dining', 'World\'s Highest Restaurant', 'Sunset Views']
    }
  ],
  'Abuja': [
    {
      id: 'EAT004',
      name: 'Nkoyo',
      city: 'Abuja',
      cuisine: 'Nigerian',
      rating: 4.5,
      priceRange: '$$',
      address: 'Transcorp Hilton, Abuja',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      specialties: ['Jollof Rice', 'Suya', 'Palm Wine']
    }
  ],
  'New York': [
    {
      id: 'EAT005',
      name: 'Eleven Madison Park',
      city: 'New York',
      cuisine: 'American',
      rating: 4.9,
      priceRange: '$$$$',
      address: '11 Madison Ave, New York, NY 10010',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      specialties: ['Plant-Based Tasting Menu', 'Art Deco Setting']
    }
  ],
  'Paris': [
    {
      id: 'EAT006',
      name: 'Le Jules Verne',
      city: 'Paris',
      cuisine: 'French',
      rating: 4.7,
      priceRange: '$$$$',
      address: 'Eiffel Tower, Paris',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800',
      specialties: ['Eiffel Tower Views', 'Modern French', 'Michelin Starred']
    }
  ]
};

export const getHotelsByCity = (city: string): Hotel[] => {
  return hotels[city] || [];
};

export const getCarRentalsByCity = (city: string): CarRental[] => {
  return carRentals[city] || [];
};

export const getEateriesByCity = (city: string): Eatery[] => {
  return eateries[city] || [];
};
