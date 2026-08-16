CREATE TABLE public.partner_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT NOT NULL,
  location TEXT,
  cuisine TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.partner_leads TO anon;
GRANT INSERT, SELECT ON public.partner_leads TO authenticated;
GRANT ALL ON public.partner_leads TO service_role;
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a partner lead" ON public.partner_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view partner leads" ON public.partner_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));