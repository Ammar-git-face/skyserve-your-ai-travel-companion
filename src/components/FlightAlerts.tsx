import { useState, useEffect } from "react";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  X,
  Clock,
  Plane
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'delay';
  title: string;
  message: string;
  flightNumber?: string;
  timestamp: Date;
  read: boolean;
}

const FlightAlerts = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Gate Change',
      message: 'Flight SK201 to London has moved to Gate 14B',
      flightNumber: 'SK201',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Delay Alert',
      message: 'Flight SK305 to Port Harcourt is delayed by 25 minutes',
      flightNumber: 'SK305',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Boarding Now',
      message: 'Flight SK410 to Enugu is now boarding at Gate 8A',
      flightNumber: 'SK410',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
      case 'delay':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
      case 'delay':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-sky-50 border-sky-200 text-sky-700';
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'info' as const,
          title: 'Check-in Open',
          message: 'Online check-in is now available for your flight',
        },
        {
          type: 'warning' as const,
          title: 'Weather Advisory',
          message: 'Minor delays expected due to weather conditions',
        },
        {
          type: 'success' as const,
          title: 'Seat Upgrade Available',
          message: 'Business class upgrade available for your next flight',
        },
      ];
      
      const randomNote = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      
      // Only add notification occasionally (20% chance every 30 seconds)
      if (Math.random() < 0.2) {
        setNotifications(prev => [{
          id: Date.now().toString(),
          ...randomNote,
          flightNumber: 'SK' + Math.floor(Math.random() * 900 + 100),
          timestamp: new Date(),
          read: false
        }, ...prev].slice(0, 10));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-[400px] glass-card overflow-hidden z-50 animate-scale-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Flight Alerts</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Plane className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-border last:border-0 transition-colors cursor-pointer hover:bg-accent/50",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        getColors(notification.type)
                      )}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-foreground text-sm">
                            {notification.title}
                          </h4>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="p-1 hover:bg-accent rounded"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.timestamp)}
                          {notification.flightNumber && (
                            <>
                              <span>•</span>
                              <span className="font-medium">{notification.flightNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlightAlerts;
