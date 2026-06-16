'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { USERS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function SearchPanel() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')

  const results = query.length > 0
    ? USERS.filter(u =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.full_name.toLowerCase().includes(query.toLowerCase())
      )
    : USERS.slice(0, 8)

  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  if (!searchOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={() => setSearchOpen(false)} />
      <aside className="fixed left-[72px] md:left-[244px] top-0 z-40 h-full w-[397px] border-r border-border bg-background shadow-2xl flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold mb-4">Search</h2>
          <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {query === '' && (
            <p className="px-6 pt-4 pb-2 text-sm font-semibold text-foreground">Suggested</p>
          )}
          {results.map(user => (
            <Link
              key={user.id}
              href={`/${user.username}`}
              onClick={() => setSearchOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
            >
              <img src={user.avatar_url} alt={user.username} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.full_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
