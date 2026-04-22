// components/ContentCard.tsx
import Link from "next/link"

export type ContentItem = {
  id: string
  type: "story" | "film"
  title: string
  creator_name: string | null
  language: string | null
  genre: string | null
  thumbnail_url: string | null
  video_id: string | null
  platform: string | null
  status: string | null
  chapters: number | null
  created_at: string
  user_id: string
}

export default function ContentCard({ item }: { item: ContentItem }) {
  const isFilm = item.type === "film"

  // YouTube thumbnail fallback
  const thumb = item.thumbnail_url
    ?? (item.video_id ? `https://img.youtube.com/vi/${item.video_id}/hqdefault.jpg` : null)

  return (
    <Link href={`/content/${item.id}`} className="group block">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.05)" }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {isFilm ? "🎬" : "📖"}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: isFilm ? "rgba(99,102,241,0.85)" : "rgba(245,158,11,0.85)",
              backdropFilter: "blur(8px)",
              color: "#fff",
            }}
          >
            {isFilm ? "Film" : "Story"}
          </span>
        </div>

        {/* Film play icon */}
        {isFilm && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-white truncate leading-snug group-hover:text-white/80 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          {item.creator_name && (
            <span className="text-xs text-white/40 truncate">{item.creator_name}</span>
          )}
          {item.language && (
            <>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs text-white/30">{item.language}</span>
            </>
          )}
          {item.status && item.type === "story" && (
            <>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs capitalize" style={{ color: item.status === "completed" ? "#4ade80" : "#fb923c" }}>
                {item.status}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}