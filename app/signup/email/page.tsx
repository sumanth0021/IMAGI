// app/signup/email/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

// ── Toast component ──


function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [leaving, setLeaving] = useState(false)

  const handleClose = () => {
    setLeaving(true)
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    const timer = setTimeout(handleClose, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed top-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:w-auto z-50 flex justify-center ${
        leaving ? "animate-toast-out-mobile" : "animate-toast-in-mobile"
      }`}
    >
      <div
        className="w-full sm:w-auto text-white text-sm px-5 py-3.5 rounded-2xl text-center sm:text-left sm:whitespace-nowrap"
        style={{
          background: "rgba(50, 50, 52, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {message}
      </div>
    </div>
  )
}

export default function EmailSignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState("")

  const showToast = (message: string) => setToast(message)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
      },
    })

    if (signUpError) {
      if (
        signUpError.message.toLowerCase().includes("disabled") ||
        signUpError.message.toLowerCase().includes("not enabled")
      ) {
        showToast("Email signup is disabled by devoloper for now . Please use Continue with Google.")
      } else {
        showToast(signUpError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (signInError) {
        showToast(signInError.message)
        setLoading(false)
        return
      }

      await supabase.from("users").upsert({
        id: data.user.id,
        name: form.name,
        email: form.email,
        avatar_url: null,
      }, { onConflict: "id" })

      window.location.href = "/profile"
    } else {
      showToast("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="w-full max-w-md">
        <div className="mb-10">
          <Link href="/signup" className="text-white/40 text-sm hover:text-white transition">← Back</Link>
          <h1 className="text-2xl font-semibold tracking-wide mt-6">Create Account</h1>
          <p className="mt-2 text-sm text-white/50">Sign up with your email address.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/50">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full bg-transparent border-b border-white/20 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white text-black py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <div className="mt-8 text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}