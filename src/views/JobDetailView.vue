<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { findJob, findSkill, type Skill } from '../data/demo'
import { formatGaji, formatRupiah } from '../utils/format'

const props = defineProps<{ id: string }>()

const job = computed(() => findJob(props.id))
const linkedSkills = computed<Skill[]>(() =>
  (job.value?.skillIds ?? []).map(findSkill).filter((skill): skill is Skill => Boolean(skill)),
)

const isSaved = ref(false)
const showContact = ref(false)
</script>

<template>
  <div class="container detail">
    <RouterLink to="/peluang-kerja" class="back-link">Kembali ke daftar lowongan</RouterLink>

    <div v-if="!job" class="card">
      <h1>Lowongan tidak ditemukan</h1>
      <p class="muted">Lowongan ini mungkin sudah dihapus atau alamatnya salah.</p>
    </div>

    <template v-else>
      <div class="demo-banner" role="note">
        <span>Lowongan contoh untuk demonstrasi. Nominal dan kontak tidak nyata.</span>
      </div>

      <header class="detail-head">
        <div class="badge-row">
          <span class="badge badge-demo">Data demo</span>
          <span class="badge badge-secondary">{{ job.tipe }}</span>
          <span v-if="job.status === 'aktif'" class="badge badge-success">Aktif</span>
          <span v-else class="badge badge-closed">Ditutup</span>
        </div>
        <h1>{{ job.posisi }}</h1>
        <p class="muted">{{ job.usaha }} &middot; {{ job.wilayah }}</p>
      </header>

      <div v-if="job.status === 'ditutup'" class="closed-notice" role="status">
        Lowongan ini sudah ditutup dan tidak menerima lamaran baru.
      </div>

      <div class="detail-grid">
        <div class="detail-main">
          <section class="card block">
            <h2>Deskripsi</h2>
            <p>{{ job.deskripsi }}</p>
          </section>

          <section class="card block">
            <h2>Syarat</h2>
            <ul class="list">
              <li v-for="item in job.syarat" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section class="card block">
            <h2>Tugas</h2>
            <ul class="list">
              <li v-for="item in job.tugas" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section class="card block">
            <h2>Skill yang dibutuhkan</h2>
            <p v-if="!linkedSkills.length" class="muted">Belum ada skill yang ditandai.</p>
            <div v-else class="chip-row">
              <RouterLink
                v-for="skill in linkedSkills"
                :key="skill.id"
                :to="{ path: '/belajar-skill', hash: `#${skill.id}` }"
                class="chip"
              >
                {{ skill.nama }}
              </RouterLink>
            </div>
          </section>
        </div>

        <aside class="detail-side card">
          <div class="side-item">
            <span class="muted small">Pendapatan</span>
            <strong>{{ formatGaji(job) }}</strong>
            <span v-if="job.gajiEstimasi" class="muted small">Nominal ini estimasi.</span>
          </div>
          <div class="side-item">
            <span class="muted small">Jam kerja</span>
            <strong>{{ job.jamKerja }}</strong>
          </div>
          <div class="side-item">
            <span class="muted small">Lokasi</span>
            <strong>{{ job.wilayah }}</strong>
          </div>
          <div class="side-item">
            <span class="muted small">Bidang</span>
            <strong>{{ job.bidang }}</strong>
          </div>
          <div class="side-item">
            <span class="muted small">Kisaran gaji minimum</span>
            <strong>{{ formatRupiah(job.gajiMin) }}</strong>
          </div>

          <div class="side-actions">
            <button
              type="button"
              class="btn"
              :class="isSaved ? 'btn-outline' : 'btn-primary'"
              :aria-pressed="isSaved"
              @click="isSaved = !isSaved"
            >
              {{ isSaved ? 'Lowongan tersimpan' : 'Simpan lowongan' }}
            </button>
            <button
              v-if="job.status === 'aktif'"
              type="button"
              class="btn btn-accent"
              :aria-expanded="showContact"
              @click="showContact = !showContact"
            >
              Hubungi pemberi kerja
            </button>
            <p v-if="showContact" class="contact-box">
              {{ job.kontak }}
              <span class="muted small">Ini kontak contoh. Tombol ini hanya simulasi.</span>
            </p>
          </div>
          <p class="small muted">
            Lowongan bermasalah? Laporkan lewat halaman <RouterLink to="/tentang">Tentang dan lapor</RouterLink>.
          </p>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail {
  padding-top: var(--space-3);
  padding-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.back-link {
  font-weight: 600;
  align-self: flex-start;
}

.detail-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.closed-notice {
  padding: var(--space-2);
  border-radius: var(--radius);
  background: var(--error-100);
  color: var(--error-700);
  font-weight: 600;
}

.detail-grid {
  display: grid;
  gap: var(--space-3);
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.block h2 {
  font-size: 1.25rem;
  margin-bottom: var(--space-1);
}

.list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.chip {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--secondary-100);
  color: var(--secondary-700);
  font-weight: 600;
}

.chip:hover {
  text-decoration: underline;
}

.detail-side {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-self: start;
}

.side-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.side-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.contact-box {
  padding: var(--space-2);
  border-radius: 10px;
  background: var(--primary-50);
  color: var(--neutral-900);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.small {
  font-size: 0.875rem;
}

@media (min-width: 900px) {
  .detail-grid {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
