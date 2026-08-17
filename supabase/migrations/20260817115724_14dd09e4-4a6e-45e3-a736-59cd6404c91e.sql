CREATE TYPE public.energy_level AS ENUM ('good','tired','exhausted');

CREATE TABLE public.rider_health_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  energy_level public.energy_level NOT NULL,
  hours_since_break numeric NOT NULL DEFAULT 0,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.rider_health_checkins TO authenticated;
GRANT ALL ON public.rider_health_checkins TO service_role;

ALTER TABLE public.rider_health_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins self insert" ON public.rider_health_checkins
  FOR INSERT TO authenticated
  WITH CHECK (rider_id = auth.uid());

CREATE POLICY "checkins self read" ON public.rider_health_checkins
  FOR SELECT TO authenticated
  USING (rider_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "checkins admin update" ON public.rider_health_checkins
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "checkins admin delete" ON public.rider_health_checkins
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX rider_health_checkins_rider_created_idx
  ON public.rider_health_checkins (rider_id, created_at DESC);