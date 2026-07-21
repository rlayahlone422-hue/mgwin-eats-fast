
CREATE POLICY "menu-images read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'menu-images');
CREATE POLICY "menu-images write owners" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images' AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "menu-images update owners" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'menu-images' AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "menu-images delete owners" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'menu-images' AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "proofs read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'delivery-proofs');
CREATE POLICY "proofs write rider" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'delivery-proofs' AND (public.has_role(auth.uid(),'rider') OR public.has_role(auth.uid(),'admin')));
