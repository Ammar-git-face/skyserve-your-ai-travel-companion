import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PaymentLoadingOverlayProps {
  isVisible: boolean;
}

const PaymentLoadingOverlay = ({ isVisible }: PaymentLoadingOverlayProps) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: CreditCard, text: "Initializing payment..." },
    { icon: Shield, text: "Verifying security..." },
    { icon: Loader2, text: "Processing transaction..." },
  ];

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card p-8 rounded-2xl shadow-elevated max-w-sm w-full mx-4 animate-scale-in">
        {/* Animated plane */}
        <div className="relative h-20 mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-primary/20 rounded-full" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 animate-[fly-across_3s_ease-in-out_infinite]">
            <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        </div>

        {/* Progress steps */}
        <div className="space-y-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === step;
            const isCompleted = idx < step;

            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/10",
                  isCompleted && "opacity-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  isCompleted && "bg-emerald-500 text-white"
                )}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className={cn("w-5 h-5", isActive && idx === 2 && "animate-spin")} />
                  )}
                </div>
                <span className={cn(
                  "font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>256-bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentLoadingOverlay;