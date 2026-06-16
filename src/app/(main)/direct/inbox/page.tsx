'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Phone, Video, Info } from 'lucide-react'
import { DM_THREADS, getUserById, NOTES, relativeTime, getCurrentUser } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { IgHeart, IgEmoji, IgShare, IgMessages } from '@/components/shared/ig-icons'

export default function InboxPage() {
  const [activeThread, setActiveThread] = useState(DM_THREADS[0])
  const { dmMessages, sendDmMessage, currentUserId } = useStore()
  const [input, setInput] = useState('')
  const me = getCurrentUser()

  function handleSend() {
    if (!input.trim()) return
    sendDmMessage(activeThread.id, currentUserId, input.trim())
    setInput('')
  }

  const threadMessages = dmMessages[activeThread.id] ?? activeThread.messages

  return (
    <div className="flex h-[calc(100dvh-49px)] md:h-screen border-l border-border">
      {/* ─── Left: Thread list ─── */}
      <div className="w-full md:w-[397px] border-r border-border flex flex-col shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-semibold">{me.username}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-foreground ml-1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <button aria-label="New message">
            <Edit className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        {/* Notes row */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[16px] font-semibold mb-3">Notes</p>
          <div className="flex gap-4 overflow-x-auto">
            {/* My note */}
            <button className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative mt-5">
                <div className="h-[50px] w-[50px] rounded-full overflow-hidden border border-border">
                  <img src={me.avatar_url} alt={me.username} className="h-full w-full object-cover" />
                </div>
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent dark:bg-[#262626] rounded-2xl px-2 py-0.5 text-[10px] whitespace-nowrap border border-border text-foreground max-w-[70px] truncate">
                  Add note
                </span>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-[#0095f6] border-2 border-background">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="white"><line x1="4.5" y1="1" x2="4.5" y2="8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/><line x1="1" y1="4.5" x2="8" y2="4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Your note</span>
            </button>
            {NOTES.map(note => {
              const u = getUserById(note.user_id)!
              return (
                <button key={note.id} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="relative mt-5">
                    <div className="h-[50px] w-[50px] rounded-full overflow-hidden border border-border">
                      <img src={u.avatar_url} alt={u.username} className="h-full w-full object-cover" />
                    </div>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent dark:bg-[#262626] rounded-2xl px-2 py-0.5 text-[10px] whitespace-nowrap border border-border text-foreground max-w-[80px] truncate">
                      {note.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate w-[50px] text-center">{u.username}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Messages header */}
        <div className="flex items-center justify-between px-5 py-2">
          <p className="text-[16px] font-semibold">Messages</p>
          <button className="text-[14px] text-muted-foreground font-semibold">Requests</button>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto">
          {DM_THREADS.map(thread => {
            const otherIds = thread.participant_ids.filter(id => id !== currentUserId)
            const other = getUserById(otherIds[0])!
            const isActive = thread.id === activeThread.id
            return (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={cn(
                  'flex w-full items-center gap-3 px-5 py-2.5 hover:bg-accent transition-colors',
                  isActive && 'bg-accent'
                )}
              >
                <div className="relative shrink-0">
                  {thread.is_group ? (
                    <div className="relative h-14 w-14">
                      <img src={other.avatar_url} alt="" className="h-9 w-9 rounded-full absolute top-0 left-0 border-2 border-background object-cover" />
                      <img src={getUserById(otherIds[1] ?? otherIds[0])!.avatar_url} alt="" className="h-9 w-9 rounded-full absolute bottom-0 right-0 border-2 border-background object-cover" />
                    </div>
                  ) : (
                    <img src={other.avatar_url} alt={other.username} className="h-[56px] w-[56px] rounded-full object-cover" />
                  )}
                  {thread.unread_count > 0 && (
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[#0095f6] border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={cn('text-[14px] leading-[18px] truncate', thread.unread_count > 0 ? 'font-semibold' : '')}>
                    {thread.is_group ? thread.name : other.username}
                  </p>
                  <p className={cn('text-[13px] truncate', thread.unread_count > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                    {thread.last_message} · {relativeTime(thread.last_message_time)}
                  </p>
                </div>
                {thread.unread_count > 0 && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0095f6] shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── Right: Thread view (desktop only) ─── */}
      <div className="hidden md:flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {(() => {
              const otherIds = activeThread.participant_ids.filter(id => id !== currentUserId)
              const other = getUserById(otherIds[0])!
              return (
                <>
                  <Link href={`/${other.username}`}>
                    <img src={other.avatar_url} alt="" className="h-[44px] w-[44px] rounded-full object-cover" />
                  </Link>
                  <div>
                    <Link href={`/${other.username}`} className="text-[14px] font-semibold block hover:opacity-60">
                      {activeThread.is_group ? activeThread.name : other.username}
                    </Link>
                    <p className="text-[12px] text-muted-foreground">Active now</p>
                  </div>
                </>
              )
            })()}
          </div>
          <div className="flex items-center gap-5">
            <button><Phone className="h-6 w-6" strokeWidth={1.75} /></button>
            <button><Video className="h-6 w-6" strokeWidth={1.75} /></button>
            <button><Info className="h-6 w-6" strokeWidth={1.75} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1 justify-end">
          <div className="flex flex-col gap-1">
            {threadMessages.map((msg, idx) => {
              const isMe = msg.sender_id === currentUserId
              const sender = getUserById(msg.sender_id)!
              const prevMsg = threadMessages[idx - 1]
              const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== msg.sender_id)

              return (
                <div key={msg.id} className={cn('flex items-end gap-2 group', isMe ? 'justify-end' : 'justify-start')}>
                  {!isMe && (
                    <div className="w-7 shrink-0 mb-1">
                      {showAvatar && (
                        <img src={sender.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[70%] rounded-[22px] px-4 py-2 text-[15px] leading-[20px]',
                    isMe
                      ? 'bg-[#0095f6] text-white rounded-br-[4px]'
                      : 'bg-[#efefef] dark:bg-[#262626] text-foreground rounded-bl-[4px]'
                  )}>
                    {msg.text}
                  </div>
                  {isMe && (
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <IgHeart size={16} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-3 border-t border-border">
          <button aria-label="Emoji">
            <IgEmoji size={24} className="text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-3 rounded-[22px] border border-border px-4 py-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Message…"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            {input && (
              <button
                onClick={handleSend}
                className="text-[14px] font-semibold text-[#0095f6] shrink-0"
              >
                Send
              </button>
            )}
          </div>
          {!input && (
            <>
              <button aria-label="Photo"><IgMessages size={24} className="text-foreground" /></button>
              <button aria-label="Like"><IgHeart size={24} className="text-foreground" /></button>
            </>
          )}
        </div>
      </div>

      {/* Empty state (desktop, no selection) */}
    </div>
  )
}
