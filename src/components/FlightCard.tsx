import { Flight } from "@/data/flights";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Clock, 
  Wifi, 
  UtensilsCrossed, 
  Monitor, 
  ChevronRight,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: flight.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'meals':
      case 'snacks':
      case 'gourmet meals':
      case 'french cuisine':
      case 'gourmet dining':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'entertainment':
        return <Monitor className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const classColors = {
    economy: 'bg-secondary text-secondary-foreground',
    business: 'bg-sky-primary/10 text-sky-primary',
    first: 'bg-accent/10 text-gold-dark',
  };

  return (
    <div className="glass-card p-4 lg:p-6 hover:shadow-elevated transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:min-w-[160px]">
          <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center text-primary-foreground font-bold text-sm">
            {flight.airlineCode}
          </div>
          <div>
            <div className="font-semibold text-foreground">{flight.airline}</div>
            <div className="text-sm text-muted-foreground">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex-1 flex items-center gap-4 lg:gap-8">
          {/* Departure */}
          <div className="text-center lg:text-left">
            <div className="text-2xl font-bold text-foreground">{flight.departure.time}</div>
            <div className="text-sm font-medium text-muted-foreground">{flight.departure.code}</div>
            <div className="text-xs text-muted-foreground">{flight.departure.city}</div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
            <div className="text-xs text-muted-foreground">{flight.duration}</div>
            <div className="w-full flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-border rounded-full"></div>
              <Plane className="w-4 h-4 text-primary rotate-90" />
              <div className="h-0.5 flex-1 bg-border rounded-full"></div>
            </div>
            <div className="text-xs text-muted-foreground">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center lg:text-right">
            <div className="text-2xl font-bold text-foreground">{flight.arrival.time}</div>
            <div className="text-sm font-medium text-muted-foreground">{flight.arrival.code}</div>
            <div className="text-xs text-muted-foreground">{flight.arrival.city}</div>
          </div>
        </div>

        {/* Amenities (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 text-muted-foreground">
          {flight.amenities.slice(0, 3).map((amenity) => {
            const icon = getAmenityIcon(amenity);
            return icon ? (
              <div key={amenity} className="p-1.5 rounded-md bg-secondary" title={amenity}>
                {icon}
              </div>
            ) : null;
          })}
        </div>

        {/* Price & Book */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 lg:min-w-[140px]">
          <div className="flex flex-col items-start lg:items-end">
            <Badge className={cn("text-xs", classColors[flight.class])}>
              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
            </Badge>
            <div className="text-2xl font-bold text-foreground mt-1">{formatPrice(flight.price)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {flight.seatsAvailable} seats left
            </div>
          </div>
          <Button 
            onClick={() => onSelect(flight)}
            variant="skyPrimary"
            className="group-hover:shadow-lg"
          >
            Select
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Amenities */}
      <div className="flex lg:hidden items-center gap-2 mt-4 pt-4 border-t border-border text-muted-foreground">
        {flight.amenities.slice(0, 4).map((amenity) => (
          <Badge key={amenity} variant="secondary" className="text-xs">
            {amenity}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FlightCard;
