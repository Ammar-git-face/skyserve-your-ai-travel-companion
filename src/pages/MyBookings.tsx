import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, Clock, Ticket, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { allFlights } from "@/data/flights";

interface Booking {
  id: string;
  flight_id: string;
  passenger_name: string;
  passenger_email: string;
  booking_reference: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setBookings(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getFlightDetails = (flightId: string) => {
    return allFlights.find(f => f.id === flightId);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your flight reservations</p>
          </div>

          {bookings.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">You haven't made any flight bookings yet.</p>
                <Button onClick={() => navigate("/")}>Search Flights</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => {
                const flight = getFlightDetails(booking.flight_id);
                return (
                  <Card key={booking.id} className="hover-lift animate-fade-in">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Plane className="w-5 h-5 text-primary" />
                          {flight?.airline || 'Skyserve Airways'}
                        </CardTitle>
                        <Badge variant={booking.payment_status === 'completed' ? 'default' : 'secondary'}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Booking Reference</p>
                          <p className="font-mono font-bold text-primary">{booking.booking_reference}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Passenger</p>
                          <p className="font-medium">{booking.passenger_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Paid</p>
                          <p className="font-bold text-lg">₦{booking.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {flight && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <p className="font-bold text-xl">{flight.departure.time}</p>
                              <p className="text-sm text-muted-foreground">{flight.departure.city}</p>
                            </div>
                            <div className="flex-1 px-4">
                              <div className="relative">
                                <div className="h-0.5 bg-primary/30 rounded-full" />
                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary rotate-90" />
                              </div>
                              <p className="text-center text-xs text-muted-foreground mt-2">{flight.duration}</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-xl">{flight.arrival.time}</p>
                              <p className="text-sm text-muted-foreground">{flight.arrival.city}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.created_at), 'PPP')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(booking.created_at), 'p')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
