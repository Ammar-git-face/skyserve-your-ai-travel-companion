import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Bell,
  Loader2,
  Save,
  CheckCircle
} from "lucide-react";

interface NotificationSettings {
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  web_enabled: boolean;
}

const NotificationSettingsPanel = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: true,
    whatsapp_enabled: false,
    sms_enabled: false,
    web_enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSettings({
          email_enabled: data.email_enabled,
          whatsapp_enabled: data.whatsapp_enabled,
          sms_enabled: data.sms_enabled,
          web_enabled: data.web_enabled ?? true
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('notification_settings')
      .update({
        email_enabled: settings.email_enabled,
        whatsapp_enabled: settings.whatsapp_enabled,
        sms_enabled: settings.sms_enabled,
        web_enabled: settings.web_enabled,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Notification settings saved!", {
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />
      });
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const notificationOptions = [
    {
      key: 'email_enabled' as const,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive booking confirmations and flight updates via email'
    },
    {
      key: 'whatsapp_enabled' as const,
      icon: MessageSquare,
      title: 'WhatsApp Notifications',
      description: 'Get instant WhatsApp messages for flight alerts and changes'
    },
    {
      key: 'sms_enabled' as const,
      icon: Phone,
      title: 'SMS Notifications',
      description: 'Receive text messages for critical flight updates'
    },
    {
      key: 'web_enabled' as const,
      icon: Bell,
      title: 'In-App Notifications',
      description: 'Show notifications within the Skyserve app'
    }
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Choose how you want to receive updates about your flights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option, idx) => (
          <div 
            key={option.key}
            className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <option.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor={option.key} className="font-medium text-foreground cursor-pointer">
                  {option.title}
                </Label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
            <Switch
              id={option.key}
              checked={settings[option.key]}
              onCheckedChange={() => toggleSetting(option.key)}
            />
          </div>
        ))}

        <Button 
          onClick={handleSave} 
          className="w-full mt-6" 
          variant="skyPrimary"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsPanel;