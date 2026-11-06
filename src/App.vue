
<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { provideAuth } from './composables/auth'

const auth = provideAuth()
const router = useRouter()

// Memeriksa status login
const isSignedIn = computed(() => {
  return Boolean(auth.session.value)
})

// Daftar navigasi
const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/peluang-kerja', label: 'Peluang Kerja' },
    { to: '/map', label: 'Map' },
    { to: '/belajar-skill', label: 'Belajar Skill' },
  ]

  if (auth.profile.value?.role === 'usaha') {
    items.push({
      to: '/kelola-lowongan',
      label: 'Kelola Lowongan',
    })
  }

  items.push({
    to: '/profil',
    label: 'Profil',
  })

  return items
})

// Logout
async function signOut() {
  try {
    await auth.signOut()
    await router.push('/')
  } catch (error) {
    console.error('Gagal keluar:', error)
  }
}
</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="container header-row">
        <RouterLink to="/" class="brand">
          Jalur Kerja
        </RouterLink>

        <nav class="main-nav" aria-label="Navigasi utama">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
          >
            {{ item.label }}
          </RouterLink>

          <RouterLink
            v-if="!isSignedIn"
            to="/masuk"
            class="nav-link"
          >
            Masuk
          </RouterLink>

          <button
            v-else
            type="button"
            class="nav-link nav-button"
            @click="signOut"
          >
            Keluar
          </button>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="container footer-row">
        <p class="muted">
          Jalur Kerja membantu lulusan SMA/SMK menemukan
          kerja dan belajar skill di sekitar rumah.
        </p>

        <div class="footer-links">
          <RouterLink to="/tentang">
            Tentang dan lapor
          </RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
