import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import PostBookingPrompt from "@/components/PostBookingPrompt";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { allFlights } from "@/data/flights";
import { ArrowLeft, CheckCircle, Plane, Calendar, Users } from "lucide-react";

const Booking = () => {
  const { flightId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const passengers = parseInt(searchParams.get('passengers') || '1');
  
  const flight = allFlights.find(f => f.id === flightId);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  if (!flight) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Flight not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (details: { bookingReference: string }) => {
    setBookingRef(details.bookingReference);
    setBookingComplete(true);
    setShowPrompt(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {!bookingComplete ? (
            <>
              {/* Flight Summary */}
              <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <div className="font-semibold">{flight.flightNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {flight.departure.city} → {flight.arrival.city}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <Calendar className="w-4 h-4" />
                  {flight.departure.date}
                  <Users className="w-4 h-4 ml-2" />
                  {passengers} passenger{passengers > 1 ? 's' : ''}
                </div>
              </div>

              <BookingForm flight={flight} passengers={passengers} onComplete={handleBookingComplete} />
            </>
          ) : (
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-4">Your booking reference is</p>
              <div className="text-4xl font-bold text-primary mb-6">{bookingRef}</div>
              
              <div className="p-4 rounded-xl bg-secondary/50 mb-6">
                <div className="flex items-center justify-center gap-4">
                  <Plane className="w-6 h-6 text-primary" />
                  <span className="font-semibold">{flight.departure.city}</span>
                  <span>→</span>
                  <span className="font-semibold">{flight.arrival.city}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {flight.departure.date} at {flight.departure.time}
                </p>
              </div>

              <Button onClick={() => navigate('/')} variant="skyPrimary" size="lg">
                Book Another Flight
              </Button>
            </div>
          )}
        </div>
      </main>

      <PostBookingPrompt 
        destinationCity={flight.arrival.city}
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSkip={() => setShowPrompt(false)}
      />

      <ChatBot destinationCity={flight.arrival.city} />
    </div>
  );
};

export default Booking;
