'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import { getUserByUsername } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileGrid } from '@/components/profile/profile-grid'

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const user = getUserByUsername(username)
  const { currentUserId } = useStore()

  if (!user) notFound()

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[935px]">
        <ProfileHeader user={user} isOwn={user.id === currentUserId} />
        <ProfileGrid user={user} />
      </div>
    </div>
  )
}
