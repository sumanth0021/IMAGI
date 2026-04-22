"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import BackButton from "@/components/BackButton"

type UploadType = "story" | "film"
type CreatorType = "mine" | "others"

const LANGUAGES = [
  "English",
  "Hindi",
  "konkani",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese",
  "Korean",
  "Japanese",
  "Chinese",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Arabic",
]

const STORY_TYPES = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Fantasy",
  "Romance",
  "Thriller",
  "Horror",
  "slice of life",
  "Mystery",
  "Adventure",
  "Drama",
  "Comedy",
  "Historical",
  "Mythology",
  "Slice of Life",
  "Action",
  "Biography",
  "Young Adult",
  "Supernatural",
  "Crime",
  "Suspense",
]

const FILM_TYPES = [
  "Short Film",
  "Short Vlog",
  "Documentary",
  "Music Video",
  "Experimental",
  "Animation",
  "Web Film",
  "Travel Film",
  "Mockumentary",
  "Interview",
  "Ad Film",
  "Dance Film",
  "Mini-Series Episode",
]

const PLATFORM_OPTIONS = [
  "YouTube",
  "Instagram",
  "Facebook",
  "Apple TV",
  "Netflix",
  "Amazon Prime",
  "JioHotstar",
  "Vimeo",
  "MX Player",
  "Zee5",
  "SonyLIV",
  "Dailymotion",
  "X (Twitter)",
  "Rumble",

]

const RATING_OPTIONS = ["U", "U/A 7+", "U/A 13+", "U/A 16+", "A", "SG", "PG", "PG-13", "R", "NC-17"]

const SPECIAL_PROFESSIONS = [
  "Medical",
  "Legal",
  "Defense",
  "Law Enforcement",
  "Aviation",
  "Industrial Safety",
  "Scientific Research",
  "Other",
]

const inputCls =
  "w-full bg-transparent border-b border-white/20 py-3 text-[16px] leading-[1.65] text-white/90 placeholder-white/40 focus:outline-none focus:border-white/55 transition"
const textareaCls =
  "w-full bg-transparent border border-white/14 rounded-2xl px-4 py-4 text-[16px] leading-[1.8] text-white/90 placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.03] transition resize-none"
const selectCls =
  "w-full appearance-none rounded-2xl border border-white/14 bg-[#111113] px-4 py-3.5 text-[16px] leading-[1.65] text-white/90 focus:outline-none focus:border-white/30 transition"

const platformPlaceholders: Record<string, string> = {
  YouTube: "Enter YouTube link",
  Instagram: "Enter Instagram link",
  Facebook: "Enter Facebook link",
  "Apple TV": "Enter Apple TV link",
  Netflix: "Enter Netflix link",
  "Amazon Prime": "Enter Amazon Prime link",
  "JioHotstar": "Enter JioHotstar link",
  Vimeo: "Enter Vimeo link",
  "MX Player": "Enter MX Player link",
  Zee5: "Enter Zee5 link",
  SonyLIV: "Enter SonyLIV link",
  Dailymotion: "Enter Dailymotion link",
  "X (Twitter)": "Enter X profile or post link",
  Rumble: "Enter Rumble link",
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium leading-[1.6] text-white/75">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="text-[16px] font-semibold leading-[1.6] text-white/78">{title}</div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function Input({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputCls} ${type === "date" ? "[color-scheme:dark]" : ""}`}
    />
  )
}

function Textarea({
  placeholder,
  value,
  onChange,
  rows = 6,
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={textareaCls}
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder = "Select option",
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectCls}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Pills({
  value,
  options,
  onChange,
  emptyLabel = "None",
  showEmpty = true,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
  emptyLabel?: string
  showEmpty?: boolean
}) {
  const baseClasses =
    "rounded-xl border px-4 py-2.5 text-[15px] font-medium leading-[1.6] transition"

  return (
    <div className="flex flex-wrap gap-3">
      {showEmpty && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={`${baseClasses} ${
            value === ""
              ? "border-white bg-white text-black"
              : "border-white/12 text-white/70 hover:border-white/25 hover:text-white"
          }`}
        >
          {emptyLabel}
        </button>
      )}
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option === value ? "" : option)}
          className={`${baseClasses} ${
            value === option
              ? "border-white bg-white text-black"
              : "border-white/12 text-white/70 hover:border-white/25 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function MultiPills({
  value,
  options,
  onChange,
}: {
  value: string[]
  options: string[]
  onChange: (value: string[]) => void
}) {
  const toggleValue = (option: string) => {
    onChange(value.includes(option) ? value.filter((entry) => entry !== option) : [...value, option])
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => toggleValue(option)}
          className={`rounded-xl border px-4 py-2.5 text-[15px] font-medium leading-[1.6] transition ${
            value.includes(option)
              ? "border-white bg-white text-black"
              : "border-white/12 text-white/70 hover:border-white/25 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function CreatorToggle({
  value,
  onChange,
}: {
  value: CreatorType
  onChange: (value: CreatorType) => void
}) {
  return (
    <div className="flex gap-2 rounded-2xl border border-white/8 bg-white/5 p-1">
      {(["mine", "others"] as CreatorType[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 rounded-xl px-4 py-2.5 text-[15px] font-medium leading-[1.6] transition ${
            value === option ? "bg-white text-black" : "text-white/75 hover:text-white"
          }`}
        >
          {option === "mine" ? "Mine" : "Others"}
        </button>
      ))}
    </div>
  )
}

function FilmSeriesToggle({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const options = [
    { value: "", label: "None" },
    { value: "Film", label: "Film" },
    { value: "Series", label: "Series" },
  ]

  return (
    <div className="flex gap-2 rounded-2xl border border-white/8 bg-white/5 p-1">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-xl px-4 py-2.5 text-[15px] font-medium leading-[1.6] transition ${
            value === option.value ? "bg-white text-black" : "text-white/75 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CreatorFields({
  creatorType,
  onCreatorTypeChange,
  name,
  onName,
  email,
  onEmail,
  phone,
  onPhone,
}: {
  creatorType: CreatorType
  onCreatorTypeChange: (value: CreatorType) => void
  name: string
  onName: (value: string) => void
  email: string
  onEmail: (value: string) => void
  phone: string
  onPhone: (value: string) => void
}) {
  return (
    <div className="space-y-5">
      <Field label="Creator" required>
        <CreatorToggle value={creatorType} onChange={onCreatorTypeChange} />
      </Field>

      {creatorType === "mine" ? (
        <div className="space-y-5">
          <Field label="Your Name" required>
            <Input placeholder="Enter your name" value={name} onChange={onName} />
          </Field>
          <Field label="Business Email">
            <Input type="email" placeholder="your@email.com" value={email} onChange={onEmail} />
          </Field>
          <Field label="Phone Number">
            <Input type="tel" placeholder="+91 00000 00000" value={phone} onChange={onPhone} />
          </Field>
        </div>
      ) : (
        <Field label="Creator Name" required>
          <Input placeholder="Enter creator name" value={name} onChange={onName} />
        </Field>
      )}
    </div>
  )
}

function ThumbnailUpload({
  preview,
  onFile,
}: {
  preview: string | null
  onFile: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium leading-[1.6] text-white/75">Thumbnail</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 transition hover:border-white/30"
        style={{ aspectRatio: "16 / 9" }}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Thumbnail preview" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm text-white/0 transition hover:bg-black/35 hover:text-white">
              Change thumbnail
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[16px] font-medium leading-[1.6] text-white/80">Upload thumbnail</span>
            <span className="text-[15px] leading-[1.6] text-white/45">JPG, PNG, WEBP</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
        }}
      />
    </div>
  )
}

function Toast({
  message,
  type,
}: {
  message: string
  type: "error" | "success"
}) {
  return (
    <div
      className="fixed bottom-8 left-4 right-4 z-50 flex justify-center sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2"
      style={{ animation: "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
    >
      <div
        className="w-full rounded-2xl px-5 py-3.5 text-center text-sm sm:w-auto"
        style={{
          background: type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
          backdropFilter: "blur(20px)",
          border: type === "error" ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          color: type === "error" ? "#fca5a5" : "#86efac",
        }}
      >
        {message}
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  )
}

export default function UploadPage() {
  const router = useRouter()
  const [type, setType] = useState<UploadType>("story")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)

  const [storyCreator, setStoryCreator] = useState<CreatorType>("mine")
  const [story, setStory] = useState({
    title: "",
    creator_name: "",
    creator_email: "",
    creator_phone: "",
    status: "",
    story_type: "",
    genre: [] as string[],
    language: [] as string[],
    release_date: "",
    chapters: "",
    content: "",
    pdf_link: "",
  })

  const [filmCreator, setFilmCreator] = useState<CreatorType>("mine")
  const [film, setFilm] = useState({
    title: "",
    creator_name: "",
    creator_email: "",
    creator_phone: "",
    film_type: "",
    release_date: "",
    rating: "",
    special_profession: "",
    content_format: "",
    part_no: "",
    episode_no: "",
    genre: [] as string[],
    language: [] as string[],
    platforms: [] as string[],
    platform_links: {} as Record<string, string>,
    description: "",
  })

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) router.replace("/signup?from=upload")
    }

    checkUser()
  }, [router])

  const showToast = (message: string, toastType: "error" | "success" = "error") => {
    setToast({ message, type: toastType })
    setTimeout(() => setToast(null), 4000)
  }

  const handlePlatformLink = (platform: string, link: string) => {
    setFilm((current) => ({
      ...current,
      platform_links: { ...current.platform_links, [platform]: link },
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace("/signup?from=upload")
      return
    }

    const isStory = type === "story"
    const title = isStory ? story.title : film.title
    const creatorName = isStory ? story.creator_name : film.creator_name

    if (!title.trim()) {
      showToast("Title is required")
      setLoading(false)
      return
    }
    if (!creatorName.trim()) {
      showToast("Creator name is required")
      setLoading(false)
      return
    }
    if (isStory && !story.content.trim()) {
      showToast("Story content is required")
      setLoading(false)
      return
    }
    if (isStory && !story.status.trim()) {
      showToast("Select story status")
      setLoading(false)
      return
    }
    if (!isStory && film.platforms.length === 0) {
      showToast("Select at least one platform")
      setLoading(false)
      return
    }
    if (!isStory) {
      for (const platform of film.platforms) {
        const link = film.platform_links[platform]
        if (!link?.trim()) {
          showToast(`Enter link for ${platform}`)
          setLoading(false)
          return
        }
      }
    }
    if (!isStory && !film.rating.trim()) {
      showToast("Select content rating")
      setLoading(false)
      return
    }
    if (!isStory && film.rating === "S" && !film.special_profession.trim()) {
      showToast("Select special profession for S rating")
      setLoading(false)
      return
    }
    if (!isStory && film.content_format === "Film") {
      if (!film.part_no.trim()) {
        showToast("Enter film part number")
        setLoading(false)
        return
      }
      const partNo = Number(film.part_no)
      if (!Number.isInteger(partNo) || partNo < 1 || partNo > 3) {
        showToast("Part number must be 1, 2 or 3")
        setLoading(false)
        return
      }
    }
    if (!isStory && film.content_format === "Series") {
      if (!film.episode_no.trim()) {
        showToast("Enter episode number")
        setLoading(false)
        return
      }
      const episodeNo = Number(film.episode_no)
      if (!Number.isInteger(episodeNo) || episodeNo <= 0) {
        showToast("Episode number must be a positive whole number")
        setLoading(false)
        return
      }
    }
    if (!thumbFile) {
      showToast("Thumbnail is required")
      setLoading(false)
      return
    }

    const extension = thumbFile.name.split(".").pop()
    const path = `thumbnails/${user.id}/${Date.now()}.${extension}`
    const { error: uploadError } = await supabase.storage.from("content").upload(path, thumbFile, { upsert: true })

    if (uploadError) {
      showToast("Thumbnail upload failed")
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage.from("content").getPublicUrl(path)
    const thumbnail_url = urlData.publicUrl

    const payload = isStory
      ? {
          type: "story",
          title: story.title,
          creator_name: story.creator_name,
        business_email: story.creator_email || null,
        phone_number: story.creator_phone || null,
        languages: story.language,
        genres: story.genre,
        release_date: story.release_date || null,
        status: story.status.toLowerCase(),
        chapters: story.chapters.trim() ? Number(story.chapters) : null,
        story_content: story.content,
        pdf_link: story.pdf_link?.trim() || null,
        thumbnail_url,
        user_id: user.id,
        }
      : {
          type: "film",
          title: film.title,
          creator_type: filmCreator,
          creator_name: film.creator_name,
          business_email: film.creator_email || null,
          phone_number: film.creator_phone || null,
          film_type: film.film_type || null,
          release_date: film.release_date || null,
          rating: film.rating || null,
          special_profession: film.rating === "S" ? film.special_profession || null : null,
          content_format: film.content_format || null,
          part_no:
            film.content_format === "Film" && film.part_no.trim()
              ? Number(film.part_no)
              : null,
          episode_no:
            film.content_format === "Series" && film.episode_no.trim()
              ? Number(film.episode_no)
              : null,
          languages: film.language,
          genres: film.genre,
          platforms: film.platforms,
          platform_links: film.platform_links,
          description: film.description || null,
          thumbnail_url,
          user_id: user.id,
        }

    const { error: databaseError } = await supabase.from("content").insert(payload)
    if (databaseError) {
      showToast(databaseError.message)
      setLoading(false)
      return
    }

    showToast("Published successfully!", "success")
    setTimeout(() => router.push("/profile"), 1500)
  }

  return (
    <div
      className="h-screen overflow-hidden bg-black text-[16px] leading-[1.7] text-white"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-3 text-white">
          <BackButton className="flex items-center justify-center rounded-full p-2 text-blue-500 transition hover:bg-white/10" />
          <div className="flex-1 text-center text-lg font-semibold leading-[1.4]">UPLOAD</div>
          <div className="w-10" />
        </div>
      </div>

      <div
        data-upload-scroll="true"
        className="mx-auto max-w-7xl px-5 pb-20 pt-8 overflow-y-scroll no-scrollbar h-[calc(100vh-61px)]"
        style={{ animation: "pageFadeIn 0.32s ease-out both" }}
      >
        <div className="relative mb-8 flex gap-2 rounded-2xl border border-white/8 bg-white/5 p-1">
          <div
            className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white shadow-[0_12px_40px_rgba(255,255,255,0.08)] transition-transform duration-300 ease-out ${
              type === "film" ? "translate-x-full" : ""
            }`}
          />
          {([
            {
              id: "story" as UploadType,
              label: "Story",
              icon: (
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 10h34a6 6 0 0 1 6 6v34a8 8 0 0 1-8 8H20a10 10 0 0 1-10-10V16a6 6 0 0 1 6-6z" />
                  <path d="M40 10v10h12" />
                  <line x1="20" y1="22" x2="36" y2="22" />
                  <line x1="20" y1="30" x2="40" y2="30" />
                  <line x1="20" y1="38" x2="36" y2="38" />
                  <line x1="20" y1="46" x2="32" y2="46" />
                  <path d="M38 48c4-10 10-16 18-18-6 8-10 14-18 18z" />
                </svg>
              ),
            },
            {
              id: "film" as UploadType,
              label: "Short Film",
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M10 9l5 3-5 3V9z" />
                </svg>
              ),
            },
          ]).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setType(option.id)}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[16px] font-medium leading-[1.6] transition-colors duration-200 ${
                type === option.id ? "text-black" : "text-white/75 hover:text-white"
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {type === "story" && (
          <div className="space-y-8 lg:grid lg:grid-cols-[minmax(340px,390px)_minmax(0,1fr)] lg:gap-16 lg:space-y-0 xl:gap-20">
            <div className="space-y-8">
              <div className="hidden lg:block">
                <ThumbnailUpload
                  preview={thumbPreview}
                  onFile={(file) => {
                    setThumbFile(file)
                    setThumbPreview(URL.createObjectURL(file))
                  }}
                />
              </div>

              <Section title="Basic Info">
                <Field label="Title" required>
                  <Input
                    placeholder="Enter story title"
                    value={story.title}
                    onChange={(value) => setStory((current) => ({ ...current, title: value }))}
                  />
                </Field>

                <CreatorFields
                  creatorType={storyCreator}
                  onCreatorTypeChange={setStoryCreator}
                  name={story.creator_name}
                  onName={(value) => setStory((current) => ({ ...current, creator_name: value }))}
                  email={story.creator_email}
                  onEmail={(value) => setStory((current) => ({ ...current, creator_email: value }))}
                  phone={story.creator_phone}
                  onPhone={(value) => setStory((current) => ({ ...current, creator_phone: value }))}
                />
              </Section>
            </div>

            <div className="space-y-8">
              <Section title="Story Details">
                <Field label="Story Status">
                  <Pills
                    value={story.status}
                    options={["Ongoing", "Completed"]}
                    onChange={(value) => setStory((current) => ({ ...current, status: value }))}
                  />
                </Field>

                <Field label="Story Type">
                  <Select
                    value={story.story_type}
                    onChange={(value) => setStory((current) => ({ ...current, story_type: value }))}
                    placeholder="Select type"
                    options={STORY_TYPES}
                  />
                </Field>

                <Field label="Genre">
                  <MultiPills
                    value={story.genre}
                    options={[
                      "Action",
                      "Romance",
                      "Comedy",
                      "Thriller",
                      "Horror",
                      "Drama",
                      "Fantasy",
                      "Sci-Fi",
                      "Mystery",
                      "Crime",
                      "Psychological",
                      "Adventure",
                    ]}
                    onChange={(value) => setStory((current) => ({ ...current, genre: value }))}
                  />
                </Field>

                <Field label="Language">
                  <MultiPills
                    value={story.language}
                    options={LANGUAGES}
                    onChange={(value) => setStory((current) => ({ ...current, language: value }))}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Release Date">
                    <Input
                      type="date"
                      placeholder=""
                      value={story.release_date}
                      onChange={(value) => setStory((current) => ({ ...current, release_date: value }))}
                    />
                  </Field>

                  <Field label="Chapter No">
                    <Input
                      type="number"
                      placeholder="Enter chapter number"
                      value={story.chapters}
                      onChange={(value) => setStory((current) => ({ ...current, chapters: value }))}
                    />
                  </Field>
                </div>
              </Section>

              <Section title="Content">
                <Field label="Story Content" required>
                  <Textarea
                    rows={10}
                    placeholder="Write your story here..."
                    value={story.content}
                    onChange={(value) => setStory((current) => ({ ...current, content: value }))}
                  />
                </Field>

                <Field label="Add external Link">
                  <Input
                    placeholder="Google Drive / Dropbox PDF/ official site link"
                    value={story.pdf_link}
                    onChange={(value) => setStory((current) => ({ ...current, pdf_link: value }))}
                  />
                </Field>
              </Section>
            </div>

            <div className="lg:hidden">
              <ThumbnailUpload
                preview={thumbPreview}
                onFile={(file) => {
                  setThumbFile(file)
                  setThumbPreview(URL.createObjectURL(file))
                }}
              />
            </div>
          </div>
        )}

        {type === "film" && (
          <div className="space-y-8 lg:grid lg:grid-cols-[minmax(340px,390px)_minmax(0,1fr)] lg:gap-16 lg:space-y-0 xl:gap-20">
            <div className="space-y-8">
              <div className="hidden lg:block">
                <ThumbnailUpload
                  preview={thumbPreview}
                  onFile={(file) => {
                    setThumbFile(file)
                    setThumbPreview(URL.createObjectURL(file))
                  }}
                />
              </div>

              <Section title="Basic Info">
                <Field label="Title" required>
                  <Input
                    placeholder="Enter film title"
                    value={film.title}
                    onChange={(value) => setFilm((current) => ({ ...current, title: value }))}
                  />
                </Field>

                <CreatorFields
                  creatorType={filmCreator}
                  onCreatorTypeChange={setFilmCreator}
                  name={film.creator_name}
                  onName={(value) => setFilm((current) => ({ ...current, creator_name: value }))}
                  email={film.creator_email}
                  onEmail={(value) => setFilm((current) => ({ ...current, creator_email: value }))}
                  phone={film.creator_phone}
                  onPhone={(value) => setFilm((current) => ({ ...current, creator_phone: value }))}
                />
              </Section>
            </div>

            <div className="space-y-8">
              <Section title="Film Details">
                <Field label="Type">
                  <Select
                    value={film.film_type}
                    onChange={(value) => setFilm((current) => ({ ...current, film_type: value }))}
                    placeholder="Select type"
                    options={FILM_TYPES}
                  />
                </Field>

                <Field label="Release Date">
                  <Input
                    type="date"
                    placeholder=""
                    value={film.release_date}
                    onChange={(value) => setFilm((current) => ({ ...current, release_date: value }))}
                  />
                </Field>

                <Field label="Genre">
                  <MultiPills
                    value={film.genre}
                    options={[
                      "Action",
                      "Romance",
                      "Comedy",
                      "Thriller",
                      "Horror",
                      "Drama",
                      "Fantasy",
                      "Sci-Fi",
                      "Mystery",
                      "Crime",
                      "Psychological",
                      "Adventure",
                    ]}
                    onChange={(value) => setFilm((current) => ({ ...current, genre: value }))}
                  />
                </Field>

                <Field label="Language">
                  <MultiPills
                    value={film.language}
                    options={LANGUAGES}
                    onChange={(value) => setFilm((current) => ({ ...current, language: value }))}
                  />
                </Field>
              </Section>

              <Section title="Platforms">
                <Field label="Available On">
                  <MultiPills
                    value={film.platforms}
                    options={PLATFORM_OPTIONS}
                    onChange={(value) => setFilm((current) => ({ ...current, platforms: value }))}
                  />
                </Field>

                {film.platforms.length > 0 && (
                  <div className="space-y-5">
                    {film.platforms.map((platform) => (
                      <Field key={platform} label={platform}>
                        <Input
                          placeholder={platformPlaceholders[platform] ?? `Enter ${platform} link`}
                          value={film.platform_links[platform] ?? ""}
                          onChange={(value) => handlePlatformLink(platform, value)}
                        />
                      </Field>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Classification & Format">
                <Field label="Rating" required>
                  <Select
                    value={film.rating}
                    onChange={(value) =>
                      setFilm((current) => ({
                        ...current,
                        rating: value,
                        special_profession: value === "S" ? current.special_profession : "",
                      }))
                    }
                    placeholder="Select rating"
                    options={RATING_OPTIONS}
                  />
                </Field>

                <p className="-mt-2 text-xs leading-[1.6] text-white/55">
                  U: Everyone | UA: Kids + parental guidance | UA 13+: Teens (guided) | UA 16+: Mature teens | A: Adults only | S: Special profession
                </p>

                {film.rating === "S" && (
                  <Field label="Special Profession" required>
                    <Select
                      value={film.special_profession}
                      onChange={(value) => setFilm((current) => ({ ...current, special_profession: value }))}
                      placeholder="Select profession"
                      options={SPECIAL_PROFESSIONS}
                    />
                  </Field>
                )}

                <Field label="Format (Film / Series)">
                  <FilmSeriesToggle
                    value={film.content_format}
                    onChange={(value) =>
                      setFilm((current) => ({
                        ...current,
                        content_format: value,
                        part_no: value === "Film" ? current.part_no : "",
                        episode_no: value === "Series" ? current.episode_no : "",
                      }))
                    }
                  />
                </Field>

                {film.content_format === "Film" && (
                  <Field label="Part No" required>
                    <Input
                      type="number"
                      placeholder="Enter part number (1, 2, 3)"
                      value={film.part_no}
                      onChange={(value) => setFilm((current) => ({ ...current, part_no: value }))}
                    />
                  </Field>
                )}

                {film.content_format === "Series" && (
                  <Field label="Episode No" required>
                    <Input
                      type="number"
                      placeholder="Enter episode number"
                      value={film.episode_no}
                      onChange={(value) => setFilm((current) => ({ ...current, episode_no: value }))}
                    />
                  </Field>
                )}
              </Section>

              <Section title="Description">
                <Field label="Film Description">
                  <Textarea
                    rows={5}
                    placeholder="Describe your short film..."
                    value={film.description}
                    onChange={(value) => setFilm((current) => ({ ...current, description: value }))}
                  />
                </Field>
              </Section>
            </div>

            <div className="lg:hidden">
              <ThumbnailUpload
                preview={thumbPreview}
                onFile={(file) => {
                  setThumbFile(file)
                  setThumbPreview(URL.createObjectURL(file))
                }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-[16px] font-semibold leading-[1.6] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
      <style>{`
        @keyframes pageFadeIn{from{opacity:0}to{opacity:1}}

        @media (min-width: 1024px) {
          html,
          body {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }
        }

        [data-upload-scroll="true"] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        [data-upload-scroll="true"]::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
          display: none !important;
          background: transparent;
        }
      `}</style>
    </div>
  )
}
