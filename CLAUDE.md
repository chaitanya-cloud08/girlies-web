# Project handoff: Chaitanya's Girlies

Personal gift website by Chaitanya for her three friends: **Shruti, Pranjali, Jasbir**.
Group name: **Zindagi ke Kalesh**. Tone: cute, girly, playful, pastel, lots of emoji.

## Status
- v1 = Shruti's space + Chaitanya's admin. Code complete; `tsc --noEmit` passes.
- `next build` was NOT verified in the original sandbox (it stalled, likely no network). Run `npm run build` first and fix anything that comes up.
- Supabase project not created yet — follow README steps 2–4 with the user.

## Stack
Next.js 15 (App Router, server actions) + React 19 + `@supabase/ssr`. Plain CSS in `app/globals.css` (no Tailwind). Fonts via Google Fonts `<link>` (Playfair Display, DM Sans, Caveat).

## Architecture
- Auth: Supabase email+password. Username logins (no "@") map to `<username>@chaitanyasgirlies.app` (`lib/auth.ts`). Admin = `chaitanya`. Shruti logs in with her Gmail. Sign-ups must be disabled in Supabase.
- `profiles` (role `girl` | `admin`, `slug`). Girls see only their own data via RLS; admin sees all (`is_admin()`).
- Girl spaces: `/g/[slug]/*`. `requireSpace(slug)` lets the girl or the admin in.
- Per-girl static content (title, colour, greetings, compliments, avatar) lives in code: `content/girls/<slug>.ts`, registered in `content/girls/index.ts`.
- Avatars are hand-drawn SVG React components (`components/avatars/`), poses: wave, sassy, bouquet, idle. Reused later for group features.
- Letters: girls read only via `my_letters()` RPC, which hides content until `unlock_at` (server-side lock).
- Bouquets: one per girl (unique `sender`), sent to Chaitanya; catalog of flowers with meanings in `lib/flowers.ts`.
- Photos: private Storage bucket `photos`, path `<girl uuid>/...`; admin uploads from browser (resized client-side), signed URLs to view.
- Seed: `npm run seed` (`scripts/seed.mjs`, uses service role key from `.env.local`).

## Shruti
Nickname Shru · colour #C97B9C · emoji 💋 · title "The Peri Peri Princess" (subtitle mentions Miss Overthinker-Overachiever) · BA Economics, artsy, classy chic, high maintenance · loves peri peri fries, choco fudge ice cream · birthday 8 Feb (letter unlocks 2027-02-08 00:00 IST) · avatar from photos: mid-length black hair, tanned, sunglasses on head, black top + pink floral skirt, gold jewellery.

## Next up (agreed with Chaitanya)
1. Get build + Supabase + Vercel running.
2. Pranjali and Jasbir spaces (Chaitanya will send details: about her, colour, emoji, photo for avatar, letters, compliments, login).
3. Group features for Zindagi ke Kalesh:
   - **Zindagi ke Kalesh Wrapped** (Spotify-Wrapped-style story): Top Girlie Moment, Top Inside Joke, Minutes Yapping, each girl's photo + inspired song, full persona cards (avatar, song, stickers). Every card downloadable/shareable as a 9:16 image.
   - **Group polaroid wall**: one group photo + one group song.
   Details still to come from Chaitanya.
4. Shruti's real photos and birthday letter text (via admin page).
