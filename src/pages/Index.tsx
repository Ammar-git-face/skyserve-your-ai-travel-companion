import Navbar from "@/components/Navbar";
import FlightSearch from "@/components/FlightSearch";
import ChatBot from "@/components/ChatBot";
import FlightAlerts from "@/components/FlightAlerts";
import { Button } from "@/components/ui/button";
import { Plane, Shield, Globe, Headphones, Clock, Star, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-plane.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        {/* Animated plane decoration */}
        <div className="absolute top-1/4 left-0 w-full pointer-events-none overflow-hidden opacity-20">
          <Plane className="w-16 h-16 text-primary-foreground animate-[fly-across_20s_linear_infinite]" />
        </div>

        {/* Floating Alerts */}
        <div className="absolute top-24 right-6 z-20">
          <FlightAlerts />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-12">
            <div className="animate-slide-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Travel Experience
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
              Your Journey,{" "}
              <span className="text-gradient-gold">Our Priority</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '200ms' }}>
              Experience seamless air travel with AI-powered assistance, real-time updates, and personalized recommendations.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <FlightSearch />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-[slideUp_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-in-up">
              Why Choose Skyserve?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto animate-slide-in-up" style={{ animationDelay: '100ms' }}>
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
              <div 
                key={idx} 
                className="glass-card p-6 text-center hover-lift hover-glow group animate-slide-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-sky flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-sky">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+", label: "Destinations" },
              { value: "1M+", label: "Happy Travelers" },
              { value: "99%", label: "On-time Flights" },
              { value: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center animate-slide-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-sky py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-6 h-6 text-primary-foreground animate-bounce-subtle" />
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
