export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

/* ── Row types (use `type`, not `interface`, to satisfy Record<string,unknown>) ── */
export type ProfileRow = {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  is_private: boolean
  is_verified: boolean
  plan: 'free' | 'plus'
  created_at: string
  updated_at: string
}

export type PostRow = {
  id: string
  author_id: string
  type: 'image' | 'carousel' | 'reel'
  caption: string | null
  location_id: string | null
  music_id: string | null
  is_pinned: boolean
  scheduled_for: string | null
  created_at: string
}

export type MediaRow = {
  id: string
  post_id: string
  url: string
  type: 'image' | 'video'
  width: number | null
  height: number | null
  position: number
  alt_text: string | null
}

export type LikeRow = { user_id: string; post_id: string; created_at: string }

export type CommentRow = {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  text: string
  created_at: string
}

export type CommentLikeRow = { user_id: string; comment_id: string }

export type SaveRow = {
  user_id: string
  post_id: string
  collection_id: string | null
  created_at: string
}

export type SavedCollectionRow = {
  id: string
  user_id: string
  name: string
  created_at: string
}

export type FollowRow = {
  follower_id: string
  following_id: string
  status: 'accepted' | 'requested'
  created_at: string
}

export type CloseFriendRow = { user_id: string; friend_id: string }

export type StoryRow = {
  id: string
  author_id: string
  media_url: string
  type: 'image' | 'video'
  created_at: string
  expires_at: string
}

export type StoryViewRow = { story_id: string; viewer_id: string; viewed_at: string }

export type StoryStickerRow = {
  id: string
  story_id: string
  kind: 'poll' | 'quiz' | 'question' | 'music' | 'location' | 'mention'
  payload: Json
}

export type StoryStickerResponseRow = {
  id: string
  sticker_id: string
  user_id: string
  response: Json
  created_at: string
}

export type HighlightRow = {
  id: string
  user_id: string
  title: string
  cover_url: string | null
  created_at: string
}

export type HighlightItemRow = { highlight_id: string; story_id: string }

export type NoteRow = {
  id: string
  user_id: string
  text: string
  music_id: string | null
  bubble_color: string
  created_at: string
  expires_at: string
}

export type DmThreadRow = { id: string; is_group: boolean; name: string | null; created_at: string }
export type DmParticipantRow = { thread_id: string; user_id: string; last_read_at: string | null }

export type DmMessageRow = {
  id: string
  thread_id: string
  sender_id: string
  text: string | null
  media_url: string | null
  shared_post_id: string | null
  reply_to_id: string | null
  scheduled_for: string | null
  created_at: string
}

export type MessageReactionRow = { message_id: string; user_id: string; emoji: string }

export type NotificationRow = {
  id: string
  user_id: string
  actor_id: string
  type: 'like' | 'comment' | 'follow' | 'follow_request' | 'mention' | 'tag'
  entity_id: string | null
  read: boolean
  created_at: string
}

export type ReelRow = {
  id: string
  author_id: string
  video_url: string
  poster_url: string | null
  caption: string | null
  audio_label: string | null
  likes_count: number
  comments_count: number
  plays_count: number
  created_at: string
}

export type HashtagRow = { id: string; name: string }
export type PostHashtagRow = { post_id: string; hashtag_id: string }
export type LocationRow = { id: string; name: string; lat: number; lng: number }
export type UserTopicRow = { user_id: string; topic: string; weight: number }
export type ProductRow = { id: string; name: string; url: string; image: string | null }
export type PostProductRow = { post_id: string; product_id: string }

/* ── Supabase Database generic type ───────────────────── */
type TR<Row extends Record<string, unknown>, Ins, Upd> = {
  Row: Row
  Insert: Ins
  Update: Upd
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      profiles: TR<ProfileRow, Omit<ProfileRow, 'created_at' | 'updated_at'>, Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>>
      posts: TR<PostRow, Omit<PostRow, 'id' | 'created_at'>, Partial<Omit<PostRow, 'id' | 'created_at'>>>
      media: TR<MediaRow, Omit<MediaRow, 'id'>, Partial<Omit<MediaRow, 'id' | 'post_id'>>>
      likes: TR<LikeRow, Omit<LikeRow, 'created_at'>, Record<string, never>>
      comments: TR<CommentRow, Omit<CommentRow, 'id' | 'created_at'>, Partial<Pick<CommentRow, 'text'>>>
      comment_likes: TR<CommentLikeRow, CommentLikeRow, Record<string, never>>
      saves: TR<SaveRow, Omit<SaveRow, 'created_at'>, Record<string, never>>
      saved_collections: TR<SavedCollectionRow, Omit<SavedCollectionRow, 'id' | 'created_at'>, Partial<Pick<SavedCollectionRow, 'name'>>>
      follows: TR<FollowRow, Omit<FollowRow, 'created_at'>, Partial<Pick<FollowRow, 'status'>>>
      close_friends: TR<CloseFriendRow, CloseFriendRow, Record<string, never>>
      stories: TR<StoryRow, Omit<StoryRow, 'id' | 'created_at'>, Record<string, never>>
      story_views: TR<StoryViewRow, Omit<StoryViewRow, 'viewed_at'>, Record<string, never>>
      story_stickers: TR<StoryStickerRow, Omit<StoryStickerRow, 'id'>, Partial<Pick<StoryStickerRow, 'payload'>>>
      story_sticker_responses: TR<StoryStickerResponseRow, Omit<StoryStickerResponseRow, 'id' | 'created_at'>, Record<string, never>>
      highlights: TR<HighlightRow, Omit<HighlightRow, 'id' | 'created_at'>, Partial<Pick<HighlightRow, 'title' | 'cover_url'>>>
      highlight_items: TR<HighlightItemRow, HighlightItemRow, Record<string, never>>
      notes: TR<NoteRow, Omit<NoteRow, 'id' | 'created_at'>, Partial<Pick<NoteRow, 'text' | 'music_id' | 'bubble_color'>>>
      dm_threads: TR<DmThreadRow, Omit<DmThreadRow, 'id' | 'created_at'>, Partial<Pick<DmThreadRow, 'name'>>>
      dm_participants: TR<DmParticipantRow, DmParticipantRow, Partial<Pick<DmParticipantRow, 'last_read_at'>>>
      dm_messages: TR<DmMessageRow, Omit<DmMessageRow, 'id' | 'created_at'>, Partial<Pick<DmMessageRow, 'text'>>>
      message_reactions: TR<MessageReactionRow, MessageReactionRow, Record<string, never>>
      notifications: TR<NotificationRow, Omit<NotificationRow, 'id' | 'created_at'>, Partial<Pick<NotificationRow, 'read'>>>
      hashtags: TR<HashtagRow, Omit<HashtagRow, 'id'>, Record<string, never>>
      post_hashtags: TR<PostHashtagRow, PostHashtagRow, Record<string, never>>
      locations: TR<LocationRow, Omit<LocationRow, 'id'>, Partial<Omit<LocationRow, 'id'>>>
      user_topics: TR<UserTopicRow, UserTopicRow, Partial<Pick<UserTopicRow, 'weight'>>>
      products: TR<ProductRow, Omit<ProductRow, 'id'>, Partial<Omit<ProductRow, 'id'>>>
      post_products: TR<PostProductRow, PostProductRow, Record<string, never>>
      reels: TR<ReelRow, Omit<ReelRow, 'id' | 'created_at'>, Partial<Omit<ReelRow, 'id' | 'author_id' | 'created_at'>>>
    }
    Views: Record<string, {
      Row: Record<string, unknown>
      Relationships: []
    }>
    Functions: Record<string, {
      Args: Record<string, unknown>
      Returns: unknown
    }>
    Enums: {
      plan_type: 'free' | 'plus'
      follow_status: 'accepted' | 'requested'
      post_type: 'image' | 'carousel' | 'reel'
      notification_type: 'like' | 'comment' | 'follow' | 'follow_request' | 'mention' | 'tag'
      sticker_kind: 'poll' | 'quiz' | 'question' | 'music' | 'location' | 'mention'
    }
  }
}
