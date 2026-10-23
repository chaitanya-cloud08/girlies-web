// Creates (or updates) the logins and starter content.
// Run on your own computer:  npm run seed
// Safe to run again — it updates instead of duplicating.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey || url.includes("YOUR-PROJECT") || serviceKey.startsWith("paste")) {
  console.error("✗ Fill NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const USERNAME_DOMAIN = "chaitanyasgirlies.app";

const people = [
  {
    email: `chaitanya@${USERNAME_DOMAIN}`,
    password: process.env.SEED_ADMIN_PASSWORD,
    profile: { username: "chaitanya", slug: null, display_name: "Chaitanya", role: "admin" },
  },
  {
    email: process.env.SEED_SHRUTI_EMAIL,
    password: process.env.SEED_SHRUTI_PASSWORD,
    profile: { username: "shruti", slug: "shruti", display_name: "Shruti", role: "girl" },
    letters: [
      {
        title: "Happy Birthday, Shru 🎂",
        label: "Open on your birthday",
        unlock_at: "2027-02-08T00:00:00+05:30",
        content:
          "Chaitanya hasn't written this letter yet… but trust me, it's going to make you cry (the good kind) 💋",
      },
    ],
  },
  {
    email: process.env.SEED_JASBIR_EMAIL,
    password: process.env.SEED_JASBIR_PASSWORD,
    profile: { username: "jasbir", slug: "jasbir", display_name: "Jasbir", role: "girl" },
    letters: [
      {
        title: "Final Chapter: Happy Birthday",
        label: "Open on your birthday",
        unlock_at: "2027-08-01T00:00:00+05:30",
        content:
          "Chaitanya hasn't written this chapter yet… but trust me, it's the best one in the whole book 🪻",
      },
    ],
  },
  {
    email: process.env.SEED_PRANJALI_EMAIL,
    password: process.env.SEED_PRANJALI_PASSWORD,
    profile: { username: "pranjali", slug: "pranjali", display_name: "Pranjali", role: "girl" },
    letters: [
      {
        title: "Happy Birthday, P 🎂",
        label: "Open on your birthday",
        unlock_at: "2027-06-26T00:00:00+05:30",
        content:
          "Chaitanya hasn't written this letter yet… but trust me, it's going to make you cry (the good kind) 🌸",
      },
    ],
  },
];

async function findUserByEmail(email) {
  for (let page = 1; page < 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

for (const p of people) {
  if (!p.email || !p.password) {
    console.error(`✗ Missing email/password for ${p.profile.username} in .env.local`);
    process.exit(1);
  }
  let user = await findUserByEmail(p.email);
  if (user) {
    const { error } = await db.auth.admin.updateUserById(user.id, { password: p.password });
    if (error) throw error;
    console.log(`↻ Updated login for ${p.profile.display_name}`);
  } else {
    const { data, error } = await db.auth.admin.createUser({
      email: p.email,
      password: p.password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log(`✓ Created login for ${p.profile.display_name}`);
  }

  const { error: profErr } = await db.from("profiles").upsert({ id: user.id, ...p.profile });
  if (profErr) throw profErr;

  for (const letter of p.letters ?? []) {
    const { data: existing } = await db
      .from("letters")
      .select("id")
      .eq("owner", user.id)
      .eq("title", letter.title)
      .maybeSingle();
    if (!existing) {
      const { error } = await db.from("letters").insert({ owner: user.id, ...letter });
      if (error) throw error;
      console.log(`  ✉︎ Added letter "${letter.title}"`);
    }
  }
}

console.log("\nAll set! Start the site with:  npm run dev");
