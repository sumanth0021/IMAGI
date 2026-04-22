// app/signup/page.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import BackButton from "@/components/BackButton"

const FALLBACK_IMAGE = "https://i.pinimg.com/736x/4f/c0/09/4fc00962e19608e4b97523e662444507.jpg"

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="1.8"/>
    <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function SignupPage() {
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState("")
  const [signupImage, setSignupImage] = useState(FALLBACK_IMAGE)

  // ─── Fetch dynamic image from Supabase ───
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "signup_image_url")
          .single()

        if (!error && data?.value) {
          setSignupImage(data.value)
        }
      } catch {
        // silently fall back to default image
      }
    }
    fetchImage()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setLoadingGoogle(true)
      setError("")
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch {
      setError("Something went wrong. Please try again.")
      setLoadingGoogle(false)
    }
  }

  const GoogleButton = ({ dark = false }: { dark?: boolean }) => (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loadingGoogle}
      className={`w-full flex items-center justify-center gap-3 font-semibold cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed ${
        dark ? "rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white" : ""
      }`}
      style={
        !dark
          ? { backgroundColor: "#fff", color: "#000", borderRadius: 50, height: 52, fontSize: 15 }
          : { borderRadius: 50, height: 52, fontSize: 15 }
      }
    >
      {loadingGoogle
        ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        : <GoogleIcon />
      }
      {loadingGoogle ? "Redirecting..." : "Continue with Google"}
    </button>
  )

  return (
    <>
      <div className="fixed left-4 top-4 md:left-10 pointer-events-auto" style={{ zIndex: 10010 }}>
        <BackButton
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur"
          fallbackPath="/"
          alwaysUseFallback
        />
      </div>

      {/* ─── MOBILE ─── */}
      <div className="lg:hidden min-h-screen bg-black text-white flex flex-col items-center justify-end pb-20">
        <div className="relative w-full mb-8 h-[65vh] min-h-[260px]">
          <Image
            src={signupImage}
            alt="Top background"
            fill
            className="object-cover"
            priority
            unoptimized={signupImage.startsWith("https://") && !signupImage.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")}
          />
          <div className="absolute inset-0 backdrop-blur-[.5px] bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-8 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-bold tracking-wide text-[42px] py-1 cursor-default"
            >
              IMAGI
            </motion.h1>
            <p className="text-white/50 mt-2 text-sm">Your journey starts from here</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs text-center mb-3 px-6">{error}</p>}

        <div className="w-full max-w-sm space-y-4 px-3">
          <GoogleButton dark={false} />
          <Link href="/signup/email" className="w-full flex items-center justify-center gap-3 text-white font-semibold"
            style={{ backgroundColor: "#1c1c1e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 50, height: 52, fontSize: 15 }}>
            <EmailIcon />
            Continue with Email
          </Link>
        </div>

        <div className="text-sm text-white/50 pt-3">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-medium hover:underline">Log in</Link>
        </div>

        <p className="text-center text-white/30 mt-5 px-10" style={{ fontSize: 11, lineHeight: 1.6 }}>
          By pressing on "Continue with..." you agree to our{" "}
          <Link href="#" className="underline text-white/50">Terms of Service</Link> and{" "}
          <Link href="#" className="underline text-white/50">Privacy Policy</Link>
        </p>
      </div>

      {/* ─── DESKTOP ─── */}
      <div className="hidden lg:flex relative min-h-screen bg-black text-white items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d12] shadow-[0_30px_120px_-60px_rgba(255,255,255,0.4)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] min-h-[500px]">
            <div className="relative h-full">
              <Image
                src={signupImage}
                alt="IMAGI"
                fill
                className="object-cover"
                priority
                unoptimized={signupImage.startsWith("https://") && !signupImage.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")}
              />
              
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-[0.6em] text-white/60">Welcome</div>
                <div>
                  <h2 className="text-4xl font-semibold tracking-wide">IMAGI</h2>
                  <p className="mt-3 text-sm text-white/60 max-w-sm">A premium space where storytellers and filmmakers connect, collaborate, and bring imagination to life.</p>
                </div>
                <div className="text-xs text-white/40">Be a part of our family by signing up</div>
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12 bg-black flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-wide">Sign Up</h1>
                <p className="mt-2 text-sm text-white/50">Create your account to get started.</p>
              </div>
              {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
              <div className="space-y-3 my-8">
                <GoogleButton dark={true} />
                <Link href="/signup/email" className="w-full rounded-full bg-white/10 text-white py-3 text-sm font-medium tracking-wide hover:bg-white/15 transition flex items-center justify-center gap-3">
                  <EmailIcon />
                  Continue with Email
                </Link>
              </div>
              <div className="text-sm text-white/50">
                Already have an account?{" "}
                <Link href="/login" className="text-white font-medium hover:underline">Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}