-- Add web notification field to notification_settings
ALTER TABLE public.notification_settings 
ADD COLUMN IF NOT EXISTS web_enabled boolean NOT NULL DEFAULT true;

-- Update existing RLS policies if needed
-- The existing policies already work for the new column