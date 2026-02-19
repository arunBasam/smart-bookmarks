import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'


export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Logged in as: {user.email}</p>
      <form action="/auth/signout" method="post" className="mt-2">
  <button className="text-sm text-red-400 hover:underline">
    Logout
  </button>
</form>


      <AddBookmark />
      <BookmarkList />

    </div>
  )
}
