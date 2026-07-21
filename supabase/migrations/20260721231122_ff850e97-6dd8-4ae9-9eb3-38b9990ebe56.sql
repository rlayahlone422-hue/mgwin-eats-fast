
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('customer','owner','rider','admin');
CREATE TYPE public.order_status AS ENUM ('placed','confirmed','preparing','ready','picked_up','delivered','cancelled');
CREATE TYPE public.payment_method AS ENUM ('cash','kbzpay','wavepay');
CREATE TYPE public.dispute_status AS ENUM ('open','investigating','resolved','rejected');
CREATE TYPE public.dispute_type AS ENUM ('cancelled','delayed','payment_issue','wrong_item','missing_item','other');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  lang TEXT NOT NULL DEFAULT 'mm',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ AUTO PROFILE + DEFAULT CUSTOMER ROLE ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RESTAURANTS ============
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name_mm TEXT NOT NULL,
  name_en TEXT NOT NULL,
  cuisine_mm TEXT,
  cuisine_en TEXT,
  image TEXT,
  address_mm TEXT,
  address_en TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC(3,2) DEFAULT 4.5,
  delivery_min INT DEFAULT 20,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.restaurants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.restaurants TO authenticated;
GRANT ALL ON public.restaurants TO service_role;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "restaurants public read" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "restaurants owner write" ON public.restaurants FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "restaurants owner insert" ON public.restaurants FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "restaurants admin delete" ON public.restaurants FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ MENU ITEMS ============
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name_mm TEXT NOT NULL,
  name_en TEXT NOT NULL,
  desc_mm TEXT,
  desc_en TEXT,
  category_mm TEXT,
  category_en TEXT,
  price INT NOT NULL,
  image TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "menu owner manage" ON public.menu_items FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND (r.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))))
WITH CHECK (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND (r.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));

-- ============ ORDERS ============
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  rider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'placed',
  subtotal INT NOT NULL,
  delivery_fee INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  pin JSONB,
  distance_km NUMERIC(6,2),
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  proof_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders customer read" ON public.orders FOR SELECT TO authenticated USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid())
  OR (public.has_role(auth.uid(),'rider') AND (rider_id = auth.uid() OR rider_id IS NULL))
  OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "orders customer insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders update by parties" ON public.orders FOR UPDATE TO authenticated USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid())
  OR (public.has_role(auth.uid(),'rider'))
  OR public.has_role(auth.uid(),'admin')
);

-- ============ ORDER ITEMS ============
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  name_mm TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price INT NOT NULL,
  qty INT NOT NULL,
  notes TEXT
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items read via order" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
    o.customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'rider')
    OR public.has_role(auth.uid(),'admin')
  ))
);
CREATE POLICY "order_items insert customer" ON public.order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
);

-- ============ ORDER EVENTS ============
CREATE TABLE public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  note TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_events read via order" ON public.order_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
    o.customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'rider')
    OR public.has_role(auth.uid(),'admin')
  ))
);
CREATE POLICY "order_events insert by parties" ON public.order_events FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
    o.customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'rider')
    OR public.has_role(auth.uid(),'admin')
  ))
);

-- ============ RIDER SHIFTS ============
CREATE TABLE public.rider_shifts (
  rider_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  online BOOLEAN NOT NULL DEFAULT false,
  last_lat DOUBLE PRECISION,
  last_lng DOUBLE PRECISION,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.rider_shifts TO authenticated;
GRANT ALL ON public.rider_shifts TO service_role;
ALTER TABLE public.rider_shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shifts self manage" ON public.rider_shifts FOR ALL TO authenticated USING (rider_id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (rider_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "shifts read for dispatch" ON public.rider_shifts FOR SELECT TO authenticated USING (true);

-- ============ DISPUTES ============
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  opened_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type public.dispute_type NOT NULL,
  status public.dispute_status NOT NULL DEFAULT 'open',
  refund_amount INT DEFAULT 0,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.disputes TO authenticated;
GRANT ALL ON public.disputes TO service_role;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disputes read parties" ON public.disputes FOR SELECT TO authenticated USING (
  opened_by = auth.uid() OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "disputes insert by user" ON public.disputes FOR INSERT TO authenticated WITH CHECK (opened_by = auth.uid());
CREATE POLICY "disputes admin update" ON public.disputes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ DISPUTE MESSAGES ============
CREATE TABLE public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.dispute_messages TO authenticated;
GRANT ALL ON public.dispute_messages TO service_role;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dispute_msgs read parties" ON public.dispute_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_id AND (d.opened_by = auth.uid() OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "dispute_msgs insert parties" ON public.dispute_messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.disputes d WHERE d.id = dispute_id AND (d.opened_by = auth.uid() OR public.has_role(auth.uid(),'admin')))
);

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dispute_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disputes;
