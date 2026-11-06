<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/auth'
import { listOwnJobs, setJobStatus, type Job } from '../lib/jobs'
import { formatGaji } from '../utils/format'

const auth = useAuth()

const jobs = ref<Job[]>([])
const loading = ref(false)
const loadError = ref('')
const actionError = ref('')
const busyJobId = ref<string | null>(null)

const canManage = computed(() => auth.profile.value?.role === 'usaha')

async function loadJobs() {
  const userId = auth.session.value?.user.id
  if (!userId || !canManage.value) return
  loading.value = true
  loadError.value = ''
  try {
    jobs.value = await listOwnJobs(userId)
  } catch {
    loadError.value = 'Lowongan belum bisa dimuat. Periksa koneksi lalu coba lagi.'
  } finally {
    loading.value = false
  }
}

async function toggleStatus(job: Job) {
  actionError.value = ''
  busyJobId.value = job.id
  try {
    await setJobStatus(job.id, job.status === 'aktif' ? 'ditutup' : 'aktif')
    await loadJobs()
  } catch {
    actionError.value = 'Status lowongan belum bisa diubah. Coba lagi.'
  } finally {
    busyJobId.value = null
  }
}

watch(
  () => [auth.ready.value, canManage.value] as const,
  ([ready]) => {
    if (ready) void loadJobs()
  },
  { immediate: true },
)
</script>

<template>
  <div class="container owner">
    <header class="page-header">
      <span class="eyebrow">Kelola Lowongan</span>
      <h1>Lowongan usahamu</h1>
      <p>Lowongan yang ditutup tidak tampil sebagai lowongan aktif, tetapi tetap tersimpan di sini.</p>
    </header>

    <p v-if="!auth.ready.value" class="muted">Memuat akun...</p>

    <section v-else-if="!auth.session.value" class="card notice">
      <p>Masuk sebagai pemilik usaha untuk mengelola lowongan.</p>
      <RouterLink to="/masuk?redirect=/kelola-lowongan" class="btn btn-primary">Masuk</RouterLink>
    </section>

    <section v-else-if="!canManage" class="card notice">
      <p>Halaman ini hanya untuk akun pemilik usaha.</p>
    </section>

    <template v-else>
      <div class="toolbar">
        <RouterLink to="/kelola-lowongan/baru" class="btn btn-primary">Pasang lowongan baru</RouterLink>
      </div>

      <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
      <p v-if="loading" class="muted" aria-live="polite">Memuat lowongan...</p>

      <div v-else-if="loadError" class="card notice">
        <p class="form-error" role="alert">{{ loadError }}</p>
        <button type="button" class="btn btn-outline" @click="loadJobs">Coba lagi</button>
      </div>

      <div v-else-if="!jobs.length" class="card notice">
        <p class="muted">Kamu belum memasang lowongan.</p>
      </div>

      <ul v-else class="job-list">
        <li v-for="job in jobs" :key="job.id" class="card job-row">
          <div class="job-main">
            <span v-if="job.status === 'aktif'" class="badge badge-success">Aktif</span>
            <span v-else class="badge badge-closed">Ditutup</span>
            <h3>{{ job.posisi }}</h3>
            <p class="muted small">{{ job.usaha }} &middot; {{ job.wilayah }}</p>
            <p class="small">{{ formatGaji(job) }}</p>
          </div>
          <div class="job-actions">
            <RouterLink :to="`/kelola-lowongan/${job.id}/ubah`" class="btn btn-outline">Ubah</RouterLink>
            <button
              type="button"
              class="btn btn-ghost"
              :disabled="busyJobId === job.id"
              @click="toggleStatus(job)"
            >
              {{ job.status === 'aktif' ? 'Tutup lowongan' : 'Aktifkan lagi' }}
            </button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.owner {
  padding-bottom: var(--space-6);
}

.toolbar {
  margin-bottom: var(--space-3);
}

.notice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
}

.job-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.job-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.job-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.job-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.form-error {
  color: var(--error-700);
  font-weight: 600;
}

.small {
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  .job-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
