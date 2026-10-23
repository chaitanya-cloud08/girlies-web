"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SpaceNav({ slug }: { slug: string }) {
  const path = usePathname();
  const items = [
    { href: `/g/${slug}`, label: "Home", icon: "🏠" },
    { href: `/g/${slug}/photos`, label: "Photos", icon: "📸" },
    { href: `/g/${slug}/letters`, label: "Letters", icon: "💌" },
    { href: `/g/${slug}/compliment`, label: "Mirror", icon: "🪞" },
    { href: `/g/${slug}/bouquet`, label: "Bouquet", icon: "💐" },
    { href: "/kalesh", label: "Kalesh HQ", icon: "🔥" },
  ];
  return (
    <nav className="space-nav" aria-label="Sections">
      {items.map((it) => {
        const active = path === it.href;
        return (
          <Link key={it.href} href={it.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined} data-pop="soft">
            <span aria-hidden>{it.icon}</span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
