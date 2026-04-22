import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import BackButton from "@/components/BackButton"
import LikeButton from "@/components/LikeButton"
import ProgressiveStoryContent from "@/components/ProgressiveStoryContent"
import ShareButton from "@/components/ShareButton"
import WatchButton from "@/components/WatchButton"

const badges = [ "We hope you enjoy!", ]

function getLanguageLabel(story: Record<string, unknown>): string {
  const rawLanguages = story.languages

  if (Array.isArray(rawLanguages)) {
    const values = rawLanguages.filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0
    )
    if (values.length > 0) return values.join(", ")
  }

  if (typeof rawLanguages === "string" && rawLanguages.trim()) {
    try {
      const parsed = JSON.parse(rawLanguages)
      if (Array.isArray(parsed)) {
        const values = parsed.filter(
          (value): value is string => typeof value === "string" && value.trim().length > 0
        )
        if (values.length > 0) return values.join(", ")
      }
      return rawLanguages
    } catch {
      return rawLanguages
    }
  }

  if (typeof story.language === "string" && story.language.trim()) {
    return story.language
  }

  return "N/A"
}

function getReleaseLabel(story: Record<string, unknown>, releaseYear: string): string {
  const rawReleaseDate = story.release_date
  if (typeof rawReleaseDate === "string" && rawReleaseDate.trim().length > 0) {
    const parsed = new Date(rawReleaseDate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-CA")
    }
    return rawReleaseDate
  }

  return releaseYear !== "----" ? releaseYear : "N/A"
}


export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  // ✅ get id
  const { id } = await params

  // ✅ create supabase (INSIDE component)
  const supabase = await createClient()

  // ✅ fetch directly from DB
  const { data: story, error } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return notFound()
    }

    console.error(error)
    throw new Error("Failed to fetch data")
  }

  if (!story) {
    return notFound()
  }

    

  const releaseYear = story.created_at?.slice(0, 4) || "----"
  const languageLabel = getLanguageLabel(story as Record<string, unknown>)
  const releaseLabel = getReleaseLabel(story as Record<string, unknown>, releaseYear)
  const parsedGenres =
    Array.isArray(story.genres)
      ? story.genres
      : typeof story.genres === "string" && story.genres.trim().length > 0
      ? (() => {
          try {
            const parsed = JSON.parse(story.genres)
            return Array.isArray(parsed) ? parsed : [story.genres]
          } catch {
            return [story.genres]
          }
        })()
      : []
  const legacyGenre =
    typeof story.genre === "string" && story.genre.trim().length > 0
      ? [story.genre]
      : []
  const normalizedGenres = [...parsedGenres, ...legacyGenre]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value): value is string => value.length > 0)
  const uniqueGenres = Array.from(new Set(normalizedGenres))
  const genreLabel = uniqueGenres.length > 0 ? uniqueGenres.join(", ") : "N/A"
  const storyStatus =
    (typeof story.status === "string" && story.status.trim()) || "N/A"
  const chapterCount =
    typeof story.chapters === "number"
      ? story.chapters
      : typeof story.chapters === "string" && story.chapters.trim().length > 0
      ? Number(story.chapters)
      : null
  const chapterDisplay = Number.isFinite(chapterCount) ? String(chapterCount) : "N/A"
  const contactEmail =
    (typeof story.business_email === "string" && story.business_email.trim()) ||
    (typeof story.creator_email === "string" && story.creator_email.trim()) ||
    ""
  const contactPhone =
    (typeof story.phone_number === "string" && story.phone_number.trim()) ||
    (typeof story.phone_number === "number" && String(story.phone_number)) ||
    (typeof story.creator_phone === "string" && story.creator_phone.trim()) ||
    (typeof story.creator_phone === "number" && String(story.creator_phone)) ||
    ""
  const contactItems = [
    contactEmail ? `Email: ${contactEmail}` : null,
    contactPhone ? `Phone: ${contactPhone}` : null,
  ].filter(Boolean) as string[]

  const parseArrayOrFallback = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string")
    if (typeof value !== "string" || !value.trim()) return []
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []
    } catch {
      return []
    }
  }

  const parseRecordOrFallback = (value: unknown): Record<string, string> => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.entries(value).reduce<Record<string, string>>((acc, [key, val]) => {
        if (typeof val === "string") acc[key] = val
        return acc
      }, {})
    }
    if (typeof value !== "string" || !value.trim()) return {}
    try {
      const parsed = JSON.parse(value)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
      return Object.entries(parsed).reduce<Record<string, string>>((acc, [key, val]) => {
        if (typeof val === "string") acc[key] = val
        return acc
      }, {})
    } catch {
      return {}
    }
  }

  const storyPlatforms = parseArrayOrFallback(story.platforms)
  const parsedPlatformLinks = parseRecordOrFallback(story.platform_links)
  const storyPdfLink = typeof story.pdf_link === "string" ? story.pdf_link.trim() : ""
  const storyPlatformLinks = storyPdfLink
    ? { "Cloud PDF": storyPdfLink, ...parsedPlatformLinks }
    : parsedPlatformLinks

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="relative h-[78vh] md:h-[85vh]">
        <img
          src={story.thumbnail_url}
          alt={story.title}
          className="absolute inset-0 h-full w-full object-cover brightness-[1.08]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4 md:px-10">
          <BackButton className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10" />
          <ShareButton title={story.title} sharePath={`/stories/${story.id}`} />
        </div>

        <div className="absolute inset-x-0 bottom-6 px-5 md:px-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/70">
            Story Series
          </p>

          <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[0.12em] uppercase break-words max-w-[90%]">
            {story.title}
          </h1>

          <p className="mt-2 text-sm text-white/70 break-words max-w-[90%]">
            {story.type} · {releaseYear}
          </p>

          <p className="mt-1 text-xs text-white/60">
            {languageLabel} · {chapterDisplay} chapters · {(story.likes ?? 0).toLocaleString()} likes
          </p>
        </div>
              {/* In your story page — use your existing px padding container */}

      </div>


<div className="px-4 pt-2 md:px-6 lg:px-10 mb-8 md:mb-12">
  <LikeButton id={story.id} initialLikes={story.likes} />
</div>
      <div className="px-3 pt-10 pb-16 md:px-10 md:py-10">
        <div className="mx-auto grid w-full gap-8 md:grid-cols-[1.15fr_0.85fr]">
{/* Side Info */}
          <div className="self-start rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 order-1 md:order-2">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">
              Story Facts
            </p>

            <div className="mt-5 space-y-4 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Type</span>
                <span>{story.type}</span>
              </div>

              <div className="flex justify-between">
                <span>Language</span>
                <span>{languageLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Genre</span>
                <span className="text-right">{genreLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Status</span>
                <span className="text-right">{storyStatus}</span>
              </div>

              <div className="flex justify-between">
                <span>Release</span>
                <span>{releaseLabel}</span>
              </div>

              <div className="flex justify-between">
                <span>Chapter</span>
                <span>{chapterDisplay}</span>
              </div>

              <div className="flex justify-between">
                <span>Audience</span>
                <span>{(story.likes ?? 0).toLocaleString()} likes</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                External Source
              </p>
              <WatchButton
                id={story.id}
                platforms={storyPlatforms}
                platform_links={storyPlatformLinks}
                buttonLabel="Let&apos;s check"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
  <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
    Contact Info
  </p>

  {contactItems.length > 0 ? (
    <div className="mt-2 space-y-1 text-sm text-white/80">
      {contactItems.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  ) : (
    <p className="mt-2 text-sm text-white/40 italic">
      Not provided
    </p>
  )}
</div>
          </div>
          {/* Content */}
          <div className="min-w-0 px-4 py-6 rounded-3xl border border-white/10 bg-white/[0.05] order-2 md:order-1">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/20" />
              <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">
                Content
              </p>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <ProgressiveStoryContent
              text={typeof story.story_content === "string" ? story.story_content : ""}
            />

            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md border border-white/20 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/70"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          

        </div>
      </div>
    </div>
  )
}