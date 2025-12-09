export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  type: 'domestic' | 'international' | 'both';
}

export const airports: Airport[] = [
  // Nigerian Domestic Airports
  { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria', type: 'both' },
  { code: 'ABV', name: 'Nnamdi Azikiwe International Airport', city: 'Abuja', country: 'Nigeria', type: 'both' },
  { code: 'PHC', name: 'Port Harcourt International Airport', city: 'Port Harcourt', country: 'Nigeria', type: 'both' },
  { code: 'KAN', name: 'Mallam Aminu Kano International Airport', city: 'Kano', country: 'Nigeria', type: 'both' },
  { code: 'ENU', name: 'Akanu Ibiam International Airport', city: 'Enugu', country: 'Nigeria', type: 'domestic' },
  { code: 'CBQ', name: 'Margaret Ekpo International Airport', city: 'Calabar', country: 'Nigeria', type: 'domestic' },
  { code: 'BNI', name: 'Benin Airport', city: 'Benin City', country: 'Nigeria', type: 'domestic' },
  { code: 'ILR', name: 'Ilorin International Airport', city: 'Ilorin', country: 'Nigeria', type: 'domestic' },
  
  // International Destinations
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', type: 'international' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', type: 'international' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', type: 'international' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', type: 'international' },
  { code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', type: 'international' },
  { code: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana', type: 'international' },
  { code: 'ADD', name: 'Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', type: 'international' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', type: 'international' },
  { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', type: 'international' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', type: 'international' },
];

export const getDomesticAirports = (): Airport[] => {
  return airports.filter(a => a.type === 'domestic' || a.type === 'both');
};

export const getInternationalAirports = (): Airport[] => {
  return airports.filter(a => a.type === 'international' || a.type === 'both');
};

export const getAirportByCode = (code: string): Airport | undefined => {
  return airports.find(a => a.code === code);
};

export const searchAirports = (query: string, type?: 'domestic' | 'international'): Airport[] => {
  const lowerQuery = query.toLowerCase();
  let filtered = airports.filter(
    a => a.city.toLowerCase().includes(lowerQuery) || 
         a.code.toLowerCase().includes(lowerQuery) ||
         a.name.toLowerCase().includes(lowerQuery)
  );
  
  if (type === 'domestic') {
    filtered = filtered.filter(a => a.type === 'domestic' || a.type === 'both');
  } else if (type === 'international') {
    filtered = filtered.filter(a => a.type === 'international' || a.type === 'both');
  }
  
  return filtered;
};
