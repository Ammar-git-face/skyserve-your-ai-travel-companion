import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Headphones,
  Send,
  HelpCircle,
  FileText,
  CreditCard,
  Plane
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent! We'll respond within 24 hours.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    { icon: Plane, question: "How do I change my flight?", answer: "You can modify your booking through 'My Bookings' or contact support." },
    { icon: CreditCard, question: "What payment methods do you accept?", answer: "We accept Paystack, cards, PayPal, and bank transfers." },
    { icon: FileText, question: "How do I get my boarding pass?", answer: "Check-in online 24 hours before departure to receive your e-boarding pass." },
    { icon: HelpCircle, question: "What's your baggage policy?", answer: "Economy: 23kg checked + 7kg carry-on. Business: 32kg checked + 10kg carry-on." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">Customer Support</h1>
            <p className="text-muted-foreground">We're here to help 24/7</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="hover-lift animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Call Us</div>
                      <div className="text-primary font-medium">+234 800 123 4567</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Email Us</div>
                      <div className="text-primary font-medium">support@skyserve.com</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Live Chat</div>
                      <div className="text-muted-foreground text-sm">Available 24/7</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-sky flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Working Hours</div>
                      <div className="text-muted-foreground text-sm">24 hours, 7 days a week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="How can we help?" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your issue or question..."
                      rows={5}
                      required 
                    />
                  </div>
                  <Button type="submit" variant="skyPrimary" className="w-full md:w-auto">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="hover-lift animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <faq.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Support;