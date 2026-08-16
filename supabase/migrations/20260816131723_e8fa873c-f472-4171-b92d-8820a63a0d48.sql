create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  _caller uuid := auth.uid();
  _is_admin boolean;
begin
  if _caller is null then
    return false;
  end if;

  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _caller and ur.role = 'admin'
  ) into _is_admin;

  if _user_id <> _caller and not _is_admin then
    return false;
  end if;

  return exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id and ur.role = _role
  );
end;
$$;

revoke all on function public.has_role(uuid, app_role) from public;
revoke all on function public.has_role(uuid, app_role) from anon;
grant execute on function public.has_role(uuid, app_role) to authenticated, service_role;

drop policy if exists "Admins can update dispute messages" on public.dispute_messages;
create policy "Admins can update dispute messages"
on public.dispute_messages for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete dispute messages" on public.dispute_messages;
create policy "Admins can delete dispute messages"
on public.dispute_messages for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update order items" on public.order_items;
create policy "Admins can update order items"
on public.order_items for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete order items" on public.order_items;
create policy "Admins can delete order items"
on public.order_items for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));
