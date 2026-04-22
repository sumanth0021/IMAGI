"use client"

import { memo, useMemo, useState } from "react"

const INITIAL_CHUNK = 900
const NEXT_CHUNK = 900

function ProgressiveStoryContent({
  text,
}: {
  text: string
}) {
  const [visibleChars, setVisibleChars] = useState(INITIAL_CHUNK)

  const normalizedText = useMemo(() => text.trim(), [text])
  const hasMore = normalizedText.length > visibleChars
  const displayedText = normalizedText.slice(0, visibleChars)

  if (!normalizedText) {
    return (
      <p className="mt-6 text-base md:text-lg leading-relaxed text-white/60 whitespace-pre-line break-words italic">
        No content available.
      </p>
    )
  }

  return (
    <div className="mt-6">
      <p className="text-base md:text-lg leading-relaxed text-white/85 whitespace-pre-line break-words">
        {displayedText}
        {hasMore ? "..." : ""}
      </p>

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleChars((current) => current + NEXT_CHUNK)}
          className="mt-4 text-xs uppercase tracking-[0.35em] text-white/70 hover:text-white transition-colors"
        >
          More
        </button>
      )}
    </div>
  )
}

export default memo(ProgressiveStoryContent)
