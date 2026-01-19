-- STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', true);

-- STORAGE POLICIES
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'payment-screenshots' );

create policy "Authenticated Users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'payment-screenshots' and auth.role() = 'authenticated' );
