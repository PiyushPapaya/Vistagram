'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { IgHome, IgSearch, IgReels } from '@/components/shared/ig-icons'

export function MobileNav() {
  const pathname = usePathname()
  const user = getCurrentUser()
  const { setCreateOpen } = useStore()

  const iconSize = 24

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[49px] items-center border-t border-border bg-background md:hidden">
      {/* Home */}
      <Link href="/" className="flex flex-1 items-center justify-center h-full" aria-label="Home">
        <IgHome filled={pathname === '/'} size={iconSize} />
      </Link>

      {/* Search/Explore */}
      <Link href="/explore" className="flex flex-1 items-center justify-center h-full" aria-label="Search">
        <IgSearch filled={pathname.startsWith('/explore')} size={iconSize} />
      </Link>

      {/* Create (center) */}
      <button
        onClick={() => setCreateOpen(true)}
        className="flex flex-1 items-center justify-center h-full"
        aria-label="Create"
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
          <rect x="1.25" y="1.25" width="23.5" height="23.5" rx="6.5" stroke="currentColor" strokeWidth="1.75"/>
          <line x1="13" y1="7.5" x2="13" y2="18.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <line x1="7.5" y1="13" x2="18.5" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Reels */}
      <Link href="/reels" className="flex flex-1 items-center justify-center h-full" aria-label="Reels">
        <IgReels filled={pathname.startsWith('/reels')} size={iconSize} />
      </Link>

      {/* Profile */}
      <Link href={`/${user.username}`} className="flex flex-1 items-center justify-center h-full" aria-label="Profile">
        <span className={cn(
          'h-[24px] w-[24px] overflow-hidden rounded-full',
          pathname === `/${user.username}`
            ? 'ring-[2px] ring-foreground ring-offset-[2px] ring-offset-background'
            : 'border border-border'
        )}>
          <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
        </span>
      </Link>
    </nav>
  )
}
