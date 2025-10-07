# Interview Applicant Form (React + TS + Supabase)

Simple internal tool to collect applicant data before interviews.

## Requirements

- Node 18+
- Supabase project

## Environment

Create `.env` file in project root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database (Supabase SQL)

Run in Supabase SQL editor:

```
create table if not exists public.interview_applicants (
  id bigserial primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Deploy to Render.com

1. Create a new Static Site (or Docker service) from this repo/folder.
2. Build command: `npm ci && npm run build`
3. Publish directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Docker (optional)

```
# Build
docker build -t interview-form .
# Run
docker run -p 8080:80 --env-file .env interview-form
```
