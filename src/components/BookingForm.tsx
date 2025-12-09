import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Flight } from "@/data/flights";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  Lock,
  ArrowRight,
  Shield,
  Plane,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  flight: Flight;
  passengers: number;
  onComplete: (bookingDetails: BookingDetails) => void;
}

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  specialAssistance: string;
}

interface BookingDetails {
  passengers: PassengerInfo[];
  paymentComplete: boolean;
  bookingReference: string;
}

const BookingForm = ({ flight, passengers, onComplete }: BookingFormProps) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirm'>('details');
  const [passengerDetails, setPassengerDetails] = useState<PassengerInfo[]>(
    Array.from({ length: passengers }, () => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      specialAssistance: ''
    }))
  );
  const [createAccount, setCreateAccount] = useState(true);
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: flight.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = flight.price * passengers;

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    setPassengerDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bookingReference = 'SK' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    onComplete({
      passengers: passengerDetails,
      paymentComplete: true,
      bookingReference
    });
  };

  const validateDetails = () => {
    return passengerDetails.every(p => 
      p.firstName && p.lastName && p.email && p.phone && p.dob
    );
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Progress Steps */}
      <div className="gradient-sky p-4">
        <div className="flex items-center justify-center gap-4">
          <div className={cn(
            "flex items-center gap-2",
            step === 'details' ? "text-primary-foreground" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
              step === 'details' ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30"
            )}>
              {step === 'payment' || step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <span className="hidden sm:inline font-medium">Passenger Details</span>
          </div>
          <div className="w-8 h-0.5 bg-primary-foreground/30" />
          <div className={cn(
            "flex items-center gap-2",
            step === 'payment' ? "text-primary-foreground" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
              step === 'payment' ? "bg-primary-foreground text-primary" : 
              step === 'confirm' ? "bg-primary-foreground/30" : "bg-primary-foreground/30"
            )}>
              {step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : "2"}
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
          <div className="w-8 h-0.5 bg-primary-foreground/30" />
          <div className={cn(
            "flex items-center gap-2",
            step === 'confirm' ? "text-primary-foreground" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
              step === 'confirm' ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30"
            )}>
              3
            </div>
            <span className="hidden sm:inline font-medium">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Step 1: Passenger Details */}
        {step === 'details' && (
          <div className="space-y-8">
            {passengerDetails.map((passenger, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Passenger {index + 1}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Title</Label>
                    <select
                      value={passenger.title}
                      onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                      className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                  
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={passenger.dob}
                      onChange={(e) => updatePassenger(index, 'dob', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                        placeholder="email@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                        placeholder="+234 xxx xxx xxxx"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Special Assistance (Optional)</Label>
                  <Textarea
                    value={passenger.specialAssistance}
                    onChange={(e) => updatePassenger(index, 'specialAssistance', e.target.value)}
                    placeholder="Wheelchair assistance, dietary requirements, medical conditions, etc."
                    className="resize-none"
                  />
                </div>

                {index < passengerDetails.length - 1 && (
                  <div className="border-b border-border mt-6" />
                )}
              </div>
            ))}

            {/* Account Creation */}
            <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="createAccount" 
                  checked={createAccount}
                  onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
                />
                <label htmlFor="createAccount" className="text-sm font-medium cursor-pointer">
                  Create a Skyserve account to manage your bookings
                </label>
              </div>
              
              {createAccount && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pl-10"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={() => setStep('payment')}
              disabled={!validateDetails()}
              variant="skyPrimary"
              size="lg"
              className="w-full"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight</span>
                  <span className="font-medium">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route</span>
                  <span className="font-medium">{flight.departure.city} → {flight.arrival.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{flight.departure.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Passengers</span>
                  <span className="font-medium">{passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per ticket</span>
                  <span className="font-medium">{formatPrice(flight.price)}</span>
                </div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Details
              </h3>

              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry Date</Label>
                  <Input placeholder="MM/YY" maxLength={5} />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input type="password" placeholder="•••" maxLength={4} />
                </div>
              </div>

              <div>
                <Label>Cardholder Name</Label>
                <Input placeholder="Name on card" />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-700">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
                <a href="#" className="text-primary underline">Privacy Policy</a>
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!agreeTerms || isProcessing}
                variant="goldPremium"
                size="lg"
                className="flex-1"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>Pay {formatPrice(totalPrice)}</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
