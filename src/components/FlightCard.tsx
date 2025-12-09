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
  Users,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  index?: number;
}

const FlightCard = ({ flight, onSelect, index = 0 }: FlightCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: flight.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d');
    } catch {
      return dateStr;
    }
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
    <div 
      className="glass-card p-4 lg:p-6 hover:shadow-elevated transition-all duration-500 group hover-lift animate-slide-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:min-w-[160px]">
          <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform duration-300">
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
            <div className="text-xs text-muted-foreground">{formatDate(flight.departure.date)}</div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-[100px]">
            <div className="text-xs text-muted-foreground font-medium">{flight.duration}</div>
            <div className="w-full flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
              </div>
              <Plane className="w-5 h-5 text-primary rotate-90 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />
            </div>
            <div className="text-xs text-muted-foreground">
              {flight.stops === 0 ? (
                <span className="text-emerald-600 font-medium">Direct</span>
              ) : (
                `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`
              )}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center lg:text-right">
            <div className="text-2xl font-bold text-foreground">{flight.arrival.time}</div>
            <div className="text-sm font-medium text-muted-foreground">{flight.arrival.code}</div>
            <div className="text-xs text-muted-foreground">{formatDate(flight.arrival.date)}</div>
          </div>
        </div>

        {/* Amenities (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 text-muted-foreground">
          {flight.amenities.slice(0, 3).map((amenity) => {
            const icon = getAmenityIcon(amenity);
            return icon ? (
              <div 
                key={amenity} 
                className="p-1.5 rounded-md bg-secondary hover:bg-primary/10 hover:text-primary transition-colors" 
                title={amenity}
              >
                {icon}
              </div>
            ) : null;
          })}
        </div>

        {/* Price & Book */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 lg:min-w-[140px]">
          <div className="flex flex-col items-start lg:items-end">
            <Badge className={cn("text-xs transition-all duration-300 group-hover:scale-105", classColors[flight.class])}>
              {flight.class === 'first' && <Sparkles className="w-3 h-3 mr-1" />}
              {flight.class.charAt(0).toUpperCase() + flight.class.slice(1)}
            </Badge>
            <div className="text-2xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
              {formatPrice(flight.price)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span className={cn(
                flight.seatsAvailable < 10 ? "text-destructive font-medium" : ""
              )}>
                {flight.seatsAvailable} seats left
              </span>
            </div>
          </div>
          <Button 
            onClick={() => onSelect(flight)}
            variant="skyPrimary"
            className="group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
          >
            Select
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Mobile Amenities */}
      <div className="flex lg:hidden items-center gap-2 mt-4 pt-4 border-t border-border text-muted-foreground">
        {flight.amenities.slice(0, 4).map((amenity) => (
          <Badge key={amenity} variant="secondary" className="text-xs animate-fade-in">
            {amenity}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FlightCard;
