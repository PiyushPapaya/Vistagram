'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatCount, getPostsByUser, type User } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { IgVerified } from '@/components/shared/ig-icons'

export function ProfileHeader({ user, isOwn }: { user: User; isOwn: boolean }) {
  const { isFollowing, follow, unfollow } = useStore()
  const following = isFollowing(user.id)
  const posts = getPostsByUser(user.id)

  const stats = [
    { label: 'posts', value: formatCount(posts.length) },
    { label: 'followers', value: formatCount(user.followers_count) },
    { label: 'following', value: formatCount(user.following_count) },
  ]

  return (
    <header className="px-4 md:px-0 pt-6 md:pt-8">
      {/* ─── Desktop layout ─── */}
      <div className="hidden md:flex items-start gap-[60px] pb-8 border-b border-border">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="h-[150px] w-[150px] rounded-full overflow-hidden border border-border/40 bg-muted">
            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-2 flex-1">
          {/* Username + buttons row */}
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-[20px] font-normal leading-6">{user.username}</h1>
            {user.is_verified && <IgVerified size={18} />}

            {isOwn ? (
              <>
                <Link
                  href="/accounts/edit"
                  className="rounded-lg bg-accent text-[14px] font-semibold py-[6px] px-4 hover:bg-muted transition-colors"
                >
                  Edit profile
                </Link>
                <Link
                  href="/accounts/edit"
                  className="rounded-lg bg-accent text-[14px] font-semibold py-[6px] px-4 hover:bg-muted transition-colors"
                >
                  View archive
                </Link>
                <button className="flex items-center p-[6px] hover:opacity-60 transition-opacity">
                  <Settings className="h-[22px] w-[22px]" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => following ? unfollow(user.id) : follow(user.id)}
                  className={cn(
                    'rounded-lg text-[14px] font-semibold py-[6px] px-5 transition-colors',
                    following
                      ? 'bg-accent text-foreground hover:bg-muted'
                      : 'bg-[#0095f6] text-white hover:bg-[#0084e6]'
                  )}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link
                  href="/direct/inbox"
                  className="rounded-lg bg-accent text-[14px] font-semibold py-[6px] px-5 hover:bg-muted transition-colors"
                >
                  Message
                </Link>
                <button className="rounded-lg bg-accent p-[6px] hover:bg-muted transition-colors">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-foreground" strokeWidth="1.75">
                    <path d="M5 12h14M12 5v14" strokeLinecap="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-11 text-[16px]">
            {stats.map(s => (
              <button key={s.label} className="flex items-center gap-1.5 hover:opacity-60 transition-opacity">
                <span className="font-semibold">{s.value}</span>
                <span className="text-foreground">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Bio */}
          <div className="leading-[18px]">
            {user.full_name && (
              <p className="text-[14px] font-semibold">{user.full_name}</p>
            )}
            {user.plan === 'plus' && (
              <p className="text-[12px] text-[#0095f6] font-semibold">Instagram Plus</p>
            )}
            {user.bio && (
              <p className="text-[14px] whitespace-pre-wrap mt-1">{user.bio}</p>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[#00376b] dark:text-[#e0f1ff] mt-0.5 block hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile layout ─── */}
      <div className="md:hidden">
        <div className="flex items-center gap-6 mb-4">
          {/* Avatar */}
          <div className="h-[77px] w-[77px] rounded-full overflow-hidden border border-border/30 shrink-0">
            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
          </div>

          {/* Action buttons */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[16px] font-semibold">{user.username}</span>
              {user.is_verified && <IgVerified size={14} />}
            </div>

            {isOwn ? (
              <div className="flex gap-2">
                <Link
                  href="/accounts/edit"
                  className="flex-1 rounded-lg bg-accent text-center text-[13px] font-semibold py-[6px] px-3 hover:bg-muted transition-colors"
                >
                  Edit profile
                </Link>
                <button className="flex-1 rounded-lg bg-accent text-[13px] font-semibold py-[6px] px-3 hover:bg-muted transition-colors">
                  Share profile
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => following ? unfollow(user.id) : follow(user.id)}
                  className={cn(
                    'flex-1 rounded-lg text-[13px] font-semibold py-[6px] px-3 transition-colors',
                    following
                      ? 'bg-accent text-foreground'
                      : 'bg-[#0095f6] text-white'
                  )}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link
                  href="/direct/inbox"
                  className="flex-1 rounded-lg bg-accent text-center text-[13px] font-semibold py-[6px] px-3"
                >
                  Message
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bio (mobile) */}
        <div className="mb-3">
          {user.full_name && <p className="text-[14px] font-semibold leading-[18px]">{user.full_name}</p>}
          {user.bio && <p className="text-[14px] leading-[18px] whitespace-pre-wrap">{user.bio}</p>}
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-[#00376b] dark:text-[#e0f1ff] hover:underline"
            >
              {user.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        {/* Stats row (mobile) */}
        <div className="flex border-t border-border">
          {stats.map(s => (
            <button key={s.label} className="flex-1 flex flex-col items-center py-3 gap-0.5 hover:bg-accent transition-colors">
              <span className="text-[14px] font-semibold leading-[18px]">{s.value}</span>
              <span className="text-[12px] text-muted-foreground leading-4">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
