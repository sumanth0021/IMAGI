// components/HeroManager.tsx
// Client component — used inside admin page
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Trash2, Pencil, Plus, Loader2, Eye, EyeOff, X, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

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

type FormState = {
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  is_active: boolean
}

const emptyForm: FormState = {
  title: "", subtitle: "", description: "",
  cta_text: "", cta_link: "", is_active: true,
}

// ── Small reusable input ──
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/35 mb-1.5 font-medium">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/25 transition"

export default function HeroManager() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchHeroes = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("hero_content")
      .select("*")
      .order("created_at", { ascending: false })
    setHeroes((data as Hero[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchHeroes() }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview(null)
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (hero: Hero) => {
    setForm({
      title: hero.title,
      subtitle: hero.subtitle ?? "",
      description: hero.description ?? "",
      cta_text: hero.cta_text ?? "",
      cta_link: hero.cta_link ?? "",
      is_active: hero.is_active,
    })
    setImagePreview(hero.image_url)
    setImageFile(null)
    setEditingId(hero.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop()
    const path = `hero/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("content").upload(path, file, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from("content").getPublicUrl(path)
    return data.publicUrl
  }

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("Title is required", "error"); return }
    if (!editingId && !imageFile) { showToast("Image is required", "error"); return }

    setSaving(true)

    let image_url = imagePreview ?? ""

    // Upload new image if selected
    if (imageFile) {
      const url = await uploadImage(imageFile)
      if (!url) { showToast("Image upload failed", "error"); setSaving(false); return }
      image_url = url
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      description: form.description || null,
      image_url,
      cta_text: form.cta_text || null,
      cta_link: form.cta_link || null,
      is_active: form.is_active,
    }

    if (editingId) {
      const { error } = await supabase.from("hero_content").update(payload).eq("id", editingId)
      if (error) { showToast("Update failed: " + error.message, "error"); setSaving(false); return }
      showToast("Hero updated!")
    } else {
      const { error } = await supabase.from("hero_content").insert(payload)
      if (error) { showToast("Save failed: " + error.message, "error"); setSaving(false); return }
      showToast("Hero added!")
    }

    setSaving(false)
    resetForm()
    fetchHeroes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero?")) return
    await supabase.from("hero_content").delete().eq("id", id)
    showToast("Hero deleted")
    fetchHeroes()
  }

  const toggleActive = async (hero: Hero) => {
    await supabase.from("hero_content").update({ is_active: !hero.is_active }).eq("id", hero.id)
    fetchHeroes()
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white/90">Hero Management</h2>
          <p className="text-xs text-white/30 mt-0.5">Control what appears in the homepage hero section</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-[#0a0a0a] hover:bg-white/90 transition"
          >
            <Plus size={15} /> Add Hero
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-6 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white/80">
              {editingId ? "Edit Hero" : "New Hero"}
            </h3>
            <button onClick={resetForm} className="text-white/30 hover:text-white/60 transition">
              <X size={18} />
            </button>
          </div>

          {/* Image upload */}
          <Field label="Background Image" required>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative cursor-pointer rounded-2xl overflow-hidden border border-dashed border-white/10 hover:border-white/25 transition flex items-center justify-center"
              style={{ aspectRatio: "16/6" }}
            >
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
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Title" required>
              <input className={inputCls} placeholder="Hero title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} placeholder="Optional subtitle" value={form.subtitle}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} className={`${inputCls} resize-none`}
              placeholder="Short description shown under the title"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="CTA Button Text">
              <input className={inputCls} placeholder="e.g. Explore Stories" value={form.cta_text}
                onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} />
            </Field>
            <Field label="CTA Button Link">
              <input className={inputCls} placeholder="/go/home-hero" value={form.cta_link}
                onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} />
            </Field>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: form.is_active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.1)" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#0a0a0a] transition-transform"
                style={{ transform: form.is_active ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
            <span className="text-sm text-white/50">{form.is_active ? "Active — visible on homepage" : "Inactive — hidden from homepage"}</span>
          </div>

          {/* Save / Cancel */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#0a0a0a] hover:bg-white/90 disabled:opacity-50 transition">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? "Saving…" : editingId ? "Update Hero" : "Save Hero"}
            </button>
            <button onClick={resetForm}
              className="px-5 py-2.5 rounded-xl text-sm text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hero list */}
      {loading ? (
        <div className="flex items-center gap-3 text-white/25 text-sm py-10 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading heroes…
        </div>
      ) : heroes.length === 0 ? (
        <div className="text-center py-16 text-white/25 text-sm">
          No heroes yet. Add one above to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {heroes.map(hero => (
            <div key={hero.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition">

              {/* Thumbnail */}
              <div className="relative w-24 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5">
                <Image src={hero.image_url} alt={hero.title} fill className="object-cover" sizes="96px" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white/90 truncate">{hero.title}</p>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    hero.is_active
                      ? "bg-green-500/15 text-green-400 border border-green-400/20"
                      : "bg-white/5 text-white/25 border border-white/10"
                  }`}>
                    {hero.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {hero.subtitle && <p className="text-xs text-white/35 mt-0.5 truncate">{hero.subtitle}</p>}
                {hero.cta_text && (
                  <p className="text-xs text-white/20 mt-0.5">CTA: {hero.cta_text} → {hero.cta_link}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(hero)}
                  title={hero.is_active ? "Deactivate" : "Activate"}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition">
                  {hero.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => openEdit(hero)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(hero.id)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-400/20 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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