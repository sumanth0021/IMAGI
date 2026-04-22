"use client"

import { memo, useMemo, useState } from "react"

const PREVIEW_LENGTH = 220

function ExpandableDescription({
  text,
}: {
  text: string
}) {
  const [expanded, setExpanded] = useState(false)

  const normalizedText = useMemo(() => text.trim(), [text])
  const canExpand = normalizedText.length > PREVIEW_LENGTH

  const previewText = useMemo(() => {
    if (!canExpand) return normalizedText
    return `${normalizedText.slice(0, PREVIEW_LENGTH).trimEnd()}...`
  }, [canExpand, normalizedText])

  return (
    <p className="text-sm md:text-base leading-relaxed text-white/80 whitespace-pre-line break-words max-w-3xl">
      {expanded || !canExpand ? normalizedText : previewText}
      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="ml-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors"
        >
          {expanded ? "LESS" : "MORE"}
        </button>
      )}
    </p>
  )
}

export default memo(ExpandableDescription)
