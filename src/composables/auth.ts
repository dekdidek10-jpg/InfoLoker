import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type Role = 'pencari' | 'usaha' | 'mentor'

export interface Profile {
  id: string
  role: Role
  nama: string
  domisili: string
}

export interface AuthState {
  session: Ref<Session | null>
  profile: Ref<Profile | null>
  ready: Ref<boolean>
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AUTH_KEY: InjectionKey<AuthState> = Symbol('auth')

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, nama, domisili')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export function provideAuth(): AuthState {
  const session = ref<Session | null>(null)
  const profile = ref<Profile | null>(null)
  const ready = ref(false)

  async function refreshProfile() {
    const userId = session.value?.user.id
    if (!userId) {
      profile.value = null
      return
    }
    try {
      profile.value = await fetchProfile(userId)
    } catch {
      profile.value = null
    }
  }

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    session.value = nextSession
    void (async () => {
      await refreshProfile()
      ready.value = true
    })()
  })

  const state: AuthState = {
    session,
    profile,
    ready,
    refreshProfile,
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }
  provide(AUTH_KEY, state)
  return state
}

export function useAuth(): AuthState {
  const state = inject(AUTH_KEY)
  if (!state) throw new Error('useAuth dipanggil di luar provideAuth')
  return state
}
