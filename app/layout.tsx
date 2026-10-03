import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "OrthoAlign AI",
  description: "Markerless registration of CT bone models to live depth data, with confidence and re-registration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="border-b border-line bg-white/70 backdrop-blur sticky top-0 z-10">
          <nav className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
            <Link href="/" className="font-display text-xl font-bold tracking-tight">OrthoAlign AI</Link>
            <div className="flex gap-5 text-sm font-medium items-center">
              <Link href="/#how" className="hover:text-teal">How it works</Link>
              <Link href="/dashboard" className="rounded-md bg-teal px-3 py-1.5 text-white hover:bg-teal-dark">Open dashboard</Link>
            </div>
          </nav>
        </header>
        {children}
        <footer className="mx-auto max-w-6xl px-5 py-10 text-sm text-muted">
          Research prototype on synthetic and phantom data. Not for clinical use.
        </footer>
      </body>
    </html>
  );
}
