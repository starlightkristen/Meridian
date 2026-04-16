-- Meridian — Session 3 storage bucket
-- Paste into Supabase SQL editor and run after 001_init.sql.

insert into storage.buckets (id, name, public)
values ('exercise-images', 'exercise-images', true)
on conflict (id) do nothing;

create policy "Public image access"
  on storage.objects for select
  using (bucket_id = 'exercise-images');

create policy "Service role image upload"
  on storage.objects for insert
  with check (bucket_id = 'exercise-images');
