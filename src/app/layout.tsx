import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "개인 투자 포털",
  description: "로컬 파일 기반 포트폴리오 설계 및 리뷰 대시보드.",
};

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "투자", href: "/investing" },
  { label: "콘텐츠", href: "/content" },
  { label: "여행", href: "/travel" },
  { label: "교육", href: "/education" },
  { label: "건강", href: "/health" },
  { label: "메모리", href: "/memory" },
  { label: "설정", href: "/settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-[#060807] text-stone-100">
        <div className="min-h-screen bg-[linear-gradient(145deg,#07100e_0%,#080b0a_52%,#11100c_100%)]">
          <div className="mx-auto flex min-h-screen max-w-[1560px] flex-col lg:flex-row">
            <aside className="border-b border-white/10 bg-black/30 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0">
              <Link href="/" className="group block rounded-3xl border border-amber-200/20 bg-amber-200/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-amber-200/70">
                  Local v0.1
                </p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">
                  투자 리뷰 포털
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  매매가 아니라 비중과 목표를 점검하는 개인 대시보드입니다.
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
                      리뷰 대시보드
                    </p>
                    <p className="mt-1 text-sm text-stone-400">
                      app-data의 로컬 JSON/CSV만 사용합니다.
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                    로컬 우선
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
