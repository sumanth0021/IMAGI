// components/HeroSection.tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

type HeroContent = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string
  cta_text: string | null
  cta_link: string | null
  is_active: boolean
}

// ── Easing ────────────────────────────────────────────────────────────────────

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const easeOut: [number, number, number, number] = [0.0, 0.0, 0.2, 1]

// ── Variants ──────────────────────────────────────────────────────────────────

const bgVariants = {
  enter: {
    opacity: 0,
    scale: 1.06,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 1.25, ease: easeOut },
      scale:   { duration: 9.0, ease: easeOut },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      opacity: { duration: 0.8, ease: easeOut },
      scale:   { duration: 0.8, ease: easeOut },
    },
  },
}

const overlayVariants = {
  enter:   { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.35, ease: easeOut } },
  exit:    { opacity: 0, transition: { duration: 0.6, ease: easeOut } },
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.45,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.25,
      ease,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(2px)",
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

const ctaVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.35, ease, delay: 0.18 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.42, ease: easeOut },
  },
}

const dotContainerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease, delay: 0.75 },
  },
}

// ── Fallback ───────────────────────────────────────────────────────────────────

function DefaultHero() {
  return (
    <section className="relative h-[60svh] md:h-[65vh] overflow-hidden bg-black">
      {/* Subtle radial glow — Apple uses these on dark hero pages */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 70%), #000",
        }}
      />
      {/* Noise grain overlay — Apple's signature texture on dark surfaces */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <motion.div
        className="absolute inset-0 flex items-end md:items-center pb-28 md:pb-0"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="w-full max-w-[640px] px-7 md:px-20 text-white">
          <motion.p
            variants={itemVariants}
            className="text-[10px] uppercase tracking-[0.55em] text-white/35 font-medium mb-6"
            style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.55em" }}
          >
            Welcome to
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="text-[52px] sm:text-[64px] md:text-[80px] font-semibold leading-[0.96] tracking-[-0.035em]"
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            IMAGI
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-[15px] md:text-[17px] text-white/50 max-w-[380px] leading-[1.65] font-light"
            style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            A premium space where storytellers and filmmakers connect,
            collaborate, and bring imagination to life.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <section className="relative h-[60svh] md:h-[65vh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-end md:items-center pb-32 md:pb-0">
        <div className="w-full max-w-[640px] px-7 md:px-20 space-y-5">
          <div className="h-[10px] w-24 rounded-full bg-white/[0.08] animate-pulse" />
          <div className="h-[56px] w-[55%] rounded-xl bg-white/[0.07] animate-pulse" />
          <div className="h-[17px] w-[45%] rounded-full bg-white/[0.05] animate-pulse mt-1" />
          <div className="h-[17px] w-[36%] rounded-full bg-white/[0.035] animate-pulse" />
          <div className="h-[44px] w-[140px] rounded-full bg-white/[0.05] animate-pulse mt-3" />
        </div>
      </div>
    </section>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [heroes, setHeroes]   = useState<HeroContent[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("hero_content")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
      setHeroes((data as HeroContent[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Auto-advance
  useEffect(() => {
    if (heroes.length <= 1) return
    const t = setInterval(() => setCurrent(p => (p + 1) % heroes.length), 7000)
    return () => clearInterval(t)
  }, [heroes.length])

  if (loading)        return <HeroSkeleton />
  if (!heroes.length) return <DefaultHero />

  const hero = heroes[current]

  return (
    <section
      className="relative h-[80svh] md:h-[85vh] overflow-hidden bg-black"
      style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >

      {/* ── Background image ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`bg-${hero.id}`}
          className="absolute inset-0"
          variants={bgVariants}
          initial="enter"
          animate="visible"
          exit="exit"
        >
          <Image
            src={hero.image_url}
            alt={hero.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Overlays ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`overlay-${hero.id}`}
          className="absolute inset-0 pointer-events-none"
          variants={overlayVariants}
          initial="enter"
          animate="visible"
          exit="exit"
        >
          {/* Apple-style: deep left vignette for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.12) 65%, transparent 100%)",
            }}
          />
          {/* Bottom vignette — pulls viewer's eye up */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 28%, transparent 55%)",
            }}
          />
          {/* Very subtle top edge */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 18%)",
            }}
          />
          {/* Noise grain — Apple's dark hero texture signature */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Text content ── */}
      <div className="absolute inset-0 flex items-end md:items-center pb-28 md:pb-0">
        <div className="w-full max-w-[640px] px-7 md:px-20 text-white">

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`text-${hero.id}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* Eyebrow / Subtitle — Apple's ultra-tight tracking label */}
              {hero.subtitle && (
                <motion.p
                  variants={itemVariants}
                  className="text-[10px] uppercase text-white/38 font-medium mb-6"
                  style={{
                    letterSpacing: "0.55em",
                    fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {hero.subtitle}
                </motion.p>
              )}

              {/* Title — Apple display scale */}
              <motion.h1
                variants={itemVariants}
                className="text-[46px] sm:text-[58px] md:text-[76px] font-semibold leading-[0.96] tracking-[-0.035em] text-white"
                style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                {hero.title}
              </motion.h1>

              {/* Description — Apple body copy style */}
              {hero.description && (
                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-[15px] md:text-[17px] text-white/52 max-w-[390px] leading-[1.65] font-light"
                  style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {hero.description}
                </motion.p>
              )}

              {/* CTA — Apple pill button, dual variant */}
              {hero.cta_text && hero.cta_link && (
                <motion.div variants={ctaVariants} className="mt-7 flex items-center gap-4">
                  {/* Primary pill — frosted white */}
                  <Link
                    href={hero.cta_link}
                    className="group relative inline-flex items-center gap-[7px] px-[22px] py-[11px] rounded-full text-black text-[13px] font-medium transition-all duration-300 hover:scale-[1.025] active:scale-[0.975]"
                    style={{
                      background: "rgba(255,255,255,0.96)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      letterSpacing: "-0.01em",
                      fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                      boxShadow: "0 0 0 0.5px rgba(255,255,255,0.18) inset",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,1)"
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.96)"
                    }}
                  >
                    {hero.cta_text}
                    {/* <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-[2px]"
                      stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M1.5 6h9M7 2.5l3.5 3.5-3.5 3.5" />
                    </svg> */}
                  </Link>

                  {/* Ghost secondary — Apple often pairs a ghost CTA
                  <Link
                    href={hero.cta_link}
                    className="inline-flex items-center gap-[5px] text-[13px] font-medium text-white/70 transition-all duration-200 hover:text-white/95 group"
                    style={{
                      letterSpacing: "-0.01em",
                      fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                  >
                    Learn more
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-[2px]"
                      stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M1.5 6h9M7 2.5l3.5 3.5-3.5 3.5" />
                    </svg>
                  </Link> */}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Dot indicators — refined Apple-style progress pills ── */}
          {heroes.length > 1 && (
            <motion.div
              className="flex items-center gap-[6px] mt-12"
              variants={dotContainerVariants}
              initial="hidden"
              animate="show"
            >
              {heroes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width:  i === current ? "20px" : "5px",
                    height: "5px",
                    background: i === current
                      ? "rgba(255,255,255,0.88)"
                      : "rgba(255,255,255,0.22)",
                    boxShadow: i === current
                      ? "0 0 8px rgba(255,255,255,0.22)"
                      : "none",
                  }}
                  aria-label={`Go to hero ${i + 1}`}
                />
              ))}
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Scroll hint — Apple's subtle bottom affordance ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[6px]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1, ease: easeOut }}
      >
        <span
          className="text-[10px] text-white/25 uppercase tracking-[0.42em]"
          style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-6 bg-white/20 origin-top rounded-full"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

    </section>
  )
}