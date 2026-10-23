import Link from "next/link";
import { signOut } from "@/app/actions";

export default function KaleshLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space kalesh-space" style={{ ["--accent" as string]: "#BC647B" }}>
      <header className="topbar">
        <Link href="/kalesh" className="brand">
          Chaitanya&rsquo;s <em>Girlies</em> <span aria-hidden>🔥</span>
        </Link>
        <form action={signOut}>
          <button className="btn btn-ghost btn-sm">Log out</button>
        </form>
      </header>
      <main className="space-main">{children}</main>
    </div>
  );
}
