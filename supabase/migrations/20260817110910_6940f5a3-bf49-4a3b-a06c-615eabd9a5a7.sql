-- 1. orders update scoping
DROP POLICY IF EXISTS "orders update by parties" ON public.orders;
CREATE POLICY "orders update by parties" ON public.orders
FOR UPDATE TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid())
  OR (has_role(auth.uid(), 'rider'::app_role) AND (rider_id = auth.uid() OR rider_id IS NULL))
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = orders.restaurant_id AND r.owner_id = auth.uid())
  OR (has_role(auth.uid(), 'rider'::app_role) AND rider_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 2. order_events actor cannot be spoofed
DROP POLICY IF EXISTS "order_events insert by parties" ON public.order_events;
CREATE POLICY "order_events insert by parties" ON public.order_events
FOR INSERT TO authenticated
WITH CHECK (
  (actor_id = auth.uid() OR actor_id IS NULL)
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_events.order_id
      AND (
        o.customer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = o.restaurant_id AND r.owner_id = auth.uid())
        OR (has_role(auth.uid(), 'rider'::app_role) AND (o.rider_id = auth.uid() OR o.rider_id IS NULL))
        OR has_role(auth.uid(), 'admin'::app_role)
      )
  )
);

-- 3. storage write scoping
DROP POLICY IF EXISTS "menu-images write owners" ON storage.objects;
CREATE POLICY "menu-images write owners" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'menu-images'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id::text = (storage.foldername(name))[1] AND r.owner_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "menu-images update owners" ON storage.objects;
CREATE POLICY "menu-images update owners" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'menu-images'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id::text = (storage.foldername(name))[1] AND r.owner_id = auth.uid()
    )
  )
)
WITH CHECK (
  bucket_id = 'menu-images'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id::text = (storage.foldername(name))[1] AND r.owner_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "menu-images delete owners" ON storage.objects;
CREATE POLICY "menu-images delete owners" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'menu-images'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id::text = (storage.foldername(name))[1] AND r.owner_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "proofs write rider" ON storage.objects;
CREATE POLICY "proofs write rider" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'delivery-proofs'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = (storage.foldername(name))[1] AND o.rider_id = auth.uid()
    )
  )
);