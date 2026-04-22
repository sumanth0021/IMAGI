// components/ProfileTabs.tsx
"use client"

import { memo, useState } from "react"
import Link from "next/link"

type ContentItem = {
  id: string
  type: string
  title: string | null
  thumbnail_url: string | null
  video_id: string | null
  creator_name: string | null
  created_at: string
}

type Props = {
  stories: ContentItem[]
  films: ContentItem[]
}

function EmptyState({ type }: { type: "story" | "film" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center col-span-3">
      <p className="text-sm text-white/40">
        {type === "story" ? "No stories uploaded yet" : "No short films uploaded yet"}
      </p>
      <Link
        href="/upload"
        className="mt-4 text-xs font-medium px-4 py-2 rounded-full transition-all"
        style={{
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        + Upload now
      </Link>
    </div>
  )
}

function ProfileTabs({ stories, films }: Props) {
  const [active, setActive] = useState<"stories" | "films">("stories")

  const tabs = [
    {
      id: "stories" as const,
      label: "Stories",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "films" as const,
      label: "Short Films",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
        </svg>
      ),
    },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 transition-all"
            style={{
              color: active === tab.id ? "#fff" : "rgba(255,255,255,0.3)",
              borderBottom: active === tab.id ? "2px solid #fff" : "2px solid transparent",
            }}
          >
            {tab.icon}
            <span className="text-[10px] uppercase tracking-widest font-medium">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── STORIES grid — portrait 2/3 like home page ── */}
      {active === "stories" && (
        <div className="px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-8">
            {stories.length === 0 ? (
              <EmptyState type="story" />
            ) : (
              stories.map((story, index) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  className="group cursor-pointer"
                  style={{
                    opacity: 0,
                    animation: `apple-card-in 820ms cubic-bezier(0.16,1,0.3,1) ${180 + index * 60}ms forwards`,
                  }}
                >
                  {/* Portrait thumbnail */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                    style={{ aspectRatio: "2/3" }}>
                    {story.thumbnail_url ? (
                      <img
                        src={story.thumbnail_url}
                        alt={story.title ?? ""}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">📖</div>
                    )}
                  </div>

                  {/* Title */}
                  <p className="mt-2 text-xs text-gray-200 truncate leading-snug">
                    {story.title ?? "Untitled"}
                  </p>
                  {story.creator_name && (
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                      By {story.creator_name}
                    </p>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── FILMS grid — landscape aspect-video like home page ── */}
      {active === "films" && (
        <div className="px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {films.length === 0 ? (
              <EmptyState type="film" />
            ) : (
              films.map((film, index) => {
                const thumb =
                  film.thumbnail_url ??
                  (film.video_id ? `https://img.youtube.com/vi/${film.video_id}/hqdefault.jpg` : null)

                return (
                  <Link
                    key={film.id}
                    href={`/shortfilms/${film.id}`}
                    className="group cursor-pointer"
                    style={{
                      opacity: 0,
                      animation: `apple-card-in 820ms cubic-bezier(0.16,1,0.3,1) ${200 + index * 65}ms forwards`,
                    }}
                  >
                    {/* Landscape thumbnail */}
                    <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                      style={{ aspectRatio: "16/9" }}>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={film.title ?? ""}
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">🎬</div>
                      )}

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M5 3l14 9-14 9V3z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="mt-2 text-xs text-gray-200 truncate leading-snug">
                      {film.title ?? "Untitled"}
                    </p>
                    {film.creator_name && (
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                        By {film.creator_name}
                      </p>
                    )}
                  </Link>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Animation keyframe */}
      <style>{`
        @keyframes apple-card-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}

export default memo(ProfileTabs)