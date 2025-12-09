import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff,
  Volume2,
  Globe,
  Plane,
  Hotel,
  Car,
  UtensilsCrossed,
  HelpCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  destinationCity?: string;
}

const ChatBot = ({ destinationCity }: ChatBotProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your Skyserve AI assistant. I can help you with:\n\n• Flight bookings & modifications\n• Delay and cancellation info\n• Baggage rules & policies\n• Refund requests\n• Airport directions\n• Gate changes & queue alerts\n\nHow can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ha' | 'yo' | 'ig'>('en');
  const [isTyping, setIsTyping] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: Plane, label: 'Flight Status', query: 'Check my flight status' },
    { icon: Hotel, label: 'Hotels', query: 'Suggest hotels at my destination' },
    { icon: Car, label: 'Transport', query: 'Book a ride from airport' },
    { icon: UtensilsCrossed, label: 'Restaurants', query: 'Recommend restaurants nearby' },
  ];

  const languageNames = {
    en: 'English',
    ha: 'Hausa',
    yo: 'Yoruba',
    ig: 'Igbo'
  };

  const languageCodes = {
    en: 'en-US',
    ha: 'ha-NG',
    yo: 'yo-NG',
    ig: 'ig-NG'
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Booking questions
    if (lowerMessage.includes('book') || lowerMessage.includes('booking') || lowerMessage.includes('reserve')) {
      return `I can help you with bookings! Here's what I can assist with:\n\n✈️ **New Flight Booking**: Search from our homepage\n📝 **Modify Booking**: Go to "My Bookings" and select your flight\n❌ **Cancel Booking**: Contact support or use the booking portal\n\nTo book a new flight, I'll redirect you to search. Or provide your booking reference to check status.`;
    }

    // Delay and cancellation
    if (lowerMessage.includes('delay') || lowerMessage.includes('delayed') || lowerMessage.includes('cancel')) {
      return `**Flight Delay/Cancellation Information:**\n\n⏰ **Delays**: Delays are shown in real-time on your booking. You'll receive SMS/Email alerts.\n\n❌ **Cancellations**: If your flight is cancelled:\n• You're entitled to a full refund OR rebooking\n• Compensation may apply for delays over 3 hours\n• Contact our support team for immediate assistance\n\n📞 **Emergency Line**: +234 800 123 4567`;
    }

    // Baggage rules
    if (lowerMessage.includes('baggage') || lowerMessage.includes('luggage') || lowerMessage.includes('bag')) {
      return `**Baggage Allowance:**\n\n✈️ **Economy Class**:\n• Checked: 23kg (1 piece)\n• Carry-on: 7kg\n• Personal item: Small bag\n\n💼 **Business Class**:\n• Checked: 32kg (2 pieces)\n• Carry-on: 10kg\n• Personal item: Laptop bag\n\n⚠️ **Excess Baggage**: ₦5,000/kg for domestic, ₦15,000/kg for international\n\n🚫 **Prohibited Items**: Liquids over 100ml, sharp objects, batteries over 160Wh`;
    }

    // Refunds
    if (lowerMessage.includes('refund') || lowerMessage.includes('money back') || lowerMessage.includes('reimburse')) {
      return `**Refund Policy:**\n\n💰 **Refund Timeline**:\n• Card payments: 5-10 business days\n• Bank transfers: 3-5 business days\n• Paystack: Instant to 48 hours\n\n📋 **Refund Eligibility**:\n• Full refund for flight cancellations by airline\n• Partial refund based on fare rules for voluntary cancellations\n• No refund for no-shows (except premium fares)\n\n📝 To request a refund, go to "My Bookings" or contact support.`;
    }

    // Airport directions
    if (lowerMessage.includes('airport') || lowerMessage.includes('direction') || lowerMessage.includes('terminal') || lowerMessage.includes('where')) {
      return `**Airport Information:**\n\n🛫 **Lagos (LOS)**:\n• Terminal 1: Domestic\n• Terminal 2: International (MM2)\n\n🛬 **Abuja (ABV)**:\n• Single terminal with domestic & international wings\n\n📍 **Arrival Tips**:\n• Arrive 2 hours before domestic flights\n• Arrive 3 hours before international flights\n• Download our app for real-time gate updates\n\nNeed specific directions? Tell me your departure airport!`;
    }

    // Gate changes and queue alerts
    if (lowerMessage.includes('gate') || lowerMessage.includes('queue') || lowerMessage.includes('boarding')) {
      return `**Gate & Queue Information:**\n\n🚪 **Gate Changes**:\n• Gate assignments are confirmed 45-60 min before departure\n• You'll receive push notifications for any changes\n• Check airport screens for updates\n\n👥 **Queue Alerts**:\n• Security: Currently moderate (15-20 min)\n• Immigration: Normal flow\n• Priority lanes available for Business class\n\n✅ Enable notifications in your dashboard for real-time alerts!`;
    }

    // Customer support
    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact') || lowerMessage.includes('speak')) {
      return `**Customer Support:**\n\n📞 **Phone**: +234 800 123 4567 (24/7)\n📧 **Email**: support@skyserve.com\n💬 **Live Chat**: Available in-app\n🏢 **Office**: Lagos, Abuja, Port Harcourt\n\n⏱️ **Response Times**:\n• Phone: Immediate\n• Chat: Under 5 minutes\n• Email: Within 24 hours\n\nWould you like me to connect you to a live agent?`;
    }

    // Flight status
    if (lowerMessage.includes('flight status') || lowerMessage.includes('my flight') || lowerMessage.includes('track')) {
      return `I'd be happy to check your flight status! Please provide:\n\n• **Flight number** (e.g., SK201) OR\n• **Booking reference** (e.g., SK7X9K2)\n\nYou can also check the Flight Status page for real-time updates including:\n• Departure/arrival times\n• Gate information\n• Delay alerts`;
    }

    // Hotel suggestions
    if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
      const city = destinationCity || 'your destination';
      return `Here are hotel recommendations for ${city}:\n\n🏨 **Luxury**: The Ritz - From ₦450,000/night\n🏨 **Mid-range**: JW Marriott - From ₦180,000/night\n🏨 **Budget**: Premier Inn - From ₦85,000/night\n\nAll hotels offer airport shuttle services. Would you like me to help you book?`;
    }

    // Transport/rides
    if (lowerMessage.includes('ride') || lowerMessage.includes('transport') || lowerMessage.includes('car') || lowerMessage.includes('taxi')) {
      return `**Airport Transport Options:**\n\n🚗 **Luxury Sedan** - Mercedes E-Class - ₦45,000/day\n🚙 **SUV** - Range Rover Sport - ₦85,000/day\n🚕 **Economy** - Toyota Camry - ₦18,000/day\n\n🚖 **Taxi Services**:\n• Airport pickup available 24/7\n• Pre-book for guaranteed availability\n\nWould you like me to arrange a pickup?`;
    }

    // Restaurant suggestions
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('dining')) {
      const city = destinationCity || 'your destination';
      return `Top dining spots near ${city} airport:\n\n🍽️ **Fine Dining**: Sketch - ₦₦₦₦, French/British\n🍽️ **Casual**: Dishoom - ₦₦, Indian cuisine\n🍽️ **Local**: Nkoyo - ₦₦, Nigerian cuisine\n\nMost restaurants accept reservations. Would you like directions?`;
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good')) {
      return `Hello! 👋 Welcome to Skyserve!\n\nI'm here to help with:\n• Flight bookings & changes\n• Delay/cancellation info\n• Baggage policies\n• Refund requests\n• Airport directions\n• Hotel & transport bookings\n\nWhat can I help you with today?`;
    }

    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `You're welcome! Is there anything else I can help you with?\n\n✈️ Safe travels with Skyserve!`;
    }

    // Show bookings command (voice)
    if (lowerMessage.includes('show my bookings') || lowerMessage.includes('my bookings')) {
      return `I'll take you to your bookings page. Redirecting now...\n\n[Click here to view your bookings](/my-bookings)`;
    }

    // Ticket changes (voice)
    if (lowerMessage.includes('ticket change') || lowerMessage.includes('change ticket') || lowerMessage.includes('modify')) {
      return `**How to Change Your Ticket:**\n\n1. Go to "My Bookings"\n2. Select your flight\n3. Click "Modify Booking"\n4. Choose new date/time\n5. Pay any fare difference\n\n⚠️ **Change Fees**:\n• 24+ hours before: Free\n• 12-24 hours: ₦5,000\n• Under 12 hours: ₦10,000\n\nNeed help with a specific booking?`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}".\n\nI can help with:\n• ✈️ Flight bookings & status\n• 🕐 Delays & cancellations\n• 🧳 Baggage rules\n• 💰 Refunds\n• 🗺️ Airport directions\n• 🚪 Gate changes\n• 🏨 Hotels & transport\n\nCould you please be more specific about what you need?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Check for navigation commands
    if (currentInput.toLowerCase().includes('my bookings')) {
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1000);
    }

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = languageCodes[language];

    recognizer.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      
      // Auto-process voice commands
      setTimeout(() => {
        if (transcript.toLowerCase().includes('search flight')) {
          navigate('/');
        } else if (transcript.toLowerCase().includes('show my bookings') || transcript.toLowerCase().includes('my bookings')) {
          navigate('/my-bookings');
        } else {
          // Auto-send the message
          const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: transcript,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          setInput('');
          setIsTyping(true);
          
          setTimeout(() => {
            const response = generateResponse(transcript);
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: response,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
          }, 800);
        }
      }, 300);
    };

    recognizer.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition error. Please try again.');
    };

    recognizer.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognizer);
    recognizer.start();
    setIsListening(true);
    toast.info(`Listening in ${languageNames[language]}...`);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const response = generateResponse(query);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 800);
    }, 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-elevated flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen ? "bg-destructive text-destructive-foreground" : "gradient-sky text-primary-foreground"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-md h-[500px] glass-card flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="gradient-sky px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-primary-foreground">Skyserve Assistant</div>
                <div className="text-xs text-primary-foreground/80">Always here to help</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const langs: ('en' | 'ha' | 'yo' | 'ig')[] = ['en', 'ha', 'yo', 'ig'];
                  const currentIndex = langs.indexOf(language);
                  setLanguage(langs[(currentIndex + 1) % langs.length]);
                  toast.info(`Language: ${languageNames[langs[(currentIndex + 1) % langs.length]]}`);
                }}
                className="p-2 rounded-lg bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                title={`Language: ${languageNames[language]}`}
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language indicator */}
          <div className="px-4 py-2 bg-secondary text-xs text-muted-foreground flex items-center justify-between">
            <span>Speaking in: {languageNames[language]}</span>
            <span className="text-primary">{isListening ? '🎤 Listening...' : ''}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex items-center gap-2">
            <button
              onClick={handleVoiceInput}
              className={cn(
                "p-2 rounded-lg transition-all",
                isListening 
                  ? "bg-destructive text-destructive-foreground animate-pulse" 
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              variant="skyPrimary"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;