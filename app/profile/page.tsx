// // app/profile/page.tsx
// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import Link from "next/link"
// import ProfileTabs from "@/components/ProfileTabs"
// import ProfileDrawer from "@/components/ProfileDrawer"

// export default async function ProfilePage() {
//   const supabase = await createClient()

//   const { data: { user }, error } = await supabase.auth.getUser()
//   if (!user || error) redirect("/signup")

//   const { data } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", user.id)
//     .single()

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white">

//       {/* ── Navbar ── */}
//       <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md">
//   <div className="flex items-center px-4 py-4">
//     <Link href="/" className="flex h-10 w-10 items-center justify-center text-white/70 hover:text-white transition">
//       <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
//         <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     </Link>
//     <div className="flex-1 text-center text-lg font-medium tracking-widest text-white/90">
//       IMAGI
//     </div>
//     <ProfileDrawer
//       avatarUrl={data?.avatar_url ?? null}
//       email={data?.email ?? user.email ?? null}
//       name={data?.name ?? user.email?.split("@")[0] ?? "User"}
//     />
//   </div>
// </div>

//       {/* ── Profile Header ── */}
//       <div className="px-6 pt-4 pb-6">

//         {/* Avatar */}
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full overflow-hidden  border border-white/10">
//   {data?.avatar_url ? (
//     <img src={data.avatar_url} alt={data.name} className="w-full h-full object-cover"/>
//   ) : (
//     <div className="w-full h-full flex items-center justify-center text-2xl font-semibold bg-white/10">
//       {data?.name?.charAt(0).toUpperCase() ?? "?"}
//     </div>
//   )}
// </div>
//           </div>

//           {/* Name + verified */}
//           <div className="flex items-center gap-1.5 mt-4">
//             <h1 className="text-lg font-semibold tracking-wide">{data?.name ?? "User"}</h1>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="10" fill="#6366f1"/>
//               <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
          
//         </div>

//         {/* ── Stats ── */}
//         <div className="flex items-center justify-center gap-0 mt-6">
//           <div className="flex flex-col items-center flex-1 border-r border-white/10">
//             <span className="text-xl font-semibold">0</span>
//             <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Posts</span>
//           </div>
//           <div className="flex flex-col items-center flex-1 border-r border-white/10">
//             <span className="text-xl font-semibold">0</span>
//             <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Followers</span>
//           </div>
//           <div className="flex flex-col items-center flex-1">
//             <span className="text-xl font-semibold">0</span>
//             <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Following</span>
//           </div>
//         </div>

//       </div>

//       {/* ── Divider ── */}
//       <div className="h-px bg-white/8  pt-20px" />

//       {/* ── Tabs + Content ── */}
//       <ProfileTabs />

//     </div>
//   )
// }
// app/profile/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProfileTabs from "@/components/ProfileTabs"
import ProfileDrawer from "@/components/ProfileDrawer"
import BackButton from "@/components/BackButton"

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Auth check
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) redirect("/signup")

  // 2. Fetch user info
  const { data: profile } = await supabase
    .from("users")
    .select("name, email, avatar_url")
    .eq("id", user.id)
    .single()

  // 3. Fetch stories — filter by user_id + type = story
  const { data: stories } = await supabase
    .from("content")
    .select("id, type, title, thumbnail_url, video_id, creator_name, created_at")
    .eq("user_id", user.id)
    .eq("type", "story")
    .order("created_at", { ascending: false })

  // 4. Fetch films — filter by user_id + type = film
  const { data: films } = await supabase
    .from("content")
    .select("id, type, title, thumbnail_url, video_id, creator_name, created_at")
    .eq("user_id", user.id)
    .eq("type", "film")
    .order("created_at", { ascending: false })

  const totalPosts = (stories?.length ?? 0) + (films?.length ?? 0)

  return (
    <div className="min-h-screen text-white" style={{ background: "#000000" }}>

      {/* ── Navbar ── */}
      {/* <div
  className="sticky top-0 z-50"
  style={{
    background: "rgba(10,10,10,0.9)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  }}
>
  <div className="max-w-7xl mx-auto flex items-center px-4 py-3">
    
    {/* Back Button */}
    {/* <BackButton className="flex items-center justify-center p-2 rounded-full text-blue-500 hover:bg-white/10 transition" /> */}

    {/* Title */}
    {/* <div className="flex-1 text-center text-xl tracking-[0.16em] md:text-2xl font-bold uppercase text-white/90">
      PROFILE
    </div> */} 

    {/* Right side — balances the back button */}
    {/* <ProfileDrawer /> */}

  {/* </div>
</div> */}
{/* Navbar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
  <div className="max-w-7xl mx-auto px-3 md:px-10 flex items-center text-white py-3">

    {/* Back Button */}
    <BackButton className="flex items-center justify-center p-2 rounded-full text-blue-500 hover:bg-white/10 transition" />

    {/* Title */}
    <div className="flex-1 text-center text-xlg font-bold tracking-widest">
      PROFILE
    </div>

    {/* Spacer to balance the back button */}
    <ProfileDrawer /> 

  </div>
</div>

      {/* ── Profile Header ── */}
      <div className="px-6 pt-6 pb-6">
        <div className="flex flex-col items-center">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name ?? ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-semibold bg-white/10">
                {profile?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          {/* Name + verified */}
          <div className="flex items-center gap-1.5 mt-4">
            <h1 className="text-lg font-semibold">{profile?.name ?? "User"}</h1>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#6366f1"/>
              <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xs text-white/40 mt-1">{profile?.email}</p>
        </div>

        {/* ── Stats ── */}
        <div className="flex items-center mt-6">
          <div className="flex flex-col items-center flex-1 border-r border-white/10">
            <span className="text-xl font-semibold">{totalPosts}</span>
            <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Posts</span>
          </div>
          <div className="flex flex-col items-center flex-1 border-r border-white/10">
            <span className="text-xl font-semibold">0</span>
            <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Followers</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-xl font-semibold">0</span>
            <span className="text-[11px] uppercase tracking-widest text-white/40 mt-0.5">Following</span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

      {/* ── Tabs — pass fetched data directly ── */}
      <ProfileTabs
        stories={stories ?? []}
        films={films ?? []}
      />

    </div>
  )
}