'use client'

import { useRef } from 'react'
import { useStore } from '@/lib/store'
import { getStoryAuthors, getUserById, getCurrentUser, getStoriesByUser } from '@/lib/mock-data'
import { StoryViewer } from '@/components/stories/story-viewer'
import { cn } from '@/lib/utils'

// Sample notes for a few users (2025-2026 Instagram Notes feature)
const NOTES: Record<string, string> = {
  'u2': 'making it from scratch 🤍',
  'u4': 'obsessed w this song',
  'u6': 'in the studio 🎨',
}

export function StoryTray() {
  const { setActiveStoryUserId, activeStoryUserId, viewedStories } = useStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const me = getCurrentUser()
  const storyAuthors = getStoryAuthors()

  function isUserStorySeen(userId: string) {
    const stories = getStoriesByUser(userId)
    return stories.length > 0 && stories.every(s => viewedStories.includes(s.id))
  }

  return (
    <>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto overflow-y-hidden px-4 pt-2 pb-3 border-b border-border"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Your story */}
        <button
          className="flex flex-col items-center gap-[6px] shrink-0"
          onClick={() => setActiveStoryUserId(me.id)}
        >
          <div className="flex flex-col items-center">
            {/* Reserved note row — keeps every avatar on the same baseline */}
            <div className="h-[24px]" aria-hidden />
            <div className="relative h-[64px] w-[64px]">
              <div className="h-full w-full rounded-full overflow-hidden border border-border">
                <img src={me.avatar_url} alt={me.username} className="h-full w-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#0095f6] border-[3px] border-background">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <line x1="5" y1="1.5" x2="5" y2="8.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="1.5" y1="5" x2="8.5" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </div>
          </div>
          <span className="text-[11px] text-foreground w-[68px] truncate text-center leading-4">Your story</span>
        </button>

        {/* Others' stories */}
        {storyAuthors.filter(id => id !== me.id).map(userId => {
          const user = getUserById(userId)!
          const seen = isUserStorySeen(userId)
          const note = NOTES[userId]

          return (
            <button
              key={userId}
              className="flex flex-col items-center gap-[6px] shrink-0"
              onClick={() => setActiveStoryUserId(userId)}
            >
              <div className="flex flex-col items-center">
                {/* Reserved note row (in-flow, so it can never clip the scroller) */}
                <div className="h-[24px] flex items-end justify-center">
                  {note && <span className="ig-note-bubble mb-[2px]">{note}</span>}
                </div>

                {seen ? (
                  <div className="h-[64px] w-[64px] rounded-full p-[2px] border-2 border-[#dbdbdb] dark:border-[#262626]">
                    <div className="h-full w-full rounded-full overflow-hidden">
                      <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <div className="h-[64px] w-[64px] rounded-full p-[2px]"
                    style={{ background: 'linear-gradient(to bottom right, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <div className="h-full w-full rounded-full overflow-hidden border-2 border-background">
                      <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
              <span className={cn(
                'text-[11px] w-[68px] truncate text-center leading-4',
                seen ? 'text-muted-foreground' : 'text-foreground'
              )}>
                {user.username}
              </span>
            </button>
          )
        })}
      </div>

      {activeStoryUserId && <StoryViewer key={activeStoryUserId} userId={activeStoryUserId} />}
    </>
  )
}
