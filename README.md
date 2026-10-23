# Chaitanya's Girlies 💖

A little universe for Shruti, Pranjali and Jasbir (group: **Zindagi ke Kalesh**).
v1 has **Shruti's space** + **Chaitanya's admin view**.

Built with Next.js 15 + Supabase (logins, database, photo storage).

---

## Setup (one time, ~20–30 min)

### 1. Install
Needs Node.js 20+.
```bash
npm install
```

### 2. Create the Supabase project (free)
1. Go to https://supabase.com → **New project**.
2. Open **SQL Editor → New query**, paste everything from `supabase/schema.sql`, click **Run**.
3. Go to **Authentication → Sign In / Providers** and turn **off "Allow new users to sign up"**
   (so only the logins you create can get in).
4. Go to **Project Settings → API** (or **API Keys**) and copy:
   - Project URL
   - `anon` / publishable key
   - `service_role` / secret key

### 3. Fill in `.env.local`
Open `.env.local` and paste the three values. The logins are already filled in:

| Who | Login | Password |
|---|---|---|
| Chaitanya (admin) | `chaitanya` | from `SEED_ADMIN_PASSWORD` |
| Shruti | her Gmail | from `SEED_SHRUTI_PASSWORD` |
| Jasbir | her Gmail | from `SEED_JASBIR_PASSWORD` |
| Pranjali | her Gmail | from `SEED_PRANJALI_PASSWORD` |

### 4. Create the logins
```bash
npm run seed
```
Safe to run again any time (it updates instead of duplicating).

### 5. Try it
```bash
npm run dev
```
Open http://localhost:3000 and log in.

### 6. Put it online (Vercel, free)
1. Push this folder to a **private** GitHub repo (`.env.local` is git-ignored — good).
2. On https://vercel.com → **Add New → Project** → import the repo.
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only.
   **Never** add the service role key to Vercel.
4. Deploy. Optionally add a custom domain.

---

## What's inside

| Feature | Where |
|---|---|
| Login (email or username) | `app/login` |
| Shruti's home: avatar, title, greeting, favourites | `app/g/[slug]/page.tsx` |
| Photo wall (placeholders until you upload) | `app/g/[slug]/photos` |
| Birthday letter, locked till 8 Feb 2027 (locked on the server) | `app/g/[slug]/letters`, `my_letters()` in schema |
| Daily compliment mirror + diary | `app/g/[slug]/compliment` |
| One-time bouquet for Chaitanya | `app/g/[slug]/bouquet` |
| Admin: bouquet shelf, photo upload, letter editor | `app/admin` |

**Adding photos / writing the birthday letter:** log in as `chaitanya` → admin page.
