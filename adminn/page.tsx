"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useRef, type ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Trash2, Star, Eye, Heart, Film, BookOpen, ShieldAlert,
  X, ChevronRight, Loader2, LayoutGrid, List, Lock,
  Plus, Pencil, EyeOff, Check, ImageIcon, MonitorPlay, Mail,
} from "lucide-react"
import { getSupabase } from "@/lib/supabase"

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ""
const FALLBACK_SIGNUP_IMAGE = "https://i.pinimg.com/736x/4f/c0/09/4fc00962e19608e4b97523e662444507.jpg"

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "story" | "film"

interface ContentItem {
  id: string
  title: string
  type: ContentType
  thumbnail_url: string
  views: number
  likes: number
  rank: number | null
  creator_name?: string
}

type Hero = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string
  cta_text: string | null
  cta_link: string | null
  is_active: boolean
  created_at: string
}

type HeroForm = {
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  is_active: boolean
}

const emptyHeroForm: HeroForm = {
  title: "", subtitle: "", description: "",
  cta_text: "", cta_link: "", is_active: true,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0)

function logSupabaseError(scope: string, error: unknown) {
  if (!error || typeof error !== "object") { console.error(`${scope} error:`, error); return }
  const e = error as { name?: string; message?: string; code?: string; details?: string; hint?: string }
  console.error(`${scope} error:`, { name: e.name ?? "UnknownError", message: e.message ?? "No message", code: e.code ?? "", details: e.details ?? "", hint: e.hint ?? "" })
}

// ─── Login Gate ───────────────────────────────────────────────────────────────

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { data, error: authError } = await getSupabase().auth.signInWithPassword({ email, password })
    if (authError || !data.user) { setError(authError?.message ?? "Sign-in failed."); setLoading(false); return }
    if (data.user.email !== ADMIN_EMAIL) { await getSupabase().auth.signOut(); setError("Access denied."); setLoading(false); return }
    setLoading(false)
    onSuccess()
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-9">
          <p className="text-xs font-mono tracking-[0.2em] text-white/20 uppercase mb-1">IMAGI</p>
          <h1 className="text-2xl font-semibold text-white/90 mb-1">Admin Panel</h1>
          <p className="text-sm text-white/30 mb-8">Restricted access only</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/30 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" required placeholder="admin@example.com"
                className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-white/25 transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/30 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" required placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/15 outline-none focus:border-white/25 transition" />
            </div>
            {error && <p className="text-xs text-red-400/90 text-center -mt-1">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white text-[#0a0a0a] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-60 transition mt-1">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={14} />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

// ─── AdminCard ────────────────────────────────────────────────────────────────

interface AdminCardProps {
  item: ContentItem
  onDelete: (id: string) => void
  onRank: (item: ContentItem) => void
  view: "grid" | "list"
}

function AdminCard({ item, onDelete, onRank, view }: AdminCardProps) {
  const router = useRouter()
  const navigate = () => router.push(item.type === "story" ? `/stories/${item.id}` : `/shortfilms/${item.id}`)

  if (view === "list") {
    return (
      <div onClick={navigate}
        className="group flex items-center gap-4 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.13] cursor-pointer transition-all duration-200">
        <Image src={item.thumbnail_url ?? ""} alt={item.title} width={64} height={44}
          className="w-16 h-11 object-cover rounded-lg shrink-0 opacity-90 group-hover:opacity-100 transition" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/90 truncate">{item.title}</p>
          <p className="text-xs text-white/35 mt-0.5">{item.creator_name ?? "—"}</p>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-white/40">
          <span className="flex items-center gap-1.5"><Eye size={12} /> {fmt(item.views)}</span>
          <span className="flex items-center gap-1.5"><Heart size={12} /> {fmt(item.likes)}</span>
          {item.rank !== null
            ? <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400/90 border border-amber-400/20">#{item.rank}</span>
            : <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/20 border border-white/[0.08]">—</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onRank(item) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-amber-500/15 hover:border-amber-400/30 hover:text-amber-400 transition-all duration-150">
            <Star size={12} /> Rank
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-red-500/15 hover:border-red-400/30 hover:text-red-400 transition-all duration-150">
            <Trash2 size={12} />
          </button>
        </div>
        <ChevronRight size={14} className="text-white/15 group-hover:text-white/30 transition shrink-0" />
      </div>
    )
  }

  return (
    <div onClick={navigate}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.13] cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-video overflow-hidden">
        <Image src={item.thumbnail_url ?? ""} alt={item.title} width={400} height={225}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {item.rank !== null && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-400 text-xs font-mono font-medium backdrop-blur-sm">
            #{item.rank}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-white/90 truncate mb-0.5">{item.title}</p>
        <p className="text-xs text-white/35 mb-3">{item.creator_name ?? "—"}</p>
        <div className="flex items-center gap-4 text-xs font-mono text-white/35 mb-4">
          <span className="flex items-center gap-1"><Eye size={11} /> {fmt(item.views)}</span>
          <span className="flex items-center gap-1"><Heart size={11} /> {fmt(item.likes)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onRank(item) }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-amber-500/15 hover:border-amber-400/30 hover:text-amber-400 transition-all duration-150">
            <Star size={12} /> Set Rank
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
            className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-red-500/15 hover:border-red-400/30 hover:text-red-400 transition-all duration-150">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ label, icon, items, onDelete, onRank, view }: {
  label: string; icon: ReactNode; items: ContentItem[]
  onDelete: (id: string) => void; onRank: (item: ContentItem) => void; view: "grid" | "list"
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-white/30">{icon}</span>
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-white/50">{label}</h2>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.08] text-xs font-mono text-white/30">{items.length}</span>
        <div className="flex-1 h-px bg-white/5 ml-2" />
      </div>
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-28 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-white/20 text-sm">No content yet</div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => <AdminCard key={item.id} item={item} onDelete={onDelete} onRank={onRank} view="grid" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => <AdminCard key={item.id} item={item} onDelete={onDelete} onRank={onRank} view="list" />)}
        </div>
      )}
    </section>
  )
}

// ─── Rank Modal ───────────────────────────────────────────────────────────────

function RankModal({ item, allItems, onClose, onConfirm }: {
  item: ContentItem | null; allItems: ContentItem[]
  onClose: () => void; onConfirm: (id: string, rank: number | null) => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  if (!item) return null

  const takenRanks = new Set(allItems.filter((i) => i.id !== item.id && i.type === item.type && i.rank !== null).map((i) => i.rank as number))
  const holderOf = (n: number) => allItems.find((i) => i.id !== item.id && i.type === item.type && i.rank === n)

  const handleSelect = async (rank: number | null) => {
    if (rank === item.rank) { onClose(); return }
    setConfirming(true)
    await onConfirm(item.id, rank)
    setConfirming(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-[340px] rounded-2xl bg-[#131313] border border-white/[0.09] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="min-w-0 pr-3">
            <h3 className="text-sm font-semibold text-white/90">Set Rank</h3>
            <p className="text-xs text-white/35 mt-0.5 truncate">{item.title}</p>
          </div>
          <button onClick={onClose} className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 text-white/30 hover:text-white/70 hover:bg-white/10 transition">
            <X size={14} />
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4 text-[10px] text-white/30">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-amber-500/25 border border-amber-400/40" />Current</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-white/5 border border-white/10" />Available</span>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const isCurrent = item.rank === n
            const isTaken = takenRanks.has(n)
            const holder = holderOf(n)
            return (
              <button key={n} disabled={confirming} title={isTaken ? `Will replace: ${holder?.title ?? "another item"}` : undefined}
                onClick={() => handleSelect(n)}
                className={["relative aspect-square rounded-xl text-sm font-mono font-semibold border transition-all duration-150 select-none",
                  isCurrent ? "bg-amber-500/20 border-amber-400/40 text-amber-400 ring-1 ring-amber-400/20"
                  : isTaken ? "bg-white/[0.04] border-white/[0.08] text-white/40 hover:bg-orange-500/12 hover:border-orange-400/30 hover:text-orange-300 cursor-pointer active:scale-95"
                  : "bg-white/[0.04] border-white/[0.08] text-white/55 hover:bg-amber-500/12 hover:border-amber-400/30 hover:text-amber-400 cursor-pointer active:scale-95",
                ].join(" ")}>
                {n}
                {isTaken && !isCurrent && <span className="absolute top-[3px] right-[3px] w-1.5 h-1.5 rounded-full bg-white/25" />}
              </button>
            )
          })}
        </div>
        <button disabled={confirming} onClick={() => handleSelect(null)}
          className={["w-full py-2 rounded-xl text-xs font-medium border transition-all duration-150",
            item.rank === null ? "bg-white/10 border-white/20 text-white/80" : "bg-white/[0.04] border-white/[0.08] text-white/35 hover:bg-white/[0.08] hover:text-white/60",
          ].join(" ")}>
          None — Remove rank
        </button>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[11px] text-white/20">Current: {item.rank !== null ? `#${item.rank}` : "unranked"}</p>
          {confirming && <div className="flex items-center gap-1.5 text-[11px] text-white/30"><Loader2 size={11} className="animate-spin" /> Saving…</div>}
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({ itemId, onClose, onConfirm, isDeleting }: {
  itemId: string | null; onClose: () => void; onConfirm: (id: string) => void; isDeleting: boolean
}) {
  if (!itemId) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl bg-[#111] border border-white/10 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
          <ShieldAlert size={20} className="text-red-400" />
        </div>
        <h3 className="text-sm font-semibold text-white/90 text-center mb-1">Delete content?</h3>
        <p className="text-xs text-white/35 text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition">Cancel</button>
          <button onClick={() => onConfirm(itemId)} disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-red-500/15 border border-red-400/25 text-red-400 hover:bg-red-500/25 hover:border-red-400/40 disabled:opacity-50 transition">
            {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ content }: { content: ContentItem[] }) {
  const totalViews = content.reduce((s, i) => s + (i.views ?? 0), 0)
  const totalLikes = content.reduce((s, i) => s + (i.likes ?? 0), 0)
  const ranked = content.filter((i) => i.rank !== null).length
  const stats = [
    { label: "Total Items", value: content.length, mono: false },
    { label: "Total Views", value: fmt(totalViews), mono: true },
    { label: "Total Likes", value: fmt(totalLikes), mono: true },
    { label: "Ranked", value: ranked, mono: true },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
      {stats.map((s) => (
        <div key={s.label} className="px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          <p className="text-xs text-white/30 mb-1.5 tracking-wide uppercase">{s.label}</p>
          <p className={`text-2xl font-semibold text-white/85 ${s.mono ? "font-mono" : ""}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Signup Image Manager ─────────────────────────────────────────────────────

function SignupImageManager() {
  const [currentImage, setCurrentImage] = useState<string>(FALLBACK_SIGNUP_IMAGE)
  const [imageFile, setImageFile]       = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving]             = useState(false)
  const [resetting, setResetting]       = useState(false)
  const [fetching, setFetching]         = useState(true)
  const [toast, setToast]               = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await getSupabase()
        .from("site_settings")
        .select("value")
        .eq("key", "signup_image_url")
        .single()
      if (data?.value) setCurrentImage(data.value)
      setFetching(false)
    }
    fetchImage()
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    if (!imageFile) return
    setSaving(true)
    try {
      const ext = imageFile.name.split(".").pop()
      const path = `signup/signup-image-${Date.now()}.${ext}`
      const { error: uploadError } = await getSupabase().storage
        .from("content")
        .upload(path, imageFile, { upsert: true })
      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`)

      const { data: urlData } = getSupabase().storage.from("content").getPublicUrl(path)

      const { error: upsertError } = await getSupabase()
        .from("site_settings")
        .upsert({ key: "signup_image_url", value: urlData.publicUrl }, { onConflict: "key" })
      if (upsertError) throw new Error(`site_settings upsert failed: ${upsertError.message}`)

      setCurrentImage(urlData.publicUrl)
      setImageFile(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ""
      showToast("Signup image updated!")
    } catch (err: unknown) {
      logSupabaseError("SignupImageManager.handleSave", err)
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message?: unknown }).message ?? "Upload failed.")
            : "Upload failed."
      showToast(message, "error")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("Reset to the default image?")) return
    setResetting(true)
    try {
      await getSupabase()
        .from("site_settings")
        .upsert({ key: "signup_image_url", value: FALLBACK_SIGNUP_IMAGE }, { onConflict: "key" })
      setCurrentImage(FALLBACK_SIGNUP_IMAGE)
      setImageFile(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ""
      showToast("Reset to default image.")
    } catch {
      showToast("Reset failed.", "error")
    } finally {
      setResetting(false)
    }
  }

  const cancelPreview = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-white/30"><MonitorPlay size={16} /></span>
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-white/50">Signup Page Image</h2>
        <div className="flex-1 h-px bg-white/5 ml-2" />
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-start">

        {/* Thumbnail preview */}
        <div className="shrink-0 space-y-2">
          <p className="text-[11px] uppercase tracking-widest text-white/30">
            {imagePreview ? "Preview" : "Current"}
          </p>
          <div className="relative w-40 h-56 rounded-2xl overflow-hidden border border-white/[0.09] bg-white/5">
            {fetching ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-white/20" />
              </div>
            ) : (
              <>
                <Image
                  src={imagePreview ?? currentImage}
                  alt="Signup image"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {imagePreview && (
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] bg-amber-400/80 text-black px-1.5 py-0.5 rounded-full font-semibold">Unsaved</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <p className="text-xs text-white/35 mb-3 leading-relaxed">
              This image appears as the background on the signup page — on both mobile and desktop.
            </p>

            {/* Upload area */}
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 py-3.5 cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Plus size={15} className="text-white/40" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white/60 truncate">
                  {imageFile ? imageFile.name : "Click to choose a new image"}
                </p>
                <p className="text-xs text-white/25 mt-0.5">JPG · PNG · WEBP recommended</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={!imageFile || saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#0a0a0a] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? "Saving…" : "Save Image"}
            </button>

            {imageFile && (
              <button
                onClick={cancelPreview}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60 transition"
              >
                <X size={14} /> Cancel
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={resetting || currentImage === FALLBACK_SIGNUP_IMAGE}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:bg-red-500/10 hover:border-red-400/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              {resetting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {resetting ? "Resetting…" : "Reset to Default"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm"
          style={{
            background: toast.type === "success" ? "rgba(5,15,5,0.97)" : "rgba(20,5,5,0.97)",
            backdropFilter: "blur(24px)",
            border: toast.type === "success" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            animation: "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
          <span style={{ color: toast.type === "success" ? "#86efac" : "#fca5a5" }}>{toast.message}</span>
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}
    </div>
  )
}

// ─── Contact Settings Manager ───────────────────────────────────────────────

function ContactSettingsManager() {
  const [contactEmail, setContactEmail] = useState("")
  const [instagramUrl, setInstagramUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [xUrl, setXUrl] = useState("")
  const [initialValues, setInitialValues] = useState({
    contactEmail: "",
    instagramUrl: "",
    youtubeUrl: "",
    facebookUrl: "",
    xUrl: "",
  })
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 transition"

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await getSupabase()
          .from("site_settings")
          .select("key, value")
          .in("key", ["contact_email", "social_instagram_url", "social_youtube_url", "social_facebook_url", "social_x_url"])

        if (error) {
          throw new Error(`Failed to load contact settings: ${error.message}`)
        }

        const map = new Map((data ?? []).map((row) => [row.key, typeof row.value === "string" ? row.value : ""]))

        const email = map.get("contact_email") ?? ""
        const instagram = map.get("social_instagram_url") ?? ""
        const youtube = map.get("social_youtube_url") ?? ""
        const facebook = map.get("social_facebook_url") ?? ""
        const x = map.get("social_x_url") ?? ""

        setContactEmail(email)
        setInstagramUrl(instagram)
        setYoutubeUrl(youtube)
        setFacebookUrl(facebook)
        setXUrl(x)
        setInitialValues({
          contactEmail: email,
          instagramUrl: instagram,
          youtubeUrl: youtube,
          facebookUrl: facebook,
          xUrl: x,
        })
      } catch (err: unknown) {
        logSupabaseError("ContactSettingsManager.fetchSettings", err)
        showToast("Unable to load contact settings.", "error")
      } finally {
        setFetching(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const nextEmail = contactEmail.trim()
      const nextInstagram = instagramUrl.trim()
      const nextYoutube = youtubeUrl.trim()
      const nextFacebook = facebookUrl.trim()
      const nextX = xUrl.trim()

      const { error } = await getSupabase()
        .from("site_settings")
        .upsert([
          { key: "contact_email", value: nextEmail },
          { key: "social_instagram_url", value: nextInstagram },
          { key: "social_youtube_url", value: nextYoutube },
          { key: "social_facebook_url", value: nextFacebook },
          { key: "social_x_url", value: nextX },
        ], { onConflict: "key" })

      if (error) {
        throw new Error(`Failed to save contact settings: ${error.message}`)
      }

      setInitialValues({
        contactEmail: nextEmail,
        instagramUrl: nextInstagram,
        youtubeUrl: nextYoutube,
        facebookUrl: nextFacebook,
        xUrl: nextX,
      })
      showToast("Contact and social links updated!")
    } catch (err: unknown) {
      logSupabaseError("ContactSettingsManager.handleSave", err)
      const message = err instanceof Error ? err.message : "Failed to save contact settings."
      showToast(message, "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-white/30"><Mail size={16} /></span>
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-white/50">Contact Settings</h2>
        <div className="flex-1 h-px bg-white/5 ml-2" />
      </div>

      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 space-y-5">
        <p className="text-xs text-white/35 leading-relaxed">
          These values are used in the public footer contact and social links.
        </p>

        <div>
          <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
            Contact Email
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@imagi.com"
              className={`${inputCls} pl-10`}
              disabled={fetching}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
              Instagram URL
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className={inputCls}
              disabled={fetching}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
              YouTube URL
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className={inputCls}
              disabled={fetching}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
              Facebook URL
            </label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className={inputCls}
              disabled={fetching}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
              X URL
            </label>
            <input
              type="url"
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              placeholder="https://x.com/yourhandle"
              className={inputCls}
              disabled={fetching}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={fetching || saving || (
              contactEmail.trim() === initialValues.contactEmail
              && instagramUrl.trim() === initialValues.instagramUrl
              && youtubeUrl.trim() === initialValues.youtubeUrl
              && facebookUrl.trim() === initialValues.facebookUrl
              && xUrl.trim() === initialValues.xUrl
            )}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#0a0a0a] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Saving…" : "Save Contact & Social Links"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm"
          style={{
            background: toast.type === "success" ? "rgba(5,15,5,0.97)" : "rgba(20,5,5,0.97)",
            backdropFilter: "blur(24px)",
            border: toast.type === "success" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            animation: "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
          <span style={{ color: toast.type === "success" ? "#86efac" : "#fca5a5" }}>{toast.message}</span>
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}
    </div>
  )
}

// ─── Hero Manager ─────────────────────────────────────────────────────────────

function HeroManager() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroSaving, setHeroSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<HeroForm>(emptyHeroForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [heroToast, setHeroToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showHeroToast = (message: string, type: "success" | "error" = "success") => {
    setHeroToast({ message, type })
    setTimeout(() => setHeroToast(null), 3500)
  }

  const fetchHeroes = async () => {
    setHeroLoading(true)
    const { data } = await getSupabase().from("hero_content").select("*").order("created_at", { ascending: false })
    setHeroes((data as Hero[]) ?? [])
    setHeroLoading(false)
  }

  useEffect(() => { fetchHeroes() }, [])

  const resetForm = () => {
    setForm(emptyHeroForm)
    setImageFile(null)
    setImagePreview(null)
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (hero: Hero) => {
    setForm({ title: hero.title, subtitle: hero.subtitle ?? "", description: hero.description ?? "", cta_text: hero.cta_text ?? "", cta_link: hero.cta_link ?? "", is_active: hero.is_active })
    setImagePreview(hero.image_url)
    setImageFile(null)
    setEditingId(hero.id)
    setShowForm(true)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop()
    const path = `hero/${Date.now()}.${ext}`
    const { error } = await getSupabase().storage.from("content").upload(path, file, { upsert: true })
    if (error) return null
    const { data } = getSupabase().storage.from("content").getPublicUrl(path)
    return data.publicUrl
  }

  const handleSave = async () => {
    if (!form.title.trim()) { showHeroToast("Title is required", "error"); return }
    if (!editingId && !imageFile) { showHeroToast("Image is required", "error"); return }
    setHeroSaving(true)
    let image_url = imagePreview ?? ""
    if (imageFile) {
      const url = await uploadImage(imageFile)
      if (!url) { showHeroToast("Image upload failed", "error"); setHeroSaving(false); return }
      image_url = url
    }
    const payload = { title: form.title, subtitle: form.subtitle || null, description: form.description || null, image_url, cta_text: form.cta_text || null, cta_link: form.cta_link || null, is_active: form.is_active }
    if (editingId) {
      const { error } = await getSupabase().from("hero_content").update(payload).eq("id", editingId)
      if (error) { showHeroToast("Update failed: " + error.message, "error"); setHeroSaving(false); return }
      showHeroToast("Hero updated!")
    } else {
      const { error } = await getSupabase().from("hero_content").insert(payload)
      if (error) { showHeroToast("Save failed: " + error.message, "error"); setHeroSaving(false); return }
      showHeroToast("Hero added!")
    }
    setHeroSaving(false)
    resetForm()
    fetchHeroes()
  }

  const handleDeleteHero = async (id: string) => {
    if (!confirm("Delete this hero?")) return
    await getSupabase().from("hero_content").delete().eq("id", id)
    showHeroToast("Hero deleted")
    fetchHeroes()
  }

  const toggleActive = async (hero: Hero) => {
    await getSupabase().from("hero_content").update({ is_active: !hero.is_active }).eq("id", hero.id)
    fetchHeroes()
  }

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 transition"

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-white/30"><ImageIcon size={16} /></span>
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-white/50">Hero Management</h2>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.08] text-xs font-mono text-white/30">{heroes.length}</span>
        <div className="flex-1 h-px bg-white/5 ml-2" />
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white text-[#0a0a0a] font-semibold hover:bg-white/90 transition">
            <Plus size={13} /> Add Hero
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">{editingId ? "Edit Hero" : "New Hero"}</h3>
            <button onClick={resetForm} className="text-white/30 hover:text-white/60 transition"><X size={18} /></button>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">Background Image <span className="text-red-400">*</span></label>
            <div onClick={() => fileRef.current?.click()}
              className="relative cursor-pointer rounded-2xl overflow-hidden border border-dashed border-white/10 hover:border-white/25 transition flex items-center justify-center"
              style={{ aspectRatio: "16/6" }}>
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="600px" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <span className="text-sm font-medium text-white">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/25 py-10">
                  <Plus size={28} />
                  <p className="text-sm">Upload hero image</p>
                  <p className="text-xs text-white/15">JPG · PNG · WEBP</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)) } }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">Title <span className="text-red-400">*</span></label>
              <input className={inputCls} placeholder="Hero title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">Subtitle</label>
              <input className={inputCls} placeholder="Optional subtitle" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">Description</label>
            <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Short description shown under the title"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">CTA Button Text</label>
              <input className={inputCls} placeholder="e.g. Explore Stories" value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">CTA Button Link</label>
              <input className={inputCls} placeholder="/go/home-hero" value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: form.is_active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.1)" }}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#0a0a0a] transition-transform"
                style={{ transform: form.is_active ? "translateX(20px)" : "translateX(0)" }} />
            </button>
            <span className="text-sm text-white/50">{form.is_active ? "Active — visible on homepage" : "Inactive — hidden from homepage"}</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={heroSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#0a0a0a] hover:bg-white/90 disabled:opacity-50 transition">
              {heroSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {heroSaving ? "Saving…" : editingId ? "Update Hero" : "Save Hero"}
            </button>
            <button onClick={resetForm}
              className="px-5 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hero list */}
      {heroLoading ? (
        <div className="flex items-center gap-3 text-white/25 text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading heroes…
        </div>
      ) : heroes.length === 0 ? (
        <div className="flex items-center justify-center h-28 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-white/20 text-sm">
          No heroes yet. Add one above.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {heroes.map(hero => (
            <div key={hero.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition">
              <div className="relative w-24 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5">
                <Image src={hero.image_url} alt={hero.title} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white/90 truncate">{hero.title}</p>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${hero.is_active ? "bg-green-500/15 text-green-400 border border-green-400/20" : "bg-white/5 text-white/25 border border-white/10"}`}>
                    {hero.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {hero.subtitle && <p className="text-xs text-white/35 mt-0.5 truncate">{hero.subtitle}</p>}
                {hero.cta_text && <p className="text-xs text-white/20 mt-0.5">CTA: {hero.cta_text} → {hero.cta_link}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(hero)} title={hero.is_active ? "Deactivate" : "Activate"}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition">
                  {hero.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => openEdit(hero)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDeleteHero(hero.id)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-400/20 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {heroToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm"
          style={{
            background: heroToast.type === "success" ? "rgba(5,15,5,0.97)" : "rgba(20,5,5,0.97)",
            backdropFilter: "blur(24px)",
            border: heroToast.type === "success" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            animation: "toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
          <span style={{ color: heroToast.type === "success" ? "#86efac" : "#fca5a5" }}>{heroToast.message}</span>
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]           = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [content, setContent]         = useState<ContentItem[]>([])
  const [loading, setLoading]         = useState(true)
  const [view, setView]               = useState<"grid" | "list">("grid")
  const [rankItem, setRankItem]       = useState<ContentItem | null>(null)
  const [rankModalOpen, setRankModalOpen]     = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [isDeleting, setIsDeleting]   = useState(false)

  const stories = content.filter((i) => i.type === "story")
  const films   = content.filter((i) => i.type === "film")

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await getSupabase().auth.getSession()
      if (session?.user?.email === ADMIN_EMAIL) setAuthed(true)
      setAuthChecked(true)
    }
    checkSession()
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setAuthed(session?.user?.email === ADMIN_EMAIL)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const { data, error } = await getSupabase().from("content").select("id, title, type, thumbnail_url, views, likes, rank, creator_name").order("created_at", { ascending: false })
      if (error) { logSupabaseError("fetchContent", error); return }
      setContent((data as ContentItem[]) ?? [])
    } catch (err) {
      logSupabaseError("fetchContent unexpected", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (authed) fetchContent() }, [authed])

  const handleRank = async (id: string, rank: number | null) => {
    try {
      if (rank === null) {
        const { error } = await getSupabase().from("content").update({ rank: null }).eq("id", id)
        if (error) { logSupabaseError("handleRank remove", error); return }
      } else {
        const target = content.find((item) => item.id === id)
        if (target?.type) {
          const { error: clearTypeError } = await getSupabase().from("content").update({ rank: null }).eq("type", target.type).eq("rank", rank).neq("id", id)
          if (clearTypeError) { logSupabaseError("handleRank clear same-type", clearTypeError); return }
        }
        const { error: setRankError } = await getSupabase().from("content").update({ rank }).eq("id", id)
        if (setRankError?.code === "23505") {
          const { error: clearGlobalError } = await getSupabase().from("content").update({ rank: null }).eq("rank", rank).neq("id", id)
          if (clearGlobalError) { logSupabaseError("handleRank clear global", clearGlobalError); return }
          const { error: retrySetRankError } = await getSupabase().from("content").update({ rank }).eq("id", id)
          if (retrySetRankError) { logSupabaseError("handleRank retry set", retrySetRankError); return }
        } else if (setRankError) {
          logSupabaseError("handleRank set", setRankError); return
        }
      }
    } catch (err) {
      logSupabaseError("handleRank unexpected", err); return
    }
    await fetchContent()
    setRankModalOpen(false)
    setRankItem(null)
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const { error } = await getSupabase().from("content").delete().eq("id", id)
      if (error) { logSupabaseError("handleDelete", error); return }
      await fetchContent()
    } catch (err) {
      logSupabaseError("handleDelete unexpected", err)
    } finally {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      setDeleteId(null)
    }
  }

  const openRank   = (item: ContentItem) => { setRankItem(item); setRankModalOpen(true) }
  const openDelete = (id: string)        => { setDeleteId(id);   setDeleteModalOpen(true) }
  const handleLogout = async () => { await getSupabase().auth.signOut(); setAuthed(false) }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-white/20" />
      </main>
    )
  }
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-10 py-10">

      {/* ── Header ── */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-white/20 tracking-widest uppercase">IMAGI</span>
            <span className="text-white/15">/</span>
            <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/[0.08]">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition ${view === "grid" ? "bg-white/10 text-white/70" : "text-white/25 hover:text-white/45"}`}>
              <LayoutGrid size={15} />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition ${view === "list" ? "bg-white/10 text-white/70" : "text-white/25 hover:text-white/45"}`}>
              <List size={15} />
            </button>
          </div>
          <button onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition">
            {loading ? <Loader2 size={13} className="animate-spin" /> : null}
            Refresh
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40 hover:bg-red-500/10 hover:border-red-400/20 hover:text-red-400 transition">
            <Lock size={13} /> Logout
          </button>
        </div>
      </header>

      {/* ── Stats ── */}
      {!loading && <StatsBar content={content} />}

      {/* ── Signup Image Manager ── */}
      <div className="mb-6 p-6 rounded-3xl border border-white/[0.07] bg-white/[0.02]">
        <SignupImageManager />
      </div>

      {/* ── Contact Settings Manager ── */}
      <div className="mb-6 p-6 rounded-3xl border border-white/[0.07] bg-white/[0.02]">
        <ContactSettingsManager />
      </div>

      {/* ── Hero Manager ── */}
      <div className="mb-12 p-6 rounded-3xl border border-white/[0.07] bg-white/[0.02]">
        <HeroManager />
      </div>

      {/* ── Content Sections ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-white/20 gap-3 text-sm">
          <Loader2 size={18} className="animate-spin" /> Loading content…
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <Section label="Stories"     icon={<BookOpen size={16} />} items={stories} onDelete={openDelete} onRank={openRank} view={view} />
          <Section label="Short Films" icon={<Film size={16} />}     items={films}   onDelete={openDelete} onRank={openRank} view={view} />
        </div>
      )}

      {rankModalOpen && (
        <RankModal item={rankItem} allItems={content} onClose={() => { setRankModalOpen(false); setRankItem(null) }} onConfirm={handleRank} />
      )}
      {deleteModalOpen && (
        <DeleteModal itemId={deleteId} onClose={() => { setDeleteModalOpen(false); setDeleteId(null) }} onConfirm={handleDelete} isDeleting={isDeleting} />
      )}
    </main>
  )
}
