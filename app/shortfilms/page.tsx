"use client"

import { motion } from "framer-motion"
import { getFilms } from "@/lib/data"
import Link from "next/link"
import BackButton from "@/components/BackButton"
import { useEffect, useState } from "react"


export default function ShortFilmsPage() {
  const [films, setFilms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const loadFilms = async () => {
    try {
      const data = await getFilms()
      setFilms(data)
    } finally {
      setIsLoading(false)
    }
  }

  loadFilms()
}, [])

const skeletonItems = Array.from({ length: 10 })
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Bar */}
<div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
  <div className="max-w-7xl mx-auto px-3 md:px-10 flex items-center text-white py-3">

    {/* Back Button */}
    <BackButton className="flex items-center justify-center p-2 rounded-full text-blue-500 hover:bg-white/10 transition" />

    {/* Title */}
    <div className="flex-1 text-center text-lg font-bold tracking-widest">
      SHORT FILMS
    </div>

    {/* Spacer to balance the back button */}
    <div className="w-10" />

  </div>
</div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {isLoading
            ? skeletonItems.map((_, index) => (
                <div key={`film-skeleton-${index}`} className="group animate-pulse">
                  <div className="overflow-hidden rounded-2xl bg-white/10 shadow-lg shadow-black/20">
                    <div className="w-full aspect-video bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                  </div>
                  <div className="mt-4 h-3 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
                </div>
              ))
            : films.map((film) => (
            <Link key={film.id} href={`/shortfilms/${film.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/40">
                  <img
                    src={film.thumbnail_url}
                    alt={film.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-200 truncate">{film.title}</p>
                <p className="text-xs text-gray-500 mt-1">By {film.creator_name}</p>
              </motion.div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </main>
  )
}
