// app/shortfilms/[id]/page.tsx
import { notFound } from "next/navigation"
import BackButton from "@/components/BackButton"
import WatchButton from "@/components/WatchButton"
import ExpandableDescription from "@/components/ExpandableDescription"
import ShareButton from "@/components/ShareButton"
import { createClient } from "@/lib/supabase/server"

function getLanguageLabel(film: Record<string, unknown>): string {
  const rawLanguages = film.languages

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
    } catch {
      return rawLanguages
    }
  }

  if (typeof film.language === "string" && film.language.trim()) {
    return film.language
  }

  return "N/A"
}

export default async function ShortFilmPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch directly from Supabase so ALL columns come back including platform_links
  const supabase = await createClient()
  const { data: film, error } = await supabase
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

  if (!film) {
    return notFound()
  }

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

  // Safely normalize platform_links — handles string, object, or null
  const platform_links = parseRecordOrFallback(film.platform_links)

  // Safely normalize platforms array
  const platforms = parseArrayOrFallback(film.platforms)

  const platformFromRecord =
    typeof film.platform === "string" && film.platform.trim().length > 0
      ? film.platform.trim()
      : ""

  const parsedGenres =
    Array.isArray(film.genres)
      ? film.genres
      : typeof film.genres === "string" && film.genres.trim().length > 0
      ? (() => {
          try {
            const parsed = JSON.parse(film.genres)
            return Array.isArray(parsed) ? parsed : [film.genres]
          } catch {
            return [film.genres]
          }
        })()
      : []

  const legacyGenre =
    typeof film.genre === "string" && film.genre.trim().length > 0
      ? [film.genre]
      : []

  const normalizedGenres = [...parsedGenres, ...legacyGenre]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value): value is string => value.length > 0)

  const uniqueGenres = Array.from(new Set(normalizedGenres))
  const genreLabel = uniqueGenres.length > 0 ? uniqueGenres.join(", ") : "N/A"

  const normalizedPlatforms = [
    platformFromRecord,
    ...platforms,
    ...Object.keys(platform_links),
  ]
    .map((name) => (typeof name === "string" ? name.trim() : ""))
    .filter((name): name is string => name.length > 0)

  const uniquePlatforms = Array.from(new Set(normalizedPlatforms))

  const platformLabel =
    uniquePlatforms.length > 0 ? uniquePlatforms.join(", ") : "N/A"

  const primaryPlatform =
    platformFromRecord ||
    platforms.find((name) => typeof name === "string" && name.trim().length > 0) ||
    Object.keys(platform_links).find((name) => name.trim().length > 0) ||
    "N/A"

  const languageLabel = getLanguageLabel(film as Record<string, unknown>)
  const releaseYear =
    typeof film.created_at === "string" && film.created_at.length >= 4
      ? film.created_at.slice(0, 4)
      : "----"

  const contactEmail =
    (typeof film.business_email === "string" && film.business_email.trim()) ||
    (typeof film.creator_email === "string" && film.creator_email.trim()) ||
    ""

  const contactPhone =
    (typeof film.phone_number === "string" && film.phone_number.trim()) ||
    (typeof film.creator_phone === "string" && film.creator_phone.trim()) ||
    ""

  const contactItems = [
    contactEmail ? `Email: ${contactEmail}` : null,
    contactPhone ? `Phone: ${contactPhone}` : null,
  ].filter(Boolean) as string[]

  const ratingLabel =
    typeof film.rating === "string" && film.rating.trim().length > 0
      ? film.rating.trim()
      : "N/A"

  const contentFormat =
    typeof film.content_format === "string" && film.content_format.trim().length > 0
      ? film.content_format.trim()
      : "N/A"

  const specialProfession =
    typeof film.special_profession === "string" && film.special_profession.trim().length > 0
      ? film.special_profession.trim()
      : ""

  const episodeNo =
    typeof film.episode_no === "number"
      ? film.episode_no
      : typeof film.episode_no === "string" && film.episode_no.trim().length > 0
      ? Number(film.episode_no)
      : null

  const partNo =
    typeof film.part_no === "number"
      ? film.part_no
      : typeof film.part_no === "string" && film.part_no.trim().length > 0
      ? Number(film.part_no)
      : null

  const shouldShowEpisodeNo =
    contentFormat.toLowerCase() === "series" && Number.isFinite(episodeNo)
  const shouldShowPartNo =
    contentFormat.toLowerCase() === "film" && Number.isFinite(partNo)

  const categoryLabel =
    typeof film.film_type === "string" && film.film_type.trim().length > 0
      ? film.film_type.trim()
      : typeof film.type === "string" && film.type.trim().length > 0
      ? film.type.trim()
      : "Short Film"

  const formatMetaLabel =
    contentFormat.toLowerCase() === "film"
      ? `Format: Part ${Number.isFinite(partNo) ? partNo : "None"}`
      : contentFormat.toLowerCase() === "series"
      ? `Format: Episode ${Number.isFinite(episodeNo) ? episodeNo : "None"}`
      : "Format: None"

  const badges = [
    `${ratingLabel !== "N/A" ? ratingLabel : "None"}`,
    ` ${languageLabel !== "N/A" ? languageLabel : "None"}`,
    ` ${categoryLabel}`,
    ` ${contentFormat}`,
  ]

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <div className="relative h-[78vh] md:h-[85vh]">
        <img
          src={film.thumbnail_url}
          alt={film.title}
          className="absolute inset-0 h-full w-full object-cover brightness-[1.09]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2027] via-[#203a43]/70 to-transparent mix-blend-multiply" />

        {/* Back button */}
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4 md:px-10">
          <BackButton className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10" />
          <ShareButton title={film.title} sharePath={`/shortfilms/${film.id}`} />
        </div>

        {/* Hero text */}
        <div className="absolute inset-x-0 bottom-6 px-5 md:px-10">
          {/* <p className="text-xs uppercase tracking-[0.35em] text-white/70">
          
          </p> */}

          <h1 className="mt-3 text-2xl text-white/95 md:text-5xl font-semibold tracking-[0.08em] uppercase max-w-full">
            {film.title}
          </h1>

          <p className="mt-2 text-sm text-white/70 break-words max-w-[90%]">
            Created by {film.creator_name} &nbsp; Language: {languageLabel}
          </p>

          <p className="mt-1 text-xs text-white/60">
            Type: {categoryLabel ?? "None"} &nbsp;&nbsp; {(film.views ?? 0).toLocaleString()} views
          </p>

          <WatchButton
            id={film.id}
            platforms={platforms}
            platform_links={platform_links}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-3 pt-10 pb-16 md:px-10 md:py-10">
        <div className="mx-auto grid w-full gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 px-4 py-6 rounded-3xl border border-white/10 bg-white/[0.05] order-2 md:order-1">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/20" />
              <p className="text-[11px] uppercase tracking-[0.5em] text-white/60">
                About
              </p>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <div className="mt-6">
              <ExpandableDescription text={String(film.description || "No description available.")} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white/90"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="self-start rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 order-1 md:order-2">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">
              Overview
            </p>

            <div className="mt-5 space-y-4 text-sm text-white/80">
              <div className="flex justify-between gap-4">
                <span>Category</span>
                <span className="text-right">{categoryLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Release Date</span>
                <span className="text-right">{film.release_date || releaseYear}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Language</span>
                <span className="text-right">{languageLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Genre</span>
                <span className="text-right">{genreLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Rating</span>
                <span className="text-right">{ratingLabel}</span>
              </div>

              {ratingLabel === "S" && (
                <div className="flex justify-between gap-4">
                  <span>Special Profession</span>
                  <span className="text-right">{specialProfession || "N/A"}</span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span>Format</span>
                <span className="text-right">{contentFormat}</span>
              </div>

              {shouldShowPartNo && (
                <div className="flex justify-between gap-4">
                  <span>Part No</span>
                  <span className="text-right">{partNo}</span>
                </div>
              )}

              {shouldShowEpisodeNo && (
                <div className="flex justify-between gap-4">
                  <span>Episode No</span>
                  <span className="text-right">{episodeNo}</span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span>Platform</span>
                <span className="text-right">{platformLabel}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Audience</span>
                <span className="text-right">{(film.views ?? 0).toLocaleString()} views</span>
              </div>
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
                <p className="mt-2 text-sm text-white/80">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}