import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Search, Clock, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { allFlights } from "@/data/flights";

const FlightStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(allFlights.slice(0, 5));

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(allFlights.slice(0, 5));
      return;
    }
    const results = allFlights.filter(
      f => f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.departure.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.arrival.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" />On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" />Delayed</Badge>;
      case 'boarding':
        return <Badge className="bg-primary/10 text-primary border-primary/20"><Plane className="w-3 h-3 mr-1" />Boarding</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Flight Status</h1>
              <p className="text-muted-foreground">Track any flight in real-time</p>
            </div>

            {/* Search */}
            <Card className="mb-8 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter flight number or city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch} variant="skyPrimary">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              {searchResults.map((flight, idx) => {
                const statuses = ['on-time', 'delayed', 'boarding', 'on-time', 'on-time'];
                const status = statuses[idx % statuses.length];
                
                return (
                  <Card key={flight.id} className="hover-lift animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-foreground">{flight.flightNumber}</div>
                            <div className="text-sm text-muted-foreground">{flight.airline}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <div className="font-bold text-xl">{flight.departure.time}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {flight.departure.code}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {flight.duration}
                            </div>
                            <div className="w-24 h-0.5 bg-primary/30 rounded-full my-1" />
                            <Plane className="w-4 h-4 text-primary rotate-90" />
                          </div>
                          
                          <div className="text-center">
                            <div className="font-bold text-xl">{flight.arrival.time}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {flight.arrival.code}
                            </div>
                          </div>
                        </div>

                        {getStatusBadge(status)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default FlightStatus;