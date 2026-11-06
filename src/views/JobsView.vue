<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { activeJobs, JOB_TYPES, WILAYAH } from '../data/demo'
import JobCard from '../components/JobCard.vue'

const route = useRoute()

function queryText(key: string): string {
  const value = route.query[key]
  return typeof value === 'string' ? value : ''
}

const keyword = ref(queryText('q'))
const wilayah = ref(queryText('wilayah'))
const tipe = ref('')

const results = computed(() => {
  const term = keyword.value.trim().toLowerCase()
  return activeJobs().filter((job) => {
    const matchesTerm =
      !term ||
      job.posisi.toLowerCase().includes(term) ||
      job.usaha.toLowerCase().includes(term) ||
      job.bidang.toLowerCase().includes(term)
    const matchesWilayah = !wilayah.value || job.wilayah === wilayah.value
    const matchesTipe = !tipe.value || job.tipe === tipe.value
    return matchesTerm && matchesWilayah && matchesTipe
  })
})

function resetFilters() {
  keyword.value = ''
  wilayah.value = ''
  tipe.value = ''
}
</script>

<template>
  <div class="container">
    <header class="page-header">
      <span class="eyebrow">Peluang Kerja</span>
      <h1>Cari pekerjaan di sekitar kamu</h1>
      <p>Setiap lowongan menampilkan syarat, jam kerja, dan kisaran pendapatan supaya kamu bisa memutuskan dengan jelas.</p>
    </header>

    <div class="demo-banner" role="note">
      <span>Semua lowongan di halaman ini adalah contoh untuk demonstrasi, bukan lowongan nyata.</span>
    </div>

    <section class="filters card" aria-label="Filter lowongan">
      <div class="field">
        <label for="filter-keyword">Kata kunci</label>
        <input id="filter-keyword" v-model="keyword" class="input" type="search" placeholder="Posisi, usaha, atau bidang" />
      </div>
      <div class="field">
        <label for="filter-wilayah">Wilayah</label>
        <select id="filter-wilayah" v-model="wilayah" class="input">
          <option value="">Semua wilayah</option>
          <option v-for="area in WILAYAH" :key="area" :value="area">{{ area }}</option>
        </select>
      </div>
      <div class="field">
        <label for="filter-tipe">Tipe kerja</label>
        <select id="filter-tipe" v-model="tipe" class="input">
          <option value="">Semua tipe</option>
          <option v-for="item in JOB_TYPES" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
    </section>

    <div class="results-head">
      <p class="muted" aria-live="polite">{{ results.length }} lowongan aktif</p>
      <button type="button" class="btn btn-ghost" @click="resetFilters">Atur ulang filter</button>
    </div>

    <section v-if="results.length" class="grid grid-3 results-grid">
      <JobCard v-for="job in results" :key="job.id" :job="job" />
    </section>

    <div v-else class="card empty-state">
      <h3>Belum ada lowongan yang cocok</h3>
      <p class="muted">Coba kata kunci lain atau atur ulang filter.</p>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 1fr;
  margin-bottom: var(--space-3);
}

.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.results-grid {
  padding-bottom: var(--space-6);
}

.empty-state {
  text-align: center;
  margin-bottom: var(--space-6);
}

@media (min-width: 768px) {
  .filters {
    grid-template-columns: 2fr 1fr 1fr;
  }
}
</style>
