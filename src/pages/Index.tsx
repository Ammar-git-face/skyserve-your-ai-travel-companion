import Navbar from "@/components/Navbar";
import FlightSearch from "@/components/FlightSearch";
import ChatBot from "@/components/ChatBot";
import FlightAlerts from "@/components/FlightAlerts";
import { Button } from "@/components/ui/button";
import { Plane, Shield, Globe, Headphones, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-plane.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        {/* Floating Alerts */}
        <div className="absolute top-24 right-6 z-20">
          <FlightAlerts />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Your Journey,{" "}
              <span className="text-gradient-gold">Our Priority</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Experience seamless air travel with AI-powered assistance, real-time updates, and personalized recommendations.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <FlightSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Skyserve?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We combine cutting-edge technology with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Headphones, title: "AI Assistant", desc: "24/7 multilingual support with voice commands" },
              { icon: Clock, title: "Smart Alerts", desc: "Real-time delay and gate change notifications" },
              { icon: Globe, title: "Global Network", desc: "Fly to 50+ destinations worldwide" },
              { icon: Shield, title: "Secure Booking", desc: "256-bit encrypted payment processing" },
              { icon: Star, title: "Travel Rewards", desc: "Earn points on every flight" },
              { icon: Plane, title: "Premium Experience", desc: "Comfort across all cabin classes" },
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-6 text-center hover:shadow-elevated transition-all group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-sky flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-sky py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-6 h-6 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">Skyserve</span>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            © 2024 Skyserve Airways. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Index;
