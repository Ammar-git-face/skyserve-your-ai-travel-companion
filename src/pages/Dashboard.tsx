import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import NotificationSettingsPanel from "@/components/NotificationSettingsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Plane, 
  Bell, 
  Settings, 
  Ticket, 
  Calendar,
  Loader2 
} from "lucide-react";
import { allFlights } from "@/data/flights";
import { format } from "date-fns";

interface Booking {
  id: string;
  flight_id: string;
  passenger_name: string;
  booking_reference: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsData) {
        setBookings(bookingsData);
      }

      setLoading(false);
    };

    if (user) {
      fetchData();
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Traveler'}!
            </h1>
            <p className="text-muted-foreground">Manage your bookings and preferences</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="hover-lift animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {bookings.filter(b => b.payment_status === 'completed').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Confirmed Flights</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-sm text-muted-foreground">Upcoming Trips</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Bookings</span>
                    <Button variant="outline" size="sm" onClick={() => navigate('/my-bookings')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>
                        Search Flights
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => {
                        const flight = getFlightDetails(booking.flight_id);
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center">
                                <Plane className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {flight ? `${flight.departure.city} → ${flight.arrival.city}` : 'Flight'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(booking.created_at), 'MMM d, yyyy')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm text-primary">{booking.booking_reference}</div>
                              <div className="text-sm text-muted-foreground">₦{booking.total_amount.toLocaleString()}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettingsPanel />
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground">Full Name</div>
                      <div className="font-medium text-foreground">{profile?.full_name || 'Not set'}</div>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium text-foreground">{user?.email || 'Not set'}</div>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium text-foreground">{profile?.phone || 'Not set'}</div>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="font-medium text-foreground">
                        {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Dashboard;