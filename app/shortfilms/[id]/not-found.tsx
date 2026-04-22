import Link from "next/link"

export default function ShortFilmNotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[0.06em]">Short Film Not Found</h1>
        <p className="mt-3 text-sm text-white/70">
          This short film link is invalid or the content was removed.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/shortfilms"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
          >
            Back to Short Films
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
