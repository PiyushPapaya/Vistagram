'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/mock-data'
import { Camera } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const user = getCurrentUser()
  const [form, setForm] = useState({
    full_name: user.full_name,
    username: user.username,
    bio: user.bio ?? '',
    website: user.website ?? '',
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push(`/${user.username}`)
    }, 1000)
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6">Edit profile</h1>

      {/* Avatar section */}
      <div className="flex items-center gap-4 rounded-2xl bg-accent px-4 py-4 mb-6">
        <div className="relative">
          <img src={user.avatar_url} alt={user.username} className="h-14 w-14 rounded-full object-cover" />
          <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Camera className="h-5 w-5 text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-sm">{user.username}</p>
          <button className="text-[#0095f6] text-sm font-semibold">Change photo</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {[
          { label: 'Name', key: 'full_name' as const, placeholder: 'Name' },
          { label: 'Username', key: 'username' as const, placeholder: 'Username' },
          { label: 'Bio', key: 'bio' as const, placeholder: 'Bio', multiline: true },
          { label: 'Website', key: 'website' as const, placeholder: 'Website' },
        ].map(({ label, key, placeholder, multiline }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">{label}</label>
            {multiline ? (
              <textarea
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                rows={3}
                className="rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground resize-none placeholder:text-muted-foreground"
              />
            ) : (
              <input
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground"
              />
            )}
          </div>
        ))}

        {/* Gender selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold">Gender</label>
          <select className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none">
            <option>Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Custom</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
        >
          {saved ? 'Saved!' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
