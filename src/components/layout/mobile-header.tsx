'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { IgHeart, IgMessages } from '@/components/shared/ig-icons'

export function MobileHeader() {
  const pathname = usePathname()
  const { unreadNotificationsCount } = useStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const unread = mounted ? unreadNotificationsCount() : 0

  if (pathname !== '/') return null

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-[44px] items-center justify-between border-b border-border bg-background px-4 md:hidden">
      {/* Wordmark */}
      <span className="ig-wordmark text-[28px] text-foreground leading-none">Instagram</span>

      {/* Right icons */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <Link href="/notifications" aria-label="Notifications" className="relative">
          <IgHeart size={24} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ed4956] text-[9px] font-bold text-white px-0.5 leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        {/* DMs */}
        <Link href="/direct/inbox" aria-label="Direct messages">
          <IgMessages size={24} />
        </Link>
      </div>
    </header>
  )
}
