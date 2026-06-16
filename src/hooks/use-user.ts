'use client'

import { getCurrentUser } from '@/lib/mock-data'
import type { User as MockUser } from '@/lib/mock-data'

export function useUser() {
  const profile = getCurrentUser()
  return { user: profile, profile, loading: false }
}
