import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp,
  TrendingDown,
  History,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlightHistory {
  date: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  delay?: number;
}

interface FlightDetailsEnhancedProps {
  flightId: string;
  flightNumber: string;
}

const FlightDetailsEnhanced = ({ flightId, flightNumber }: FlightDetailsEnhancedProps) => {
  // Generate predictive data based on flight ID (for demo purposes)
  const seed = flightId.charCodeAt(0) + flightId.charCodeAt(flightId.length - 1);
  const delayRisk = ((seed * 7) % 40) + 5; // 5-45%
  const rating = 3.5 + ((seed % 15) / 10); // 3.5-5.0
  const onTimePercentage = 100 - delayRisk;

  // Generate flight history
  const flightHistory: FlightHistory[] = [
    { 
      date: '2024-12-01', 
      status: seed % 3 === 0 ? 'delayed' : 'on-time',
      delay: seed % 3 === 0 ? (seed % 30) + 5 : 0
    },
    { 
      date: '2024-11-24', 
      status: seed % 5 === 0 ? 'delayed' : 'on-time',
      delay: seed % 5 === 0 ? (seed % 25) + 10 : 0
    },
    { 
      date: '2024-11-17', 
      status: seed % 7 === 0 ? 'cancelled' : 'on-time',
      delay: 0
    },
  ];

  const getRiskLevel = (risk: number) => {
    if (risk < 15) return { label: 'Low', color: 'text-emerald-600 bg-emerald-500/10', icon: CheckCircle };
    if (risk < 30) return { label: 'Medium', color: 'text-amber-600 bg-amber-500/10', icon: AlertTriangle };
    return { label: 'High', color: 'text-red-600 bg-red-500/10', icon: AlertTriangle };
  };

  const riskInfo = getRiskLevel(delayRisk);

  const getStatusBadge = (status: FlightHistory['status'], delay?: number) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-xs"><CheckCircle className="w-3 h-3 mr-1" />On Time</Badge>;
      case 'delayed':
        return <Badge className="bg-amber-500/10 text-amber-600 border-0 text-xs"><Clock className="w-3 h-3 mr-1" />{delay}min Late</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-600 border-0 text-xs">Cancelled</Badge>;
    }
  };

  return (
    <Card className="mt-6 border-dashed animate-fade-in">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <History className="w-4 h-4 text-primary" />
          Flight Analytics & History
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Delay Risk Indicator */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Delay Risk</span>
              <Badge className={cn("border-0", riskInfo.color)}>
                <riskInfo.icon className="w-3 h-3 mr-1" />
                {riskInfo.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Progress 
                value={delayRisk} 
                className="flex-1 h-2"
              />
              <span className="text-sm font-medium text-foreground">{delayRisk}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on historical data and current conditions
            </p>
          </div>

          {/* Flight Rating */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="text-sm text-muted-foreground mb-2">Flight Rating</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= Math.floor(rating)
                        ? "text-amber-400 fill-amber-400"
                        : star - 0.5 <= rating
                        ? "text-amber-400 fill-amber-400/50"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {120 + seed} passenger reviews
            </p>
          </div>

          {/* On-Time Performance */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="text-sm text-muted-foreground mb-2">On-Time Performance</div>
            <div className="flex items-center gap-2">
              <TrendingUp className={cn(
                "w-5 h-5",
                onTimePercentage >= 80 ? "text-emerald-500" : "text-amber-500"
              )} />
              <span className="text-2xl font-bold text-foreground">{onTimePercentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 30 days performance
            </p>
          </div>
        </div>

        {/* Flight History */}
        <div>
          <div className="text-sm font-medium text-foreground mb-3">Recent Flight History</div>
          <div className="space-y-2">
            {flightHistory.map((history, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{flightNumber}</span>
                  <span className="text-sm text-muted-foreground">{history.date}</span>
                </div>
                {getStatusBadge(history.status, history.delay)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightDetailsEnhanced;