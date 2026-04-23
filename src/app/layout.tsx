import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Investing Portal",
  description: "Local-first portfolio design and review dashboard.",
};

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Investing", href: "/investing" },
  { label: "Content", href: "/content" },
  { label: "Travel", href: "/travel" },
  { label: "Education", href: "/education" },
  { label: "Health", href: "/health" },
  { label: "Memory", href: "/memory" },
  { label: "Settings", href: "/settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#060807] text-stone-100">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(200,170,90,0.18),transparent_34%),linear-gradient(145deg,#07100e_0%,#080b0a_45%,#12100b_100%)]">
          <div className="mx-auto flex min-h-screen max-w-[1560px] flex-col lg:flex-row">
            <aside className="border-b border-white/10 bg-black/30 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0">
              <Link href="/" className="group block rounded-3xl border border-amber-200/20 bg-amber-200/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-amber-200/70">
                  Local v0.1
                </p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">
                  Investing Portal
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Portfolio design and review. No trading, no external feeds.
                </p>
              </Link>
              <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-stone-300 transition hover:border-amber-200/40 hover:bg-amber-100/10 hover:text-amber-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-10 border-b border-white/10 bg-[#070a09]/80 px-5 py-4 backdrop-blur-xl sm:px-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/70">
                      Review Dashboard
                    </p>
                    <p className="mt-1 text-sm text-stone-400">
                      Local JSON and CSV only under app-data.
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                    Local First
                  </div>
                </div>
              </header>
              <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
