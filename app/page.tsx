import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
import { signOut } from "@/app/actions";

export default async function Home() {
  const { viewer } = await getViewer();
  if (viewer?.role === "admin") redirect("/admin");
  if (viewer?.slug) redirect(`/g/${viewer.slug}`);

  return (
    <main className="login-wrap">
      <section className="login-card">
        <h1 className="display">Almost there 🎀</h1>
        <p>This login isn&rsquo;t connected to a girlie space yet. Ask Chaitanya to run the setup again.</p>
        <form action={signOut}>
          <button className="btn btn-primary">Log out</button>
        </form>
      </section>
    </main>
  );
}
