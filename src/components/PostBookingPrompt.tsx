import { Button } from "@/components/ui/button";
import { 
  Hotel, 
  Car, 
  X,
  ChevronRight,
  Star,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getHotelsByCity, getCarRentalsByCity, type Hotel as HotelType, type CarRental } from "@/data/services";

interface PostBookingPromptProps {
  destinationCity: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectHotel?: (hotel: HotelType) => void;
  onSelectCar?: (car: CarRental) => void;
  onSkip: () => void;
}

const PostBookingPrompt = ({ 
  destinationCity, 
  isOpen, 
  onClose, 
  onSelectHotel,
  onSelectCar,
  onSkip 
}: PostBookingPromptProps) => {
  if (!isOpen) return null;

  const hotels = getHotelsByCity(destinationCity);
  const cars = getCarRentalsByCity(destinationCity);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sky-deep/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto glass-card animate-scale-in">
        {/* Header */}
        <div className="gradient-sky p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground">
              Enhance Your Trip to {destinationCity}
            </h2>
            <p className="text-primary-foreground/80 mt-1">
              Complete your travel experience with these recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hotels Section */}
          {hotels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Recommended Hotels</h3>
              </div>
              <div className="grid gap-4">
                {hotels.slice(0, 2).map((hotel) => (
                  <div 
                    key={hotel.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all cursor-pointer group"
                    onClick={() => onSelectHotel?.(hotel)}
                  >
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: hotel.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hotel.city}
                        </span>
                      </div>
                      <div className="mt-1 font-bold text-primary">
                        {formatPrice(hotel.pricePerNight)}/night
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport Section */}
          {cars.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Airport Transport</h3>
              </div>
              <div className="grid gap-4">
                {cars.slice(0, 2).map((car) => (
                  <div 
                    key={car.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all cursor-pointer group"
                    onClick={() => onSelectCar?.(car)}
                  >
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{car.model}</h4>
                      <div className="text-sm text-muted-foreground">
                        {car.company} • {car.carType} • {car.seats} seats
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {car.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 font-bold text-primary">
                        {formatPrice(car.pricePerDay)}/day
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No recommendations */}
          {hotels.length === 0 && cars.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No recommendations available for {destinationCity} at this time.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button
            variant="skyPrimary"
            className="flex-1"
            onClick={() => {
              // Open hotel booking
              window.open('https://booking.com', '_blank');
            }}
          >
            <Hotel className="w-4 h-4" />
            Book Hotel
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Open car rental
              window.open('https://hertz.com', '_blank');
            }}
          >
            <Car className="w-4 h-4" />
            Book Transport
          </Button>
          <Button
            variant="ghost"
            onClick={onSkip}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostBookingPrompt;
