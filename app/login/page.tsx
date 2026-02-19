'use client'

import { createClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const signIn = async () => {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={signIn}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  )
}
