'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { getUserByUsername } from '@/lib/mock-data'
import { StoryViewer } from '@/components/stories/story-viewer'

export default function StoriesPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()

  const user = getUserByUsername(username)
  if (!user) {
    router.replace('/')
    return null
  }

  return <StoryViewer key={user.id} userId={user.id} />
}
