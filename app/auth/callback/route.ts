// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Save/update user in users table
      await supabase.from("users").upsert({
        id: data.user.id,
        name: data.user.user_metadata?.full_name
          ?? data.user.user_metadata?.name
          ?? data.user.email?.split("@")[0], // fallback to email prefix
        email: data.user.email,
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
      }, { onConflict: "id" })

      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/signup`)
}