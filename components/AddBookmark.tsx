'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function AddBookmark() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

 const addBookmark = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const supabase = createClient()

  // get logged user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    alert('Not logged in')
    setLoading(false)
    return
  }

  const { error } = await supabase.from('bookmarks').insert({
    title,
    url,
    user_id: user.id   // ⭐ REQUIRED FOR RLS
  })

  if (error) {
    alert(error.message)
  } else {
    setTitle('')
    setUrl('')
  }

  setLoading(false)
}


  return (
    <form onSubmit={addBookmark} className="space-y-3 mt-6">
    <input
  type="text"
  placeholder="Title"
  className="border border-gray-600 bg-gray-900 text-white placeholder-gray-400 p-2 w-full rounded"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
/>

<input
  type="url"
  placeholder="https://example.com"
  className="border border-gray-600 bg-gray-900 text-white placeholder-gray-400 p-2 w-full rounded"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  required
/>


      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}
