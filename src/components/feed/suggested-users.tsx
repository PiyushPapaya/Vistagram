'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { USERS, getCurrentUser, formatCount } from '@/lib/mock-data'
import { IgVerified } from '@/components/shared/ig-icons'

export function SuggestedUsers() {
  const { following, follow, currentUserId } = useStore()
  const me = getCurrentUser()

  const suggestions = USERS
    .filter(u => u.id !== currentUserId && !following.includes(u.id))
    .slice(0, 5)

  return (
    <aside className="w-[319px] shrink-0 pt-6 sticky top-6 self-start">
      {/* Current user */}
      <div className="flex items-center gap-3.5 mb-4">
        <Link href={`/${me.username}`} className="shrink-0">
          <img src={me.avatar_url} alt={me.username} className="h-[44px] w-[44px] rounded-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <Link href={`/${me.username}`} className="text-[14px] font-semibold leading-5 hover:opacity-60 transition-opacity">
              {me.username}
            </Link>
            {me.is_verified && <IgVerified size={12} />}
          </div>
          <p className="text-[14px] text-muted-foreground truncate leading-5">{me.full_name}</p>
        </div>
        <button className="text-[12px] font-semibold text-[#0095f6] hover:text-foreground transition-colors">
          Switch
        </button>
      </div>

      {/* Suggested header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-muted-foreground">Suggested for you</span>
        <Link href="/explore" className="text-[12px] font-semibold text-foreground hover:opacity-60 transition-opacity">
          See all
        </Link>
      </div>

      {/* Suggestions */}
      {suggestions.map(user => (
        <div key={user.id} className="flex items-center gap-3 mb-3">
          <Link href={`/${user.username}`} className="shrink-0">
            <img src={user.avatar_url} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <Link href={`/${user.username}`} className="text-[14px] font-semibold leading-[18px] block hover:opacity-60 transition-opacity truncate">
                {user.username}
              </Link>
              {user.is_verified && <IgVerified size={11} />}
            </div>
            <p className="text-[12px] text-muted-foreground truncate leading-[16px]">
              Suggested for you
            </p>
          </div>
          <button
            onClick={() => follow(user.id)}
            className="text-[12px] font-semibold text-[#0095f6] hover:text-foreground transition-colors shrink-0"
          >
            Follow
          </button>
        </div>
      ))}

      {/* Footer links */}
      <div className="mt-6 flex flex-wrap gap-x-2 gap-y-1">
        {[
          'About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms',
          'Locations', 'Language', 'Meta Verified',
        ].map(l => (
          <span key={l} className="text-[11px] text-muted-foreground cursor-pointer hover:underline">
            {l}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground uppercase tracking-wide">
        © 2026 Instagram from Meta
      </p>
    </aside>
  )
}
