<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { activeJobs, bidangList, skills, WILAYAH } from '../data/demo'
import JobCard from '../components/JobCard.vue'

const router = useRouter()
const keyword = ref('')
const wilayah = ref('')

const latestJobs = activeJobs().slice(0, 3)

function submitSearch() {
  router.push({
    path: '/peluang-kerja',
    query: {
      ...(keyword.value.trim() ? { q: keyword.value.trim() } : {}),
      ...(wilayah.value ? { wilayah: wilayah.value } : {}),
    },
  })
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero-inner">
        <span class="eyebrow">Untuk lulusan SMA dan SMK</span>
        <h1>Belum diterima kuliah? Kamu tetap punya langkah berikutnya.</h1>
        <p class="hero-lead">
          Temukan pekerjaan di sekitar rumah, lihat skill yang dibutuhkan, dan belajar dari mentor lokal.
        </p>

        <form class="search-form card" role="search" @submit.prevent="submitSearch">
          <div class="field">
            <label for="search-keyword">Kata kunci</label>
            <input
              id="search-keyword"
              v-model="keyword"
              class="input"
              type="search"
              placeholder="Contoh: admin, barista, menjahit"
            />
          </div>
          <div class="field">
            <label for="search-wilayah">Wilayah</label>
            <select id="search-wilayah" v-model="wilayah" class="input">
              <option value="">Semua wilayah</option>
              <option v-for="area in WILAYAH" :key="area" :value="area">{{ area }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Cari Peluang Kerja</button>
        </form>

        <div class="hero-actions">
          <RouterLink to="/belajar-skill" class="btn btn-accent">Temukan Skill</RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Bidang yang sedang dicari</h2>
        </div>
        <div class="chip-row">
          <RouterLink
            v-for="bidang in bidangList"
            :key="bidang"
            to="/belajar-skill"
            class="chip"
          >
            {{ bidang }} ({{ skills.filter((s) => s.bidang === bidang).length }} skill)
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section section-tint">
      <div class="container">
        <div class="section-head">
          <h2>Peluang kerja terbaru</h2>
          <RouterLink to="/peluang-kerja">Lihat semua</RouterLink>
        </div>
        <div class="grid grid-3">
          <JobCard v-for="job in latestJobs" :key="job.id" :job="job" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: var(--space-6) 0 var(--space-4);
  background: linear-gradient(180deg, var(--primary-50) 0%, var(--neutral-50) 100%);
}

.hero-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hero-lead {
  font-size: 1.125rem;
  color: var(--neutral-500);
  max-width: 56ch;
}

.search-form {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 1fr;
  margin-top: var(--space-2);
}

.search-form .btn {
  width: 100%;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.section-tint {
  background: var(--neutral-100);
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.chip {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  color: var(--neutral-900);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.chip:hover {
  border-color: var(--primary-500);
  background: var(--primary-50);
  text-decoration: none;
}

@media (min-width: 768px) {
  .search-form {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }

  .search-form .btn {
    width: auto;
  }
}
</style>
