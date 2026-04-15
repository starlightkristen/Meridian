import { supabase } from './supabase'

export const signIn = (email) =>
  supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

export const onAuthChange = (cb) => supabase.auth.onAuthStateChange(cb)

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}
