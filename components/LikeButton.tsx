"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

function getFingerprint(): string {
  const key = "imagi_user_fp"
  let fp = localStorage.getItem(key)
  if (!fp) {
    fp = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(key, fp)
  }
  return fp
}

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function LikeButton({
  id,
  initialLikes,
}: {
  id: string
  initialLikes: number
}) {
  const supabase = createClient()
  const storageKey = `liked_${id}`

  const [likes, setLikes] = useState(initialLikes || 0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pop, setPop] = useState(false)

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "true")
  }, [storageKey])

  const triggerPop = () => {
    setPop(true)
    setTimeout(() => setPop(false), 300)
  }

  const handleLike = async () => {
    if (loading) return
    setLoading(true)

    const fingerprint = getFingerprint()

    if (!liked) {
      // — Like —
      const { data, error } = await supabase.rpc("increment_likes", {
        row_id: id,
        fingerprint,
      })

      if (!error && data === true) {
        setLikes((prev) => prev + 1)
        setLiked(true)
        triggerPop()
        localStorage.setItem(storageKey, "true")
      } else if (data === false) {
        // DB says already liked — sync UI
        setLiked(true)
        localStorage.setItem(storageKey, "true")
      }
    } else {
      // — Unlike —
      const { error } = await supabase.rpc("decrement_likes", {
        row_id: id,
        fingerprint,
      })

      if (!error) {
        setLikes((prev) => Math.max(0, prev - 1))
        setLiked(false)
        triggerPop()
        localStorage.removeItem(storageKey)
      }
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border transition-all duration-200
        select-none outline-none
        ${pop ? "scale-95" : "scale-100"}
        ${liked
          ? "bg-white/10 border-white/20 cursor-pointer"
          : "bg-white/[0.07] border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
        }
        ${loading ? "opacity-60" : "opacity-100"}
        active:scale-95
      `}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[18px] h-[18px] shrink-0 transition-all duration-200"
        style={liked ? {
          fill: "#fbbf24",
          stroke: "#fbbf24",
        } : {
          fill: "transparent",
          stroke: "rgba(255,255,255,0.7)",
        }}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>

      <span
        className={`text-sm font-semibold tabular-nums transition-colors duration-200
          ${liked ? "text-amber-400" : "text-white/80"}
        `}
      >
        {fmt(likes)}
      </span>
    </button>
  )
}