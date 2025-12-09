import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plane, 
  ArrowLeftRight, 
  Calendar, 
  Users, 
  Search,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { searchAirports, type Airport } from "@/data/airports";

interface FlightSearchProps {
  defaultFlightType?: 'domestic' | 'international';
}

const FlightSearch = ({ defaultFlightType = 'domestic' }: FlightSearchProps) => {
  const navigate = useNavigate();
  const [flightType, setFlightType] = useState<'domestic' | 'international'>(defaultFlightType);
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);

  const fromSuggestions = searchAirports(from, flightType);
  const toSuggestions = searchAirports(to, flightType);

  const handleSearch = () => {
    const params = new URLSearchParams({
      type: flightType,
      from: fromAirport?.code || '',
      to: toAirport?.code || '',
      date: departDate,
      passengers: passengers.toString(),
      tripType
    });
    if (tripType === 'roundtrip' && returnDate) {
      params.set('returnDate', returnDate);
    }
    navigate(`/search?${params.toString()}`);
  };

  const selectFromAirport = (airport: Airport) => {
    setFromAirport(airport);
    setFrom(`${airport.city} (${airport.code})`);
    setShowFromSuggestions(false);
  };

  const selectToAirport = (airport: Airport) => {
    setToAirport(airport);
    setTo(`${airport.city} (${airport.code})`);
    setShowToSuggestions(false);
  };

  const swapLocations = () => {
    const tempFrom = from;
    const tempFromAirport = fromAirport;
    setFrom(to);
    setFromAirport(toAirport);
    setTo(tempFrom);
    setToAirport(tempFromAirport);
  };

  return (
    <div className="glass-card p-6 lg:p-8 w-full max-w-5xl mx-auto">
      {/* Flight Type Toggle */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setFlightType('domestic')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              flightType === 'domestic' 
                ? "bg-primary text-primary-foreground shadow-soft" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Domestic
            </span>
          </button>
          <button
            onClick={() => setFlightType('international')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              flightType === 'international' 
                ? "bg-primary text-primary-foreground shadow-soft" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              International
            </span>
          </button>
        </div>

        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setTripType('roundtrip')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tripType === 'roundtrip' 
                ? "bg-card text-foreground shadow-soft" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('oneway')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tripType === 'oneway' 
                ? "bg-card text-foreground shadow-soft" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            One Way
          </button>
        </div>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* From */}
        <div className="relative">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">From</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="City or Airport"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setShowFromSuggestions(true);
                setFromAirport(null);
              }}
              onFocus={() => setShowFromSuggestions(true)}
              className="pl-10"
            />
          </div>
          {showFromSuggestions && from && fromSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-48 overflow-y-auto">
              {fromSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => selectFromAirport(airport)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="font-medium">{airport.city} ({airport.code})</div>
                  <div className="text-xs text-muted-foreground">{airport.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (visible on larger screens) */}
        <div className="hidden lg:flex items-end justify-center pb-1.5 -mx-4">
          <button
            onClick={swapLocations}
            className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* To */}
        <div className="relative lg:-ml-8">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">To</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="City or Airport"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setShowToSuggestions(true);
                setToAirport(null);
              }}
              onFocus={() => setShowToSuggestions(true)}
              className="pl-10"
            />
          </div>
          {showToSuggestions && to && toSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-48 overflow-y-auto">
              {toSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => selectToAirport(airport)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="font-medium">{airport.city} ({airport.code})</div>
                  <div className="text-xs text-muted-foreground">{airport.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className={cn(tripType === 'roundtrip' ? "lg:col-span-1" : "")}>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Departure</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {tripType === 'roundtrip' && (
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">Return</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Passengers */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Passengers</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="flex h-11 w-full rounded-lg border-2 border-input bg-background pl-10 pr-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary transition-all duration-200 md:text-sm appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch}
          variant="skyPrimary"
          size="xl"
          className="w-full md:w-auto md:min-w-[200px]"
        >
          <Search className="w-5 h-5" />
          Search Flights
        </Button>
      </div>
    </div>
  );
};

export default FlightSearch;
