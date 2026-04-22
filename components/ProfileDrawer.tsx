"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type ProfileDrawerProps = {
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

type MenuLinkItem = {
  icon: ReactNode
  label: string
  href?: string
  action?: () => void
  trailing?: ReactNode
}

function getInitials(name?: string | null) {
  if (!name) return "U"

  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U"
}

function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full text-white/80">
      {children}
    </span>
  )
}

export default function ProfileDrawer({
  name,
  email,
  avatarUrl,
}: ProfileDrawerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/signup"
  }

  const displayName = name?.trim() || "User"
  const subtitle = email?.trim() || "Manage your account"
  const initials = getInitials(displayName)

  const openUpgrade = () => setOpen(false)
  const openPersonalization = () => setOpen(false)

  const groups: MenuLinkItem[][] = [
    [
      {
        icon: (
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </MenuIcon>
        ),
        label: "Add another account",
        href: "/signup",
      },
    ],
    [
      {
        icon: (
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M2 11C2 6 6 2 11 2C16 2 20 5.5 20 10C20 13 18 14.5 15.5 14.5H13.5C12.5 14.5 12 15 12 16C12 17.5 13.5 19 11 19C6 19 2 15.5 2 11Z" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  <circle cx="6.5" cy="9" r="1.2" stroke="#FFFFFF" strokeWidth="1.4" />
  <circle cx="10" cy="5.5" r="1.2" stroke="#FFFFFF" strokeWidth="1.4" />
  <circle cx="14.5" cy="6.5" r="1.2" stroke="#FFFFFF" strokeWidth="1.4" />
</svg>
          </MenuIcon>
        ),
        label: "Theme",
        action: openPersonalization,
      },
    
      {
        icon: (
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15.25A3.25 3.25 0 1012 8.75a3.25 3.25 0 000 6.5z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M19.4 15a1.62 1.62 0 00.32 1.78l.06.06a1.9 1.9 0 010 2.68 1.9 1.9 0 01-2.68 0l-.06-.06a1.62 1.62 0 00-1.78-.32 1.62 1.62 0 00-.98 1.48V21a1.9 1.9 0 01-3.8 0v-.08a1.62 1.62 0 00-.99-1.49 1.62 1.62 0 00-1.77.33l-.06.06a1.9 1.9 0 01-2.68-2.68l.06-.06A1.62 1.62 0 004.6 15a1.62 1.62 0 00-1.48-.98H3a1.9 1.9 0 010-3.8h.08A1.62 1.62 0 004.57 9a1.62 1.62 0 00-.33-1.77l-.06-.06a1.9 1.9 0 012.68-2.68l.06.06A1.62 1.62 0 008.7 4.2a1.62 1.62 0 00.98-1.48V2.7a1.9 1.9 0 013.8 0v.08a1.62 1.62 0 00.98 1.48 1.62 1.62 0 001.78-.32l.06-.06a1.9 1.9 0 012.68 2.68l-.06.06A1.62 1.62 0 0019.4 9c.14.38.59 1.22 1.48 1.22H21a1.9 1.9 0 010 3.8h-.08A1.62 1.62 0 0019.4 15z"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MenuIcon>
        ),
        label: "Settings",
        action: openPersonalization,
      },
    ],
    [
      {
        icon: (
          <MenuIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M12 8.25h.01M9.7 10.2c.63-1.27 2.2-2.05 3.7-1.67 1.2.3 2.14 1.27 2.38 2.48.26 1.3-.23 2.57-1.2 3.34-.66.53-1.08.93-1.08 1.9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MenuIcon>
        ),
        label: "Help",
        action: openPersonalization,
        trailing: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/45">
            <path
              d="M10 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  ]

  return (
    <div className="relative shrink-0">
      {open ? (
        <button
          aria-label="Close profile menu"
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}

      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="relative z-40 flex h-10 w-10 items-center justify-center text-white/70 transition hover:text-white"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+12px)] z-40 w-[312px] origin-top-right rounded-[26px] border border-white/10 bg-[#353333]/95 p-4 text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.96] opacity-0"
        }`}
        role="menu"
      >
        <div className="flex items-center gap-3 rounded-2xl px-2 pb-3">
          {avatarUrl ? (
            <img
              alt={displayName}
              className="h-11 w-11 rounded-full object-cover"
              src={avatarUrl}
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8c9792] text-sm font-medium text-white/90">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[1.05rem] font-medium uppercase tracking-[0.04em] text-white">
              {displayName}
            </p>
            <p className="truncate text-sm text-white/70">{subtitle}</p>
          </div>
        </div>

        {groups.map((group, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            className={groupIndex === 0 ? "mt-1" : "mt-2 border-t border-white/12 pt-2"}
          >
            {group.map((item) => {
              const content = (
                <>
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-[1.04rem] font-medium text-white/90">{item.label}</span>
                  <span className="ml-auto shrink-0">{item.trailing}</span>
                </>
              )

              const itemClassName =
                "flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition hover:bg-white/6"

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    className={itemClassName}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <button
                  key={item.label}
                  className={itemClassName}
                  onClick={item.action}
                  type="button"
                >
                  {content}
                </button>
              )
            })}
          </div>
        ))}

        <div className="mt-2 border-t border-white/12 pt-2">
          <button
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left text-white/90 transition hover:bg-white/6"
            onClick={handleSignOut}
            type="button"
          >
            <MenuIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10 17l-5-5 5-5M5 12h10M13 5h3a2 2 0 012 2v10a2 2 0 01-2 2h-3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MenuIcon>
            <span className="text-[1.04rem] font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
