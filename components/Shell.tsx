import Link from "next/link";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-return-black">
      <nav className="border-b border-return-line bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/dashboard" className="text-lg font-black tracking-wide text-return-amber">
            THE RETURN
          </Link>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-zinc-300">
            <Link href="/dashboard" className="hover:text-return-amber">Dashboard</Link>
            <Link href="/checkin" className="hover:text-return-amber">Check-in</Link>
            <Link href="/history" className="hover:text-return-amber">History</Link>
            <Link href="/insights" className="hover:text-return-amber">Insights</Link>
            <form action="/api/auth/logout" method="post">
              <button className="hover:text-return-red">Logout</button>
            </form>
          </div>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>
    </main>
  );
}
