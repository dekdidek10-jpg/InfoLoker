<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuth, type Role } from '../composables/auth'

type Mode = 'masuk' | 'daftar'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const mode = ref<Mode>('masuk')
const submitting = ref(false)
const formError = ref('')

const form = reactive({ nama: '', email: '', password: '', role: 'pencari' as Role })
const errors = reactive({ nama: '', email: '', password: '' })

const isSignedIn = computed(() => Boolean(auth.session.value))

function setMode(next: Mode) {
  mode.value = next
  formError.value = ''
  errors.nama = ''
  errors.email = ''
  errors.password = ''
}

function validate(): boolean {
  errors.nama =
    mode.value === 'daftar' && form.nama.trim().length < 3 ? 'Nama wajib diisi, minimal 3 huruf.' : ''
  errors.email = /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Isi alamat email yang benar.'
  errors.password = form.password.length >= 6 ? '' : 'Kata sandi minimal 6 karakter.'
  return !errors.nama && !errors.email && !errors.password
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (/already registered/i.test(message)) return 'Email ini sudah terdaftar. Silakan masuk.'
  if (/invalid login credentials/i.test(message)) return 'Email atau kata sandi salah.'
  return 'Terjadi kesalahan. Periksa koneksi lalu coba lagi.'
}

function destinationAfterSignIn(): string {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) return redirect
  return auth.profile.value?.role === 'usaha' ? '/kelola-lowongan' : '/'
}

async function submit() {
  formError.value = ''
  if (!validate()) return

  const email = form.email.trim()
  submitting.value = true
  try {
    if (mode.value === 'masuk') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: form.password })
      if (error) throw error
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password: form.password })
      if (error) throw error
      if (!data.user) throw new Error('Akun tidak dibuat')
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role: form.role,
        nama: form.nama.trim(),
      })
      if (profileError) throw profileError
    }
    await auth.refreshProfile()
    await router.push(destinationAfterSignIn())
  } catch (error) {
    formError.value = errorMessage(error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container auth">
    <header class="page-header">
      <span class="eyebrow">Akun</span>
      <h1>{{ mode === 'masuk' ? 'Masuk ke akunmu' : 'Buat akun baru' }}</h1>
      <p>Pemilik usaha memakai akun untuk memasang dan mengubah lowongan sendiri.</p>
    </header>

    <section v-if="isSignedIn" class="card auth-card">
      <p>Kamu sudah masuk. Lanjutkan ke halaman utama atau keluar dari menu di atas.</p>
      <RouterLink to="/" class="btn btn-primary">Ke halaman utama</RouterLink>
    </section>

    <section v-else class="card auth-card">
      <div class="tabs" role="group" aria-label="Pilih masuk atau daftar">
        <button
          type="button"
          class="tab"
          :class="{ 'is-active': mode === 'masuk' }"
          :aria-pressed="mode === 'masuk'"
          @click="setMode('masuk')"
        >
          Masuk
        </button>
        <button
          type="button"
          class="tab"
          :class="{ 'is-active': mode === 'daftar' }"
          :aria-pressed="mode === 'daftar'"
          @click="setMode('daftar')"
        >
          Daftar
        </button>
      </div>

      <form class="form" novalidate @submit.prevent="submit">
        <div v-if="mode === 'daftar'" class="field">
          <label for="auth-nama">Nama lengkap</label>
          <input
            id="auth-nama"
            v-model="form.nama"
            class="input"
            :class="{ 'is-invalid': errors.nama }"
            :aria-invalid="Boolean(errors.nama)"
            aria-describedby="err-auth-nama"
            autocomplete="name"
          />
          <span v-if="errors.nama" id="err-auth-nama" class="field-error">{{ errors.nama }}</span>
        </div>

        <div v-if="mode === 'daftar'" class="field">
          <span class="field-label">Saya ingin</span>
          <label class="radio">
            <input v-model="form.role" type="radio" value="pencari" />
            <span>Mencari pekerjaan dan belajar skill</span>
          </label>
          <label class="radio">
            <input v-model="form.role" type="radio" value="usaha" />
            <span>Memasang lowongan sebagai pemilik usaha</span>
          </label>
        </div>

        <div class="field">
          <label for="auth-email">Email</label>
          <input
            id="auth-email"
            v-model="form.email"
            class="input"
            type="email"
            :class="{ 'is-invalid': errors.email }"
            :aria-invalid="Boolean(errors.email)"
            aria-describedby="err-auth-email"
            autocomplete="email"
          />
          <span v-if="errors.email" id="err-auth-email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="field">
          <label for="auth-password">Kata sandi</label>
          <input
            id="auth-password"
            v-model="form.password"
            class="input"
            type="password"
            :class="{ 'is-invalid': errors.password }"
            :aria-invalid="Boolean(errors.password)"
            aria-describedby="err-auth-password"
            :autocomplete="mode === 'masuk' ? 'current-password' : 'new-password'"
          />
          <span v-if="errors.password" id="err-auth-password" class="field-error">{{ errors.password }}</span>
        </div>

        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>

        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Memproses...' : mode === 'masuk' ? 'Masuk' : 'Daftar' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.auth {
  max-width: 480px;
  padding-bottom: var(--space-6);
}

.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1);
  padding: 4px;
  border-radius: 999px;
  background: var(--neutral-100);
}

.tab {
  min-height: 40px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--neutral-900);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tab.is-active {
  background: var(--neutral-0);
  color: var(--primary-700);
  box-shadow: var(--shadow);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field-label {
  font-weight: 600;
  font-size: 0.9375rem;
}

.radio {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 40px;
  cursor: pointer;
}

.form-error {
  color: var(--error-700);
  font-weight: 600;
}
</style>
