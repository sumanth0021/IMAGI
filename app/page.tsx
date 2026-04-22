"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Suspense } from "react"
import { useCallback, useEffect, useState } from "react"
import { Search, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Instagram, Youtube, Facebook } from "lucide-react"
import { X ,Eye} from "lucide-react"
import { ArrowRight } from "lucide-react"
import { getStories, getFilms } from "@/lib/data"
import { Cinzel } from "next/font/google"
import { createClient } from "@/lib/supabase/client"
import { useDatabaseStatus } from "@/components/DatabaseStatusProvider"
import { runSupabaseQuery } from "@/lib/supabase/request"
import Image from "next/image"
import HeroSection from "@/components/HeroSection"

const normalizeSocialUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}





function HomeContent() {
const router = useRouter()
const { setDbError, setDbLoading, setDbOk, setRetryHandler } = useDatabaseStatus()

useEffect(() => {
  const openTarget = new URLSearchParams(window.location.search).get("open")
  if (!openTarget) return

  const decodedTarget = decodeURIComponent(openTarget)
  const isAllowedTarget =
    decodedTarget.startsWith("/stories/") || decodedTarget.startsWith("/shortfilms/")

  if (!isAllowedTarget) return

  const timeoutId = window.setTimeout(() => {
    window.dispatchEvent(new Event("imagi:navigation-start"))
    window.history.replaceState({}, "", "/")
    router.push(decodedTarget)
  }, 1000)

  return () => window.clearTimeout(timeoutId)
}, [router])

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0)

// componets section
const [searchOpen, setSearchOpen] = useState(false)
const [query, setQuery] = useState("")
const [results, setResults] = useState<any[]>([])
const [contactEmail, setContactEmail] = useState("")
const [socialLinks, setSocialLinks] = useState({
  instagram: "",
  youtube: "",
  facebook: "",
  x: "",
})
const SEARCH_RESULT_LIMIT = 24

useEffect(() => {
  const fetchFooterSettings = async () => {
    const supabase = createClient()
    try {
      const { data: contactData } = await runSupabaseQuery(
        supabase
          .from("site_settings")
          .select("value")
          .eq("key", "contact_email")
          .maybeSingle()
      )

      const { data: socialData } = await runSupabaseQuery(
        supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_instagram_url", "social_youtube_url", "social_facebook_url", "social_x_url"])
      )

      const map = new Map((socialData ?? []).map((row) => [row.key, typeof row.value === "string" ? row.value : ""]))

      setContactEmail(typeof contactData?.value === "string" ? contactData.value : "")
      setSocialLinks({
        instagram: normalizeSocialUrl(map.get("social_instagram_url") ?? ""),
        youtube: normalizeSocialUrl(map.get("social_youtube_url") ?? ""),
        facebook: normalizeSocialUrl(map.get("social_facebook_url") ?? ""),
        x: normalizeSocialUrl(map.get("social_x_url") ?? ""),
      })
    } catch {
      setContactEmail("")
      setSocialLinks({ instagram: "", youtube: "", facebook: "", x: "" })
    }
  }

  void fetchFooterSettings()
}, [])

useEffect(() => {
  const search = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const supabase = createClient()

    try {
      const { data } = await runSupabaseQuery(
        supabase
          .from("content")
          .select("id, title, thumbnail_url, type")
          .or(`title.ilike.%${query}%,creator_name.ilike.%${query}%`)
          .limit(SEARCH_RESULT_LIMIT)
      )
      setResults(data || [])
      setDbOk()
    } catch (error: unknown) {
      setDbError(error)
    }
  }

  const delay = setTimeout(search, 300)
  return () => clearTimeout(delay)
}, [query])

const [stories, setStories] = useState<any[]>([])
const [films, setFilms] = useState<any[]>([])
const [isLoadingContent, setIsLoadingContent] = useState(true)

const topRankedStories = [...stories]
  .filter((story) => story.rank !== null && story.rank !== undefined)
  .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER))
  .slice(0, 10)

const topRankedFilms = [...films]
  .filter((film) => film.rank !== null && film.rank !== undefined)
  .sort((a, b) => (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER))
  .slice(0, 10)

const loadData = useCallback(async () => {
    setDbLoading()
    try {
      const [s, f] = await Promise.all([getStories(), getFilms()])

      setStories(s)
      setFilms(f)
      setDbOk()
    } catch (error: unknown) {
      setDbError(error)
    } finally {
      setIsLoadingContent(false)
    }
}, [setDbError, setDbLoading, setDbOk])

useEffect(() => {
  setRetryHandler(() => loadData())
  void loadData()

  return () => {
    setRetryHandler(null)
  }
}, [loadData, setRetryHandler])

const storySkeletonItems = Array.from({ length: 10 })
const filmSkeletonItems = Array.from({ length: 8 })

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

const heroItems = [
  {
    image: "https://i.pinimg.com/1200x/f9/27/ca/f927ca29c2eca064e61b8436725db264.jpg",
    title: "The Last Frame",
    description: "A silent filmmaker rediscovers his passion through an unexpected journey."
  },
  {
    image: "https://i.pinimg.com/736x/91/8a/11/918a1114612d485c4c3e4701b0af7722.jpg",
    title: "Midnight Confession",
    description: "Two strangers meet at 2AM and their lives change forever."
  },
  {
    image: "https://i.pinimg.com/736x/27/06/56/27065632cf683a265e1fe8bfe5ebefca.jpg",
    title: "Fragments",
    description: "A story told through memories that don’t belong to the same person."
  },
  {
    image: "https://i.pinimg.com/1200x/24/ee/73/24ee730c1337e3d82a76a93773ef6849.jpg",
    title: "3 Legends",
    description: "A story told about 3 legendary sanin."
  }
]
const [current, setCurrent] = useState(0)

useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % heroItems.length)
  }, 7000)



  return () => clearInterval(interval)
}, [])

useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchOpen(false)
    }
  }

  window.addEventListener("keydown", handleKey)
  return () => window.removeEventListener("keydown", handleKey)
}, [])

useEffect(() => {
  const body = document.body
  const html = document.documentElement
  const scrollY = window.scrollY
  const prevBodyOverflow = body.style.overflow
  const prevBodyPosition = body.style.position
  const prevBodyTop = body.style.top
  const prevBodyLeft = body.style.left
  const prevBodyRight = body.style.right
  const prevBodyWidth = body.style.width
  const prevHtmlOverflow = html.style.overflow
  const prevBodyPaddingRight = body.style.paddingRight

  if (searchOpen) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.overflow = "hidden"
    html.style.overflow = "hidden"
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  return () => {
    const offsetY = body.style.top
    const restoredScrollY = Math.abs(parseInt(offsetY || "0", 10)) || 0
    body.style.position = prevBodyPosition
    body.style.top = prevBodyTop
    body.style.left = prevBodyLeft
    body.style.right = prevBodyRight
    body.style.width = prevBodyWidth
    body.style.overflow = prevBodyOverflow
    html.style.overflow = prevHtmlOverflow
    body.style.paddingRight = prevBodyPaddingRight
    if (searchOpen) {
      window.scrollTo(0, restoredScrollY)
    }
  }
}, [searchOpen])


const scrollRef = useRef<HTMLDivElement>(null)

const scrollLeft = () => {
  scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
}

const scrollRight = () => {
  scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })
}

// scrool detect  component
const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 80)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

// short flim list componet

const filmScrollRef = useRef<HTMLDivElement>(null)

const scrollFilmLeft = () => {
  filmScrollRef.current?.scrollBy({ left: -500, behavior: "smooth" })
}

const scrollFilmRight = () => {
  filmScrollRef.current?.scrollBy({ left: 500, behavior: "smooth" })
}

const [isAtStart, setIsAtStart] = useState(true)





//component section end

  return (
    <main className="min-h-screen bg-[#000000] transition-colors duration-500">
      
{/* nav bar */}
    <nav
  className={`fixed top-0 left-0 w-full z-50 transition-[padding,background-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    scrolled
      ? "bg-black/80 backdrop-blur-xl py-3"
      : "bg-black/30 backdrop-blur-md py-4"
  }`}
>
  <div className="max-w-7xl mx-auto px-3 md:px-10 flex items-center text-white relative transition-all duration-500">

    {/* Logo placeholder (keeps layout) */}
    <span
      aria-hidden="true"
      className={`invisible select-none font-bold tracking-wide transition-[font-size] duration-500 ${
        scrolled ? "text-xl md:text-2xl" : "text-xl md:text-3xl"
      }`}
    >
      IMAGI
    </span>

    {/* Logo */}
    <motion.h1
      onClick={() => window.location.reload()}
      initial={false}
      animate={{
        left: scrolled ? "50%" : "24px",
        x: scrolled ? "-50%" : "0%",
        y: "-50%"
      }}
      transition={{
        type: "tween",
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`absolute top-1/2 z-10 font-bold tracking-wide cursor-pointer transition-[font-size] duration-300 ${
        scrolled ? "text-xl md:text-2xl" : "text-xl md:text-3xl"
      }`}
    >
      IMAGI
    </motion.h1>

    {/* Desktop Links */}
    <motion.div
      initial={false}
      animate={scrolled ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ pointerEvents: scrolled ? "none" : "auto" }}
      className="hidden landscape:flex md:flex flex-1 justify-center items-center gap-8 text-sm font-medium"
    >
      <button className="hover:opacity-70 transition" onClick={() => scrollToSection("explore")}>Explore</button>
      <button className="hover:opacity-70 transition" onClick={() => scrollToSection("upload")}>Post</button>
      <button className="hover:opacity-70 transition" onClick={() => scrollToSection("about")}>About</button>
    </motion.div>

    {/* Icons */}
    <motion.div
      initial={false}
      animate={scrolled ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ pointerEvents: scrolled ? "none" : "auto" }}
      className="ml-auto flex items-center gap-4 md:gap-6"
    >
      <button
        onClick={() => setSearchOpen(true)}
        className="p-2 rounded-full hover:bg-white/20 transition"
      >
        <Search size={20} />
      </button>

      <Link href="/signup">
  <button className="p-2 rounded-full hover:bg-white/20 transition">
    <User size={20} />
  </button>
</Link>
    </motion.div>

  </div>
</nav>

      {/* HERO SECTION */}
      {/* <section className="relative h-[85svh] md:h-[85vh] overflow-hidden">

  <AnimatePresence mode="wait">
    <motion.img
      key={heroItems[current].image}
      src={heroItems[current].image}
      alt="hero"
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    />
  </AnimatePresence>

  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

<div className="absolute inset-0 flex items-end md:items-center pb-20 md:pb-0">
  <div className="w-full max-w-2xl px-6 md:px-16 text-white">
      
      <AnimatePresence mode="wait">
        <motion.h1
          key={heroItems[current].title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1.5 }}
          className="text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight"
        >
          {heroItems[current].title}
        </motion.h1>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={heroItems[current].description}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1.5 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-gray-200"
        >
          {heroItems[current].description}
        </motion.p>
      </AnimatePresence>

    </div>
  </div>

</section> */}
<HeroSection />

{/* Tagline Section */}
<section id="explore" className="bg-[#000000] px-8 md:px-20 py-20 md:py-24 overflow-hidden mt-3">

  <h2
    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug max-w-3xl"
    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
  >
    {/* <span className="text-white">情熱を注ぐ。そのための</span> */}
    <span className="text-white">Enjoy</span>
    <br />
    <span 
      style={{
        background: "linear-gradient(90deg, #e8f4ff 0%, #a8d8ff 40%, #7ec8ff 70%, #b8f0e8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "brightness(1.15)",
        
      }}
    >
      its yours space。
    </span>
  </h2>
  <div className="mt-6 w-10 h-[3px] bg-red-700 rounded-full" />
</section>

 {/* Title 01
  <motion.h2
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.5 }}
    className=" text-center text-4xl font-bold mb-20 text-gray-400 hover:text-white transition"
  >
    Ready! To Explore
  </motion.h2> */}

{/* Stories Section */}

<section className="bg-[#000000] text-white px-6 md:px-20 py-16 md:py-20">

  {/* Section Title */}
  <h2 className="text-3xl font-semibold mb-3 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
    Top 10  Stories
  </h2>

  <p className="text-gray-400 mb-12 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_160ms_forwards]">
    The most popular stories go check out which one you like!
  </p>

  {/* Posters Grid */}
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
  {isLoadingContent
    ? storySkeletonItems.map((_, index) => (
        <div
          key={`top-story-skeleton-${index}`}
          className="relative group animate-pulse"
        >
          <div className="rounded-2xl overflow-hidden relative bg-white/10">
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          </div>

          <div className="mt-4 h-3 rounded bg-white/10" />
        </div>
      ))
    : topRankedStories.map((story, index) => (
  <Link key={story.id} href={`/stories/${story.id}`}>
    <div
      className="relative group cursor-pointer opacity-0 will-change-transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-[1.01] animate-[apple-card-in_820ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
      style={{ animationDelay: `${180 + index * 70}ms` }}
    >

      <div className="rounded-2xl overflow-hidden relative">
        <div className="absolute top-3 left-3 bg-red-800 text-white text-xs px-3 py-1 rounded-md z-10 shadow-md">
          TOP {story.rank !== null ? `${story.rank}` : ""}
        </div>

        <img
          src={story.thumbnail_url}
          alt={story.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-[1.045] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>

      <p className="mt-4 text-xs text-gray-200">
        {story.title}
      </p>

    

    </div>
  </Link>
))}
</div>

</section>

{/* Short Film Section */}
{/* Top 10 Short Films */}
<section className="bg-[#000000] text-white px-6 md:px-20 py-16 md:py-24">
  <h2 className="text-3xl font-semibold mb-3 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
    Top 10 Short Films
  </h2>

  <p className="text-gray-400 mb-12 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_160ms_forwards]">
    Best and underated short films.
  </p>

  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">

    {isLoadingContent
      ? filmSkeletonItems.map((_, index) => (
          <div
            key={`top-film-skeleton-${index}`}
            className="relative group animate-pulse"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white/10">
              <div className="w-full aspect-video bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            </div>

            <div className="mt-6 h-3 rounded bg-white/10" />
            <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
          </div>
        ))
      : topRankedFilms.map((film,index) => (
  <Link key={film.id} href={`/shortfilms/${film.id}`}>
      <div
        className="relative group cursor-pointer opacity-0 will-change-transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-[1.01] animate-[apple-card-in_820ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
        style={{ animationDelay: `${200 + index * 65}ms` }}
      >

        <div className="relative rounded-2xl overflow-hidden">

          {/* Red Ranking Badge */}
          <div className="absolute top-0 left- bg-red-800 text-white text-xs px-3 py-1 rounded- z-10 shadow-md">
            TOP  {film.rank !== null ? `${film.rank}` : ""}
          </div>

          <img
            src={film.thumbnail_url}
            alt={film.title}
            className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />

          {/* Dark Hover Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />

          {/* Play Button */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              ▶
            </div>
          </div> */}

        </div>

        {/* Film Info */}
        <h3 className="mt-6 text-xs font-medium">
          {film.title}
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          {film.creator_name ?? "Unknown creator"}
        </p>

        <span className="flex items-center gap-1.5 text-xs text-gray-400">
  <Eye size={14} className="opacity-80" />
  {fmt(film.views)}
</span>

      </div>
      </Link>

    ))}
    
  </div>

</section>

{/*  main Discover More Stories */}
{/* Discover More Stories */}
<section className="bg-[#000000] text-white px-4 md:px-10 py-16 md:py-24 relative">
  <div className="text-2xl font-semibold mb-10 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <Link
  href="/stories"
  className="flex items-center gap-2 mb-10 group w-fit"
>
  <h2 className="text-2xl font-semibold text-gray-200">
    Explore Stories
  </h2>

  <ChevronRight
    size={22}
    className="text-gray-400 group-hover:translate-x-1.5 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
  />
</Link>
  </div>

  {/* Left Arrow */}
  <button
  onClick={scrollLeft}
  className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 items-center justify-center text-white hover:scale-110 hover:bg-white/20 transition-all duration-300 shadow-xl z-20"
>
  <ChevronLeft size={32} strokeWidth={2.5} />
</button>

  <button
  onClick={scrollRight}
  className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 items-center justify-center text-white hover:scale-110 hover:bg-white/20 transition-all duration-300 shadow-xl z-20"
>
  <ChevronRight size={32} strokeWidth={2.5} />
</button>

  {/* Scroll Container */}
  <div
  ref={scrollRef}
  className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar px-1"
>

  {stories.map((story, index) => (
    <Link key={story.id} href={`/stories/${story.id}`}>
      <div
        className="w-[42vw] sm:w-[160px] md:min-w-[220px] flex-shrink-0 group cursor-pointer opacity-0 will-change-transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-[1.01] animate-[apple-card-in_820ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
        style={{ animationDelay: `${140 + index * 45}ms` }}
      >

        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <img
            src={story.thumbnail_url}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
          />
        </div>

        <p className="mt-4 text-xs text-gray-200">
          {story.title}
        </p>

      </div>
    </Link>
  ))}

  {isLoadingContent &&
    storySkeletonItems.map((_, index) => (
      <div
        key={`explore-story-skeleton-${index}`}
        className="w-[42vw] sm:w-[160px] md:min-w-[220px] flex-shrink-0 animate-pulse"
      >
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        </div>
        <div className="mt-4 h-3 rounded bg-white/10" />
      </div>
    ))}

</div>

</section>

{/* Explore Short Films */}
<section className="bg-[#000000] text-white px-2 md:px-10 py-16 md:py-24 relative">

  <div className="text-2xl font-semibold mb-10 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
    <Link
  href="/shortfilms"
  className="flex items-center gap-2 mb-10 group w-fit"
>
  <h2 className="text-2xl font-semibold text-gray-200">
    Explore Shortfilms
  </h2>

  <ChevronRight
    size={22}
    className="text-gray-400 group-hover:translate-x-1.5 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
  />
</Link>
  </div>

  {/* Left Arrow */}
  <button
    onClick={scrollFilmLeft}
    className=" hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 
               w-12 h-12 rounded-full 
               bg-white/10 backdrop-blur-lg 
               border border-white/20 
               flex items-center justify-center 
               text-white 
               hover:scale-110 hover:bg-white/20 
               transition-all duration-300 
               shadow-xl z-20"
  >
    <ChevronLeft size={32} strokeWidth={2.5} />
  </button>

  {/* Right Arrow */}
  <button
    onClick={scrollFilmRight}
    className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 
               w-12 h-12 rounded-full 
               bg-white/10 backdrop-blur-lg 
               border border-white/20 
               flex items-center justify-center 
               text-white 
               hover:scale-110 hover:bg-white/20 
               transition-all duration-300 
               shadow-xl z-20"
  >
    <ChevronRight size={32} strokeWidth={2.5} />
  </button>

  {/* Scroll Container */}
  <div
  ref={filmScrollRef}
  onScroll={(e) => {
    const target = e.currentTarget
    setIsAtStart(target.scrollLeft === 0)
  }}
  className={`flex gap-4 md:gap-8 overflow-x-auto no-scrollbar transition-all duration-300 ${
    isAtStart ? "pl-5" : "pl-0"
  }`}
>

  {films.map((film, index) => (
    <Link key={film.id} href={`/shortfilms/${film.id}`}>
      <div
        className="min-w-[280px] md:min-w-[420px] group cursor-pointer opacity-0 will-change-transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:scale-[1.01] animate-[apple-card-in_820ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
        style={{ animationDelay: `${180 + index * 45}ms` }}
      >

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">

          <img
            src={film.thumbnail_url}
            alt={film.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
          />
          

          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500" />

        </div>

        <h3 className="mt-4 text-xs font-medium ">
          {film.title}
        </h3>

        <p className="text-sm text-gray-400 shadow-[0_10px_30px_rgba(0,0,0,0.4)">
          {film.creator_name ?? "Unknown creator"}
        </p>

      </div>
    </Link>
  ))}

  {isLoadingContent &&
    filmSkeletonItems.map((_, index) => (
      <div
        key={`explore-film-skeleton-${index}`}
        className="min-w-[280px] md:min-w-[420px] animate-pulse"
      >
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="mt-4 h-3 rounded bg-white/10" />
        <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
      </div>
    ))}

</div>

</section>

{/* Upload CTA Section */}

<section id="upload" className="bg-[#000000] text-white px-20 py-32 text-center">

  <h2 className="text-4xl font-semibold mb-6 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
    Have something That You think Good just Share it with us!
  </h2>

  <p className="text-gray-400 text-lg mb-14 opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_160ms_forwards]">
    Upload your story or short film and let imagination travel.
  </p>

  <Link href="/upload">
  <button className="flex flex-col items-center justify-center mx-auto group opacity-0 will-change-transform animate-[apple-card-in_820ms_cubic-bezier(0.16,1,0.3,1)_260ms_forwards]">

    <div className="w-16 h-16 
                    rounded-xl 
                    border border-white/20 
                    flex items-center justify-center 
                    text-3xl font-light 
                    transition-all duration-300
                    group-hover:scale-110 
                    group-hover:border-white 
                    bg-white/10
                    group-hover:bg-red-900">
      +
    </div>

    <span className="mt-4 text-sm text-gray-400 group-hover:text-white transition">
      Upload your story or idea
    </span>

  </button>
</Link>

</section>

{/* Search overlay */}
<AnimatePresence>
  {searchOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm md:backdrop-blur-md flex items-start justify-center pt-[18vh] px-4 overscroll-none"
      onClick={() => setSearchOpen(false)}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="w-full max-w-xl h-[78vh] max-h-[78vh] flex flex-col"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-white/20 pb-4 focus-within:border-white/50 transition-colors duration-200">
          <Search size={18} className="text-white/30 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, films, creators..."
            className="flex-1 bg-transparent text-white text-xl font-light placeholder:text-white/20 outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="text-white/30 hover:text-white/70 transition shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div
            className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y space-y-1 no-scrollbar"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-y",
              contain: "layout paint",
              transform: "translateZ(0)",
            }}
          >
            {results.map((item) => {
              const isStory = item.type === "story"

              return (
                <Link
                  key={item.id}
                  href={isStory ? `/stories/${item.id}` : `/shortfilms/${item.id}`}
                  onClick={() => setSearchOpen(false)}
                >
                  <div
                    className="flex items-center gap-4 px-2 py-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/6 transition group"
                    style={{ contentVisibility: "auto", containIntrinsicSize: "96px" }}
                  >
                    <div
                      className={`relative shrink-0 overflow-hidden rounded-lg bg-white/8 ${
                        isStory ? "w-[72px] aspect-[2/3]" : "w-[124px] aspect-video"
                      }`}
                    >
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title ?? "Content thumbnail"}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.18em] text-white/50">
                          {isStory ? "Story" : "Film"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-white/90 group-hover:text-white transition">{item.title}</p>
                      <p className="mt-1 text-[11px] text-white/35 capitalize">
                        {isStory ? "Story" : "Short Film"}
                      </p>
                    </div>

                    <ArrowRight size={14} className="ml-auto text-white/20 group-hover:text-white/50 transition" />
                  </div>
                </Link>
              )
            })}

            {results.length === SEARCH_RESULT_LIMIT && (
              <p className="px-2 pt-2 text-[11px] text-white/30">
                Showing top {SEARCH_RESULT_LIMIT} matches. Keep typing to narrow results.
              </p>
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <p className="text-center text-sm text-white/30 mt-8">No results for "{query}"</p>
        )}

        <p className="text-xs text-white/15 mt-6 text-right tracking-widest uppercase">esc to close</p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Footer */}
<footer id="about" className="bg-[#0d0d0d] text-white px-6 md:px-20 py-16 md:py-24 border-t border-white/5">
  <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">

    {/* Brand */}
    <div className="opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <h3 className="text-2xl font-semibold tracking-wide mb-6">
        IMAGI
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        A premium space where storytellers and filmmakers connect,
        collaborate and bring imagination to life.
      </p>

      {/* Social Icons */}
      <div className="flex gap-5 mt-6">
  {socialLinks.instagram ? (
    <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition">
      <Instagram className="w-5 h-5" />
    </a>
  ) : (
    <span aria-label="Instagram unavailable" className="text-gray-500 cursor-not-allowed">
      <Instagram className="w-5 h-5" />
    </span>
  )}

  {socialLinks.youtube ? (
    <a href={socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition">
      <Youtube className="w-5 h-5" />
    </a>
  ) : (
    <span aria-label="YouTube unavailable" className="text-gray-500 cursor-not-allowed">
      <Youtube className="w-5 h-5" />
    </span>
  )}

  {socialLinks.facebook ? (
    <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition">
      <Facebook className="w-5 h-5" />
    </a>
  ) : (
    <span aria-label="Facebook unavailable" className="text-gray-500 cursor-not-allowed">
      <Facebook className="w-5 h-5" />
    </span>
  )}

  {socialLinks.x ? (
    <a href={socialLinks.x} target="_blank" rel="noreferrer" aria-label="X" className="text-gray-400 hover:text-white transition">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2H21.5l-7.19 8.22L22.5 22h-6.6l-5.18-6.77L4.5 22H1.244l7.68-8.78L1.5 2h6.75l4.68 6.16L18.244 2z"/>
      </svg>
    </a>
  ) : (
    <span aria-label="X unavailable" className="text-gray-500 cursor-not-allowed">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2H21.5l-7.19 8.22L22.5 22h-6.6l-5.18-6.77L4.5 22H1.244l7.68-8.78L1.5 2h6.75l4.68 6.16L18.244 2z"/>
      </svg>
    </span>
  )}
</div>
    </div>

    {/* Explore */}
    <div className="opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_100ms_forwards]">
      <h4 className="text-sm font-semibold tracking-wider mb-6 text-gray-300">
        EXPLORE
      </h4>
      <ul className="space-y-4 text-sm text-gray-400">
        <li className="hover:text-white cursor-pointer transition">Stories</li>
        <li className="hover:text-white cursor-pointer transition">Short Films</li>
        <li className="hover:text-white cursor-pointer transition">Trending</li>
        <li className="hover:text-white cursor-pointer transition">Top Content</li>
      </ul>
    </div>

    {/* Creators */}
    <div className="opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_180ms_forwards]">
      <h4 className="text-sm font-semibold tracking-wider mb-6 text-gray-300">
        CREATORS
      </h4>
      <ul className="space-y-4 text-sm text-gray-400">
        <li className="hover:text-white cursor-pointer transition">Upload Content</li>
        <li className="hover:text-white cursor-pointer transition">Creator Guidelines</li>
        <li className="hover:text-white cursor-pointer transition">Community</li>
        <li className="hover:text-white cursor-pointer transition">Support</li>
      </ul>
    </div>

    {/* Company */}
    <div className="opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_260ms_forwards]">
      <h4 className="text-sm font-semibold tracking-wider mb-6 text-gray-300">
        COMPANY
      </h4>
      <ul className="space-y-4 text-sm text-gray-400">
        <li className="hover:text-white cursor-pointer transition">About Us</li>
        <li>
          {contactEmail ? (
            <a href={`mailto:${contactEmail}`} className="hover:text-white cursor-pointer transition">
              Contact
            </a>
          ) : (
            <span className="text-gray-500 cursor-not-allowed">Contact</span>
          )}
        </li>
        <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
        <li className="hover:text-white cursor-pointer transition">Terms of Service</li>
      </ul>
    </div>

  </div>

  {/* Bottom Strip */}
  <div className="max-w-7xl mx-auto mt-16 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 text-center md:text-left opacity-0 will-change-transform animate-[apple-fade-up_900ms_cubic-bezier(0.16,1,0.3,1)_320ms_forwards]">

    <span>
      © {new Date().getFullYear()} IMAGI. All rights reserved.
    </span>

    <span className="text-gray-600">
      Designed and Developed by SUMITH.
    </span>

  </div>

</footer>

    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#000000]" />}>
      <HomeContent />
    </Suspense>
  )
}