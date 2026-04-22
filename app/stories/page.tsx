"use client"

import { motion } from "framer-motion"
import { getStories } from "@/lib/data"
import Link from "next/link"
import BackButton from "@/components/BackButton"
import { useEffect, useState } from "react"


// componet section
export default function StoriesPage() {


const [stories, setStories] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const loadStories = async () => {
    try {
      const data = await getStories()
      setStories(data)
    } finally {
      setIsLoading(false)
    }
  }

  loadStories()
}, [])

const skeletonItems = Array.from({ length: 10 })
  return (
    <main className="min-h-screen bg-[#000000] text-white">
      {/* Top Bar */}
<div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
  <div className="max-w-7xl mx-auto px-3 md:px-10 flex items-center text-white py-3">

    {/* Back Button */}
    <BackButton className="flex items-center justify-center p-2 rounded-full text-blue-500 hover:bg-white/10 transition" />

    {/* Title */}
    <div className="flex-1 text-center text-lg font-bold tracking-widest">
      STORIES
    </div>

    {/* Spacer to balance the back button */}
    <div className="w-10" />

  </div>
</div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {isLoading
            ? skeletonItems.map((_, index) => (
                <div key={`story-skeleton-${index}`} className="group animate-pulse">
                  <div className="relative overflow-hidden rounded-2xl bg-white/10">
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                  </div>

                  <div className="mt-3 h-4 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
                </div>
              ))
            : stories.map((story, index) => (
            <Link key={story.id} href={`/stories/${story.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                  <img
                    src={story.thumbnail_url}
                    alt={story.creator_name}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                </div>

                <p className="mt-3 text-sm font-medium text-white/95 truncate">
                  {story.title}
                </p>
                <p className="text-xs text-white/60 truncate">
                  By {story.creator_name}
                </p>
              </motion.div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </main>
  )
}
