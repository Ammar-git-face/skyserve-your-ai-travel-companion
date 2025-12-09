import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FlightCard from "@/components/FlightCard";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { domesticFlights, internationalFlights, type Flight } from "@/data/flights";
import { ArrowLeft, Filter, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flightType = searchParams.get('type') || 'domestic';
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const allFlights = flightType === 'domestic' ? domesticFlights : internationalFlights;
    const sorted = [...allFlights].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'departure') return a.departure.time.localeCompare(b.departure.time);
      return a.duration.localeCompare(b.duration);
    });
    setFlights(sorted);
  }, [flightType, sortBy]);

  const handleSelectFlight = (flight: Flight) => {
    navigate(`/booking/${flight.id}?passengers=${searchParams.get('passengers') || 1}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {flightType === 'domestic' ? 'Domestic' : 'International'} Flights
                </h1>
                <p className="text-muted-foreground">{flights.length} flights available</p>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              {(['price', 'departure', 'duration'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sortBy === option ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
            ))}
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default SearchResults;
