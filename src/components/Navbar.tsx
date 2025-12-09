import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isHome ? "bg-transparent" : "bg-card/95 backdrop-blur-xl border-b border-border shadow-soft"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isHome ? "bg-accent" : "gradient-sky"
            )}>
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className={cn(
              "text-xl font-bold transition-colors",
              isHome ? "text-primary-foreground" : "text-foreground"
            )}>
              Skyserve
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={cn(
                "font-medium transition-colors hover:text-accent",
                isHome ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Flights
            </Link>
            <Link 
              to="/my-bookings" 
              className={cn(
                "font-medium transition-colors",
                isHome ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              My Bookings
            </Link>
            <Link 
              to="/flight-status" 
              className={cn(
                "font-medium transition-colors",
                isHome ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Flight Status
            </Link>
            <Link 
              to="/support" 
              className={cn(
                "font-medium transition-colors",
                isHome ? "text-primary-foreground/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Support
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button 
              variant={isHome ? "glass" : "ghost"} 
              size="sm"
              className={cn(
                isHome && "text-primary-foreground border-primary-foreground/20"
              )}
            >
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button variant={isHome ? "hero" : "default"} size="sm">
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isHome ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-accent"
            )}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-elevated animate-slide-in-up">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                to="/" 
                className="block py-2 text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flights
              </Link>
              <Link 
                to="/my-bookings" 
                className="block py-2 text-muted-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link 
                to="/flight-status" 
                className="block py-2 text-muted-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flight Status
              </Link>
              <Link 
                to="/support" 
                className="block py-2 text-muted-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex gap-3 pt-3 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1">
                  Sign In
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
