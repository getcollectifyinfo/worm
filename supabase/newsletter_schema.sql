-- Create a table for newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  source text default 'GENERAL',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table newsletter_subscribers enable row level security;

-- Allow anyone (anon) to insert emails (for public waitlist)
create policy "Allow public insert to subscribers"
  on newsletter_subscribers for insert
  with check (true);

-- Only authenticated admins or service role can view (optional, prevents public from reading list)
-- For now, we might not need a read policy for the public app.
