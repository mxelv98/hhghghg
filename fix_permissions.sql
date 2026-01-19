-- Run this in your Supabase SQL Editor to fix the "Failed to grant access" error.

-- 1. Check if policies exist (optional, safe to run if they don't or if updated)
drop policy if exists "Admins can insert vip subscriptions" on public.vip_subscriptions;
drop policy if exists "Admins can update vip subscriptions" on public.vip_subscriptions;

-- 2. Allow Admins to INSERT new VIP subscriptions
create policy "Admins can insert vip subscriptions"
  on public.vip_subscriptions for insert
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role = 'admin'
    ) 
  );

-- 3. Allow Admins to UPDATE existing subscriptions (e.g. to deactivate old ones)
create policy "Admins can update vip subscriptions"
  on public.vip_subscriptions for update
  using ( 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role = 'admin'
    ) 
  );
