-- Create a new public storage bucket for product images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true) 
on conflict (id) do nothing;

-- Create policy to allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Create policy to allow authenticated admins to insert images
create policy "Auth Insert"
on storage.objects for insert
with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Create policy to allow authenticated admins to update/delete their images
create policy "Auth Update Delete"
on storage.objects for all
using ( bucket_id = 'product-images' and auth.role() = 'authenticated' )
with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
