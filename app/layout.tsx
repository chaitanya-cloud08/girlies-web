import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientFX from "@/components/ClientFX";

export const metadata: Metadata = {
  title: "Chaitanya's Girlies",
  description: "A little universe for Chaitanya's girlies 💖",
};

export const viewport: Viewport = { themeColor: "#FAF6F0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Playfair+Display:ital,wght@0,600;0,800;1,600;1,800&display=swap"
        />
      </head>
      <body>
        {children}
        <ClientFX />
      </body>
    </html>
  );
}
