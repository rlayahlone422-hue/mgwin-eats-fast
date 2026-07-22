
-- 1. Delivery proofs: restrict to order participants
DROP POLICY IF EXISTS "proofs read" ON storage.objects;
CREATE POLICY "proofs read participants" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'delivery-proofs'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    LEFT JOIN public.restaurants r ON r.id = o.restaurant_id
    WHERE o.proof_photo = storage.objects.name
      AND (
        o.customer_id = auth.uid()
        OR o.rider_id = auth.uid()
        OR r.owner_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);

-- 2. Menu images: public catalog (anon + authenticated)
DROP POLICY IF EXISTS "menu-images read" ON storage.objects;
CREATE POLICY "menu-images public read" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'menu-images');

-- 3. Rider shifts: admin only
DROP POLICY IF EXISTS "shifts read for dispatch" ON public.rider_shifts;
CREATE POLICY "shifts read admin" ON public.rider_shifts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Revoke execute on trigger-only SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
