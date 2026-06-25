-- Storage bucket for site photos uploaded via the admin.
-- Public read (so images show on the site); only logged-in admins can write.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists site_images_public_read on storage.objects;
create policy site_images_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'site-images');

drop policy if exists site_images_admin_insert on storage.objects;
create policy site_images_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists site_images_admin_update on storage.objects;
create policy site_images_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images') with check (bucket_id = 'site-images');

drop policy if exists site_images_admin_delete on storage.objects;
create policy site_images_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images');
