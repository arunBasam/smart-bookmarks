'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const signIn = async () => {
  const supabase = createClient()

  const origin = window.location.origin

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
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
