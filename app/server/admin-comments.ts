import { createServerFn } from '@tanstack/react-start'

/**
 * Moderation of the comments under the articles, which live in the suite's
 * chat service: a post waits until an admin here approves or rejects it.
 */

export type PendingComment = {
  room: string
  seq: number
  author: string
  body: string
  createdAt: string
  /** `dir:locale` of the article, as the room's subject names it. */
  article: string
  title: string
}

const FORBIDDEN = 'forbidden'

export async function countPendingComments(): Promise<number> {
  const { chatTenantConfigured, listPendingPosts } = await import('./chat-service')
  if (!chatTenantConfigured) return 0
  try {
    return (await listPendingPosts()).posts.length
  } catch (err) {
    console.error('[comments] pending count', err)
    return 0
  }
}

export const listPendingComments = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ configured: boolean; comments: PendingComment[] }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { chatTenantConfigured, listPendingPosts } = await import('./chat-service')
    if (!chatTenantConfigured) return { configured: false, comments: [] }

    const comments: PendingComment[] = []
    let cursor: string | undefined
    do {
      const page = await listPendingPosts(cursor)
      for (const p of page.posts) {
        comments.push({
          room: p.room,
          seq: p.seq,
          author: p.sender_handle,
          body: p.body,
          createdAt: p.created_at,
          article: p.room_subject?.id ?? '',
          title: p.room_title ?? '',
        })
      }
      cursor = page.next
    } while (cursor)

    return { configured: true, comments }
  },
)

export const reviewComment = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { room: string; seq: number; decision: 'approve' | 'reject' }) => d,
  )
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { moderatePost } = await import('./chat-service')
    await moderatePost(data.room, data.seq, data.decision)
    return { ok: true }
  })
