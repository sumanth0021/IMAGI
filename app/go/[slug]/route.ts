import { NextResponse } from "next/server"
import { CTA_REDIRECTS, DEFAULT_CTA_REDIRECT } from "@/lib/ctaRedirects"

type RouteParams = {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { origin } = new URL(request.url)
  const { slug } = await params

  const key = slug.trim().toLowerCase()
  const target = CTA_REDIRECTS[key] ?? DEFAULT_CTA_REDIRECT

  const url = target.startsWith("http://") || target.startsWith("https://")
    ? target
    : `${origin}${target.startsWith("/") ? target : `/${target}`}`

  return NextResponse.redirect(url)
}
