'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CURRENT_USER_ID,
  DEFAULT_FOLLOWING,
  DEFAULT_LIKED_POSTS,
  DEFAULT_SAVED_POSTS,
  NOTIFICATIONS,
  DM_THREADS,
  type DmMessage,
  type Notification,
} from './mock-data'

interface AppStore {
  // Auth
  currentUserId: string
  isLoggedIn: boolean
  login: (userId: string) => void
  logout: () => void

  // Social graph
  following: string[]
  follow: (userId: string) => void
  unfollow: (userId: string) => void
  isFollowing: (userId: string) => boolean

  // Post interactions
  likedPosts: string[]
  toggleLike: (postId: string) => void
  isLiked: (postId: string) => boolean

  savedPosts: string[]
  toggleSave: (postId: string) => void
  isSaved: (postId: string) => boolean

  // Stories viewed
  viewedStories: string[]
  markStoryViewed: (storyId: string) => void
  isStoryViewed: (storyId: string) => boolean

  // UI state
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  createOpen: boolean
  setCreateOpen: (v: boolean) => void
  activeStoryUserId: string | null
  setActiveStoryUserId: (id: string | null) => void
  activePostId: string | null
  setActivePostId: (id: string | null) => void

  // Notifications
  notifications: Notification[]
  markAllNotificationsRead: () => void
  unreadNotificationsCount: () => number

  // DMs
  dmMessages: Record<string, DmMessage[]>
  sendDmMessage: (threadId: string, senderId: string, text: string) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentUserId: CURRENT_USER_ID,
      isLoggedIn: true,
      login: (userId) => set({ currentUserId: userId, isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),

      following: DEFAULT_FOLLOWING,
      follow: (userId) => set(s => ({ following: [...s.following, userId] })),
      unfollow: (userId) => set(s => ({ following: s.following.filter(id => id !== userId) })),
      isFollowing: (userId) => get().following.includes(userId),

      likedPosts: DEFAULT_LIKED_POSTS,
      toggleLike: (postId) => set(s => ({
        likedPosts: s.likedPosts.includes(postId)
          ? s.likedPosts.filter(id => id !== postId)
          : [...s.likedPosts, postId],
      })),
      isLiked: (postId) => get().likedPosts.includes(postId),

      savedPosts: DEFAULT_SAVED_POSTS,
      toggleSave: (postId) => set(s => ({
        savedPosts: s.savedPosts.includes(postId)
          ? s.savedPosts.filter(id => id !== postId)
          : [...s.savedPosts, postId],
      })),
      isSaved: (postId) => get().savedPosts.includes(postId),

      viewedStories: [],
      markStoryViewed: (id) => set(s => ({
        viewedStories: s.viewedStories.includes(id) ? s.viewedStories : [...s.viewedStories, id],
      })),
      isStoryViewed: (id) => get().viewedStories.includes(id),

      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      createOpen: false,
      setCreateOpen: (v) => set({ createOpen: v }),
      activeStoryUserId: null,
      setActiveStoryUserId: (id) => set({ activeStoryUserId: id }),
      activePostId: null,
      setActivePostId: (id) => set({ activePostId: id }),

      notifications: NOTIFICATIONS,
      markAllNotificationsRead: () => set(s => ({
        notifications: s.notifications.map(n => ({ ...n, read: true })),
      })),
      unreadNotificationsCount: () => get().notifications.filter(n => !n.read).length,

      dmMessages: Object.fromEntries(DM_THREADS.map(t => [t.id, t.messages])),
      sendDmMessage: (threadId, senderId, text) => set(s => ({
        dmMessages: {
          ...s.dmMessages,
          [threadId]: [
            ...(s.dmMessages[threadId] ?? []),
            {
              id: `msg-${Date.now()}`,
              thread_id: threadId,
              sender_id: senderId,
              text,
              created_at: new Date().toISOString(),
            },
          ],
        },
      })),
    }),
    {
      name: 'vistagram-store',
      partialize: (s) => ({
        following: s.following,
        likedPosts: s.likedPosts,
        savedPosts: s.savedPosts,
        viewedStories: s.viewedStories,
        notifications: s.notifications,
        dmMessages: s.dmMessages,
      }),
    }
  )
)
