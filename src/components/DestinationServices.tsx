import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hotel, 
  Car, 
  UtensilsCrossed, 
  Star, 
  MapPin,
  Clock,
  Check
} from "lucide-react";
import { getHotelsByCity, getCarRentalsByCity, getEateriesByCity, type Hotel as HotelType, type CarRental, type Eatery } from "@/data/services";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DestinationServicesProps {
  city: string;
}

const DestinationServices = ({ city }: DestinationServicesProps) => {
  const hotels = getHotelsByCity(city);
  const cars = getCarRentalsByCity(city);
  const restaurants = getEateriesByCity(city);
  const [selectedTab, setSelectedTab] = useState('hotels');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBook = (type: string, name: string) => {
    toast.success(`${name} added to your trip!`, {
      description: `We'll send confirmation details to your email.`
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-3 h-3",
              star <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
            )}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  const hasServices = hotels.length > 0 || cars.length > 0 || restaurants.length > 0;

  if (!hasServices) {
    return null;
  }

  return (
    <Card className="mt-6 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          Services in {city}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              Hotels ({hotels.length})
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Cars ({cars.length})
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Dining ({restaurants.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="space-y-3">
            {hotels.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hotels available for {city}</p>
            ) : (
              hotels.map((hotel, idx) => (
                <div 
                  key={hotel.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
                    <div>
                      <div className="font-medium text-foreground">{hotel.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(hotel.rating)}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatPrice(hotel.pricePerNight)}</div>
                    <div className="text-xs text-muted-foreground mb-2">/night</div>
                    <Button 
                      size="sm" 
                      variant="skyPrimary"
                      onClick={() => handleBook('hotel', hotel.name)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="cars" className="space-y-3">
            {cars.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No car rentals available for {city}</p>
            ) : (
              cars.map((car, idx) => (
                <div 
                  key={car.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${car.image})` }} />
                    <div>
                      <div className="font-medium text-foreground">{car.model}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{car.carType}</Badge>
                        <span className="text-xs text-muted-foreground">by {car.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {car.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="text-xs text-muted-foreground flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatPrice(car.pricePerDay)}</div>
                    <div className="text-xs text-muted-foreground mb-2">/day</div>
                    <Button 
                      size="sm" 
                      variant="skyPrimary"
                      onClick={() => handleBook('car', car.model)}
                    >
                      Rent
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-3">
            {restaurants.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No restaurants available for {city}</p>
            ) : (
              restaurants.map((restaurant, idx) => (
                <div 
                  key={restaurant.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${restaurant.image})` }} />
                    <div>
                      <div className="font-medium text-foreground">{restaurant.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(restaurant.rating)}
                        <Badge variant="secondary" className="text-xs">{restaurant.cuisine}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {restaurant.specialties.slice(0, 2).map((specialty) => (
                          <span key={specialty} className="text-xs text-muted-foreground">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{restaurant.priceRange}</div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleBook('restaurant', restaurant.name)}
                    >
                      Reserve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DestinationServices;