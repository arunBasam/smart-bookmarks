'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const supabase = createClient()

  // fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setBookmarks(data)
  }

  // delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  useEffect(() => {
    fetchBookmarks()

    let channel: any

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchBookmarks()
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="mt-8 space-y-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <a
              href={b.url}
              target="_blank"
              className="text-blue-400 underline font-medium"
            >
              {b.title}
            </a>
            <p className="text-sm text-gray-400">{b.url}</p>
          </div>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
