// app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import BackButton from "@/components/BackButton";

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoadingGoogle(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/profile")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4 md:px-10 z-20">
  <BackButton className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur border border-white/10" />
</div>
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d12] shadow-[0_30px_120px_-60px_rgba(255,255,255,0.4)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

          {/* Left panel */}
          <div className="relative hidden lg:block">
            <Image src="https://i.pinimg.com/736x/4f/c0/09/4fc00962e19608e4b97523e662444507.jpg" alt="IMAGI" fill className="object-cover" priority/>
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 h-full p-10 flex flex-col justify-between">
              <div className="text-xs uppercase tracking-[0.6em] text-white/60">Welcome</div>
              <div>
                <h2 className="text-4xl font-semibold tracking-wide">IMAGI</h2>
                <p className="mt-3 text-sm text-white/60 max-w-sm">A premium space where storytellers and filmmakers connect, collaborate, and bring imagination to life.</p>
              </div>
              <div className="text-xs text-white/40">Be a part of our family by logging in</div>
            </div>
          </div>

          {/* Right panel */}
          <div className="p-8 sm:p-10 lg:p-12 bg-black">
            <div className="mb-10">
              <h1 className="text-2xl font-semibold tracking-wide">Login</h1>
              <p className="mt-2 text-sm text-white/50">Sign in to continue your journey.</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full rounded-full border border-white/20 bg-white/5 py-3 text-sm font-medium tracking-wide hover:bg-white/10 transition flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loadingGoogle
                ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                : <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              }
              {loadingGoogle ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="my-8 flex items-center gap-3 text-xs text-white/40">
              <span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" />
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                <input type="email" required placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="mt-2 w-full bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition"/>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">Password</label>
                <div className="relative mt-2">
                  <input type={showPassword ? "text" : "password"} required placeholder="********" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-2 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white transition">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <Link href="#" className="text-xs text-white/40 hover:text-white">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-white text-black py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="mt-8 text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white font-medium hover:underline">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
