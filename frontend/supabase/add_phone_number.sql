-- Add phone_number to connections
alter table public.connections 
add column if not exists phone_number text;
