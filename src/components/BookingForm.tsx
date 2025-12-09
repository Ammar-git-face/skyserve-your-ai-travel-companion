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
  CheckCircle,
  Wallet,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

type PaymentMethod = 'paystack' | 'card' | 'paypal' | 'stripe';

const BookingForm = ({ flight, passengers, onComplete }: BookingFormProps) => {
  const { user } = useAuth();
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');

  const saveBookingToDatabase = async (bookingReference: string) => {
    if (!user) {
      console.log('User not logged in, booking not saved to database');
      return;
    }

    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        flight_id: flight.id,
        passenger_name: `${passengerDetails[0].firstName} ${passengerDetails[0].lastName}`,
        passenger_email: passengerDetails[0].email,
        passenger_phone: passengerDetails[0].phone,
        special_assistance: passengerDetails[0].specialAssistance || null,
        payment_method: paymentMethod,
        payment_status: 'completed',
        total_amount: flight.price * passengers,
        booking_reference: bookingReference
      });

      if (error) {
        console.error('Error saving booking:', error);
        toast.error('Booking saved but could not sync to your account');
      }
    } catch (err) {
      console.error('Error saving booking:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: flight.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const totalPrice = flight.price * passengers;

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    setPassengerDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePaystackPayment = () => {
    setIsProcessing(true);
    
    // Paystack test integration
    const handler = (window as any).PaystackPop?.setup({
      key: 'pk_test_7e6829f756e07096d2d2e3b97d692a6105e62d2a',
      email: passengerDetails[0].email,
      amount: totalPrice * 100, // Amount in kobo
      currency: 'NGN',
      ref: 'SK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      callback: async function(response: any) {
        toast.success('Payment successful!');
        const bookingReference = response.reference;
        await saveBookingToDatabase(bookingReference);
        onComplete({
          passengers: passengerDetails,
          paymentComplete: true,
          bookingReference
        });
      },
      onClose: function() {
        setIsProcessing(false);
        toast.info('Payment cancelled');
      }
    });
    
    if (handler) {
      handler.openIframe();
    } else {
      // Fallback for demo if Paystack script not loaded
      setTimeout(async () => {
        const bookingReference = 'SK' + Math.random().toString(36).substr(2, 6).toUpperCase();
        toast.success('Payment successful!');
        await saveBookingToDatabase(bookingReference);
        onComplete({
          passengers: passengerDetails,
          paymentComplete: true,
          bookingReference
        });
      }, 2000);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    if (paymentMethod === 'paystack') {
      handlePaystackPayment();
      return;
    }
    
    // Simulate payment processing for other methods
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bookingReference = 'SK' + Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success('Payment successful!');
    
    await saveBookingToDatabase(bookingReference);
    
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

  const paymentMethods = [
    { id: 'paystack' as const, name: 'Paystack', icon: Wallet, description: 'Pay with card, bank transfer, or USSD' },
    { id: 'card' as const, name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Verve' },
    { id: 'paypal' as const, name: 'PayPal', icon: Wallet, description: 'Pay with PayPal account' },
    { id: 'stripe' as const, name: 'Stripe', icon: Building2, description: 'Secure card payment' },
  ];

  return (
    <div className="glass-card overflow-hidden">
      {/* Progress Steps */}
      <div className="gradient-sky p-4">
        <div className="flex items-center justify-center gap-4">
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            step === 'details' ? "text-primary-foreground scale-105" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300",
              step === 'details' ? "bg-primary-foreground text-primary" : "bg-primary-foreground/30"
            )}>
              {step === 'payment' || step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <span className="hidden sm:inline font-medium">Passenger Details</span>
          </div>
          <div className="w-8 h-0.5 bg-primary-foreground/30" />
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            step === 'payment' ? "text-primary-foreground scale-105" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300",
              step === 'payment' ? "bg-primary-foreground text-primary" : 
              step === 'confirm' ? "bg-primary-foreground/30" : "bg-primary-foreground/30"
            )}>
              {step === 'confirm' ? <CheckCircle className="w-5 h-5" /> : "2"}
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
          <div className="w-8 h-0.5 bg-primary-foreground/30" />
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            step === 'confirm' ? "text-primary-foreground scale-105" : "text-primary-foreground/60"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300",
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
          <div className="space-y-8 animate-fade-in">
            {passengerDetails.map((passenger, index) => (
              <div key={index} className="space-y-4 animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
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
                      className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-base transition-all focus:border-primary"
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
            <div className="p-4 rounded-xl bg-secondary/50 space-y-4 animate-fade-in">
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
                <div className="relative animate-slide-in-up">
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
              className="w-full hover:scale-[1.02] transition-transform"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="space-y-6 animate-fade-in">
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
                  <span className="font-medium">{formatDate(flight.departure.date)}</span>
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

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02]",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        paymentMethod === method.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                      )}>
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{method.name}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details for direct card payment */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 rounded-xl border border-border animate-fade-in">
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
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-700 animate-fade-in">
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
                className="flex-1 hover:scale-[1.02] transition-transform"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
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
