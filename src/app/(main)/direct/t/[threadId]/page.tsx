'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { DM_THREADS, getUserById } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ArrowLeft, Phone, Video, Info, Heart } from 'lucide-react'

export default function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params)
  const router = useRouter()
  const thread = DM_THREADS.find(t => t.id === threadId)
  const { dmMessages, sendDmMessage, currentUserId } = useStore()
  const [input, setInput] = useState('')

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Thread not found</p>
      </div>
    )
  }

  const otherIds = thread.participant_ids.filter(id => id !== currentUserId)
  const other = getUserById(otherIds[0])!
  const messages = dmMessages[thread.id] ?? thread.messages

  function handleSend() {
    if (!input.trim()) return
    sendDmMessage(thread!.id, currentUserId, input.trim())
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-49px)] md:h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img src={other.avatar_url} alt={other.username} className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold">{thread.is_group ? thread.name : other.username}</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button><Phone className="h-5 w-5" /></button>
          <button><Video className="h-5 w-5" /></button>
          <button><Info className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUserId
          const sender = getUserById(msg.sender_id)!
          return (
            <div key={msg.id} className={cn('flex items-end gap-2 group', isMe ? 'justify-end' : 'justify-start')}>
              {!isMe && <img src={sender.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover mb-1 shrink-0" />}
              <div className={cn(
                'max-w-[280px] rounded-3xl px-4 py-2.5 text-sm',
                isMe ? 'bg-[#0095f6] text-white rounded-br-md' : 'bg-accent text-foreground rounded-bl-md'
              )}>
                {msg.text}
              </div>
              {isMe && (
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
        <div className="flex-1 flex items-center gap-2 rounded-3xl border border-border px-4 py-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Message…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {input && (
          <button onClick={handleSend} className="text-[#0095f6] font-semibold text-sm">Send</button>
        )}
      </div>
    </div>
  )
}
