import Link from "next/link";
import { requireAdmin, type Profile } from "@/lib/auth";
import { getGirl } from "@/content/girls";
import { getGroupPhoto, getLetters, getPhotos, type BouquetRow } from "@/lib/space-data";
import { deleteLetter, deletePhoto, saveLetter, signOut, updatePhotoCaption } from "@/app/actions";
import BouquetCard from "@/components/BouquetCard";
import PhotoUploader from "@/components/PhotoUploader";
import GroupPhotoUploader from "@/components/GroupPhotoUploader";
import type { FlowerId } from "@/lib/flowers";

export const dynamic = "force-dynamic";

function toDateInput(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(iso));
}

export default async function AdminPage() {
  const { supabase, viewer } = await requireAdmin();

  const { data: girlsData } = await supabase
    .from("profiles")
    .select("id, username, slug, display_name, role")
    .eq("role", "girl")
    .order("created_at");
  const girls = (girlsData ?? []) as Profile[];

  const { data: bouquetsData } = await supabase.from("bouquets").select("*").order("created_at");
  const bouquets = (bouquetsData ?? []) as BouquetRow[];
  const groupPhoto = await getGroupPhoto(supabase);

  const perGirl = await Promise.all(
    girls.map(async (g) => ({
      profile: g,
      content: g.slug ? getGirl(g.slug) : null,
      photos: await getPhotos(supabase, g),
      letters: await getLetters(supabase, g, true),
    }))
  );

  return (
    <div className="space admin" style={{ ["--accent" as string]: "#B0506B" }}>
      <header className="topbar">
        <span className="brand">
          Chaitanya&rsquo;s <em>Girlies</em> <span aria-hidden>👑</span>
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/kalesh" className="btn btn-ghost btn-sm">
            Kalesh HQ 🔥
          </Link>
          <form action={signOut}>
            <button className="btn btn-ghost btn-sm">Log out</button>
          </form>
        </div>
      </header>

      <main className="space-main">
        <header className="page-head">
          <p className="eyebrow">admin HQ</p>
          <h1 className="display">Hi {viewer.display_name} 👑</h1>
          <p className="muted">Your bouquets, your girlies, and everything behind the scenes.</p>
        </header>

        <section className="admin-section">
          <h2 className="display small">Your bouquet shelf 💐</h2>
          {bouquets.length === 0 ? (
            <p className="empty hand">No bouquets yet… they&rsquo;re still picking flowers 🌱</p>
          ) : (
            <div className="shelf">
              {bouquets.map((b) => {
                const g = perGirl.find((p) => p.profile.id === b.sender);
                const Av = g?.content?.Avatar;
                return (
                  <BouquetCard
                    key={b.id}
                    from={g?.profile.display_name ?? "A girlie"}
                    flowers={b.flowers as FlowerId[]}
                    wrap={b.wrap}
                    ribbon={b.ribbon}
                    note={b.note}
                    sentAt={b.created_at}
                    heading={`From ${g?.content?.nickname ?? g?.profile.display_name} ${g?.content?.emoji ?? ""}`}
                    avatar={Av ? <Av pose="sassy" className="avatar-svg" /> : null}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="admin-section">
          <h2 className="display small">Group photo 📸</h2>
          <div className="admin-panel" style={{ maxWidth: 420 }}>
            {groupPhoto.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={groupPhoto.url} alt="Current group photo" style={{ borderRadius: 12, marginBottom: 12, width: "100%" }} />
            )}
            <GroupPhotoUploader caption={groupPhoto.caption} />
          </div>
        </section>

        {perGirl.map(({ profile, content, photos, letters }) => {
          const Av = content?.Avatar;
          return (
            <section key={profile.id} className="admin-section girl-admin" style={{ ["--accent" as string]: content?.color ?? "#B0506B" }}>
              <div className="girl-admin-head">
                {Av && <Av pose="idle" className="avatar-svg mini" />}
                <div>
                  <h2 className="display small">
                    {profile.display_name} {content?.emoji}
                  </h2>
                  <p className="muted">{content?.title}</p>
                  <Link className="btn btn-primary btn-sm" href={`/g/${profile.slug}`}>
                    Open her space →
                  </Link>
                </div>
              </div>

              <div className="admin-grid">
                <div className="admin-panel">
                  <h3>📸 Photos ({photos.length})</h3>
                  <PhotoUploader girlId={profile.id} slug={profile.slug!} loadingStyle={content?.loadingStyle} />
                  {photos.length > 0 && (
                    <ul className="admin-photos">
                      {photos.map((p) => (
                        <li key={p.id}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {p.url && <img src={p.url} alt="" />}
                          <form action={updatePhotoCaption} className="inline-form">
                            <input type="hidden" name="id" value={p.id} />
                            <input name="caption" defaultValue={p.caption ?? ""} placeholder="Caption" maxLength={120} />
                            <button className="btn btn-ghost btn-sm">Save</button>
                          </form>
                          <form action={deletePhoto}>
                            <input type="hidden" name="id" value={p.id} />
                            <button className="btn btn-danger btn-sm" aria-label="Delete photo">
                              Delete
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-panel">
                  <h3>💌 Letters</h3>
                  {letters.map((l) => (
                    <form key={l.id} action={saveLetter} className="letter-form">
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="owner_slug" value={profile.slug ?? ""} />
                      <div className="row">
                        <label className="field">
                          <span>Title</span>
                          <input name="title" defaultValue={l.title} required />
                        </label>
                        <label className="field">
                          <span>Unlocks on (India time)</span>
                          <input type="date" name="unlock_date" defaultValue={toDateInput(l.unlock_at)} required />
                        </label>
                      </div>
                      <label className="field">
                        <span>Envelope label</span>
                        <input name="label" defaultValue={l.label ?? ""} />
                      </label>
                      <label className="field">
                        <span>Letter (starts after &ldquo;Dear {content?.nickname},&rdquo;)</span>
                        <textarea name="content" defaultValue={l.content ?? ""} rows={8} className="hand" />
                      </label>
                      <div className="row-actions">
                        <span className="tiny muted">{l.is_unlocked ? "🔓 Unlocked — she can read it" : "🔒 Sealed — she can't read it yet"}</span>
                        <button className="btn btn-primary btn-sm">Save letter</button>
                      </div>
                    </form>
                  ))}
                  {letters.map((l) => (
                    <form key={`d${l.id}`} action={deleteLetter} className="tiny-form">
                      <input type="hidden" name="id" value={l.id} />
                      <button className="link-btn">Delete &ldquo;{l.title}&rdquo;</button>
                    </form>
                  ))}

                  <details className="new-letter">
                    <summary>+ Write a new letter</summary>
                    <form action={saveLetter} className="letter-form">
                      <input type="hidden" name="owner_slug" value={profile.slug ?? ""} />
                      <div className="row">
                        <label className="field">
                          <span>Title</span>
                          <input name="title" placeholder="Open when you're sad" required />
                        </label>
                        <label className="field">
                          <span>Unlocks on</span>
                          <input type="date" name="unlock_date" required />
                        </label>
                      </div>
                      <label className="field">
                        <span>Envelope label</span>
                        <input name="label" placeholder="Open when you need a hug" />
                      </label>
                      <label className="field">
                        <span>Letter</span>
                        <textarea name="content" rows={6} className="hand" />
                      </label>
                      <button className="btn btn-primary btn-sm">Add letter</button>
                    </form>
                  </details>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
