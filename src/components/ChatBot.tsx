import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your Skyserve AI assistant. I can help you with flight bookings, check flight status, answer questions, or suggest hotels, rides, and restaurants at your destination. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ha' | 'yo'>('en');
  const [isTyping, setIsTyping] = useState(false);
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
    yo: 'Yoruba'
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Flight status queries
    if (lowerMessage.includes('flight status') || lowerMessage.includes('my flight')) {
      return `I'd be happy to check your flight status! Please provide your booking reference or flight number (e.g., SK201) and I'll give you real-time updates including gate information, departure times, and any delays.`;
    }
    
    // Hotel suggestions
    if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
      const city = destinationCity || 'your destination';
      return `Great choice! Here are my top hotel recommendations for ${city}:\n\n🏨 **Luxury**: The Ritz - From ₦450,000/night\n🏨 **Mid-range**: JW Marriott - From ₦180,000/night\n🏨 **Budget-friendly**: Premier Inn - From ₦85,000/night\n\nWould you like me to help you book any of these, or would you prefer more options?`;
    }
    
    // Transport/rides
    if (lowerMessage.includes('ride') || lowerMessage.includes('transport') || lowerMessage.includes('car') || lowerMessage.includes('taxi')) {
      return `I can help you arrange airport transport! We partner with several providers:\n\n🚗 **Luxury Sedan** - Mercedes E-Class - ₦45,000/day\n🚙 **SUV** - Range Rover Sport - ₦85,000/day\n🚕 **Economy** - Ford Focus - ₦18,000/day\n\nWould you like to book now or need a pickup from the airport?`;
    }
    
    // Restaurant suggestions
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('dining')) {
      const city = destinationCity || 'your destination';
      return `Here are my top dining recommendations for ${city}:\n\n🍽️ **Fine Dining**: Sketch - $$$$, French/British\n🍽️ **Casual**: Dishoom - $$, Indian cuisine\n🍽️ **Local Favorite**: Nkoyo - $$, Nigerian cuisine\n\nWould you like directions or to make a reservation?`;
    }
    
    // Booking help
    if (lowerMessage.includes('book') || lowerMessage.includes('booking') || lowerMessage.includes('reserve')) {
      return `I can help you with bookings! Here's what I can assist with:\n\n✈️ Flight bookings and modifications\n🏨 Hotel reservations\n🚗 Car rentals and airport transfers\n🍽️ Restaurant reservations\n\nWhat would you like to book today?`;
    }
    
    // Gate information
    if (lowerMessage.includes('gate') || lowerMessage.includes('terminal')) {
      return `To check your departure gate, please provide your flight number or booking reference. Gate assignments are typically confirmed 45-60 minutes before departure. I'll also alert you if there are any gate changes!`;
    }
    
    // Delays
    if (lowerMessage.includes('delay') || lowerMessage.includes('delayed') || lowerMessage.includes('on time')) {
      return `I can check if your flight is delayed! Please share your flight number (e.g., SK201) or booking reference, and I'll provide real-time status updates including any alternative flight suggestions if needed.`;
    }
    
    // Special assistance
    if (lowerMessage.includes('special assistance') || lowerMessage.includes('wheelchair') || lowerMessage.includes('disability')) {
      return `Skyserve is committed to accessibility! We offer:\n\n♿ Wheelchair assistance\n👁️ Visual impairment support\n🦻 Hearing assistance\n🧳 Extra baggage accommodation\n\nYou can request special assistance during booking or contact our support team 48 hours before your flight.`;
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 Welcome to Skyserve! I'm here to make your travel experience seamless. I can help you with:\n\n• Flight searches and bookings\n• Real-time flight status\n• Hotel and transport recommendations\n• Restaurant suggestions\n• Special assistance requests\n\nHow can I help you today?`;
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `You're welcome! It's my pleasure to assist you. Is there anything else I can help you with? Safe travels! ✈️`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". Let me help you with that!\n\nI can assist with:\n• Flight bookings and status\n• Gate and delay information\n• Hotel recommendations\n• Airport transport\n• Dining suggestions\n\nCould you please provide more details about what you need?`;
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
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      // Voice recognition would be implemented here
      // For demo, we'll just toggle the state
      if (!isListening) {
        setTimeout(() => {
          setInput("Check my flight status for SK201");
          setIsListening(false);
        }, 2000);
      }
    } else {
      alert('Voice input is not supported in your browser');
    }
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => {
      handleSend();
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
                  const langs: ('en' | 'ha' | 'yo')[] = ['en', 'ha', 'yo'];
                  const currentIndex = langs.indexOf(language);
                  setLanguage(langs[(currentIndex + 1) % langs.length]);
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
          <div className="px-4 py-2 bg-secondary text-xs text-muted-foreground">
            Speaking in: {languageNames[language]}
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
                "p-2 rounded-lg transition-colors",
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
