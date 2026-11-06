<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { bidangList, jobsForSkill, skills } from '../data/demo'
import { formatRupiah } from '../utils/format'

const selectedBidang = ref('')
const requested = ref<Set<string>>(new Set())

const visibleSkills = computed(() =>
  selectedBidang.value ? skills.filter((skill) => skill.bidang === selectedBidang.value) : skills,
)

function requestSession(skillId: string) {
  requested.value = new Set([...requested.value, skillId])
}
</script>

<template>
  <div class="container">
    <header class="page-header">
      <span class="eyebrow">Belajar Skill</span>
      <h1>Pelajari skill yang dicari pemberi kerja</h1>
      <p>Setiap skill terhubung dengan lowongan yang membutuhkannya, sehingga kamu tahu manfaat belajarnya.</p>
    </header>

    <div class="demo-banner" role="note">
      <span>Mentor dan pengalaman di halaman ini adalah contoh untuk demonstrasi. Pelatihan ini meningkatkan kesiapan kerja, tetapi tidak menjamin diterima kerja.</span>
    </div>

    <div class="chip-row filter-row" role="group" aria-label="Filter bidang">
      <button
        type="button"
        class="filter-chip"
        :class="{ 'is-active': selectedBidang === '' }"
        :aria-pressed="selectedBidang === ''"
        @click="selectedBidang = ''"
      >
        Semua bidang
      </button>
      <button
        v-for="bidang in bidangList"
        :key="bidang"
        type="button"
        class="filter-chip"
        :class="{ 'is-active': selectedBidang === bidang }"
        :aria-pressed="selectedBidang === bidang"
        @click="selectedBidang = bidang"
      >
        {{ bidang }}
      </button>
    </div>

    <section class="grid grid-2 skill-grid">
      <article v-for="skill in visibleSkills" :id="skill.id" :key="skill.id" class="card skill-card">
        <div class="badge-row">
          <span class="badge badge-secondary">{{ skill.bidang }}</span>
          <span class="badge badge-demo">Mentor contoh</span>
        </div>
        <h3>{{ skill.nama }}</h3>
        <p>{{ skill.deskripsi }}</p>

        <dl class="facts">
          <div>
            <dt>Durasi</dt>
            <dd>{{ skill.durasi }}</dd>
          </div>
          <div>
            <dt>Format</dt>
            <dd>{{ skill.format }}</dd>
          </div>
          <div>
            <dt>Harga</dt>
            <dd>{{ formatRupiah(skill.harga) }}</dd>
          </div>
          <div>
            <dt>Mentor</dt>
            <dd>{{ skill.mentor }}, {{ skill.pengalaman }}</dd>
          </div>
        </dl>

        <div class="needed">
          <span class="muted small">Skill ini dibutuhkan oleh:</span>
          <ul v-if="jobsForSkill(skill.id).length" class="needed-list">
            <li v-for="job in jobsForSkill(skill.id)" :key="job.id">
              <RouterLink :to="`/peluang-kerja/${job.id}`">{{ job.posisi }}, {{ job.wilayah }}</RouterLink>
            </li>
          </ul>
          <p v-else class="muted small">Belum ada lowongan aktif.</p>
        </div>

        <button
          type="button"
          class="btn btn-outline request-btn"
          :disabled="requested.has(skill.id)"
          @click="requestSession(skill.id)"
        >
          {{ requested.has(skill.id) ? 'Permintaan jadwal dicatat (simulasi)' : 'Minta jadwal sesi' }}
        </button>
      </article>
    </section>
  </div>
</template>

<style scoped>
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.filter-row {
  margin-bottom: var(--space-3);
}

.filter-chip {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--neutral-200);
  background: var(--neutral-0);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--primary-500);
}

.filter-chip.is-active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: var(--neutral-0);
}

.skill-grid {
  padding-bottom: var(--space-6);
}

.skill-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  scroll-margin-top: 120px;
}

.facts {
  margin: 0;
  display: grid;
  gap: var(--space-1);
  grid-template-columns: 1fr;
}

.facts div {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: var(--space-1);
}

.facts dt {
  color: var(--neutral-500);
  font-size: 0.9375rem;
}

.facts dd {
  margin: 0;
  font-weight: 600;
}

.needed {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.needed-list {
  margin: 0;
  padding-left: 20px;
}

.request-btn {
  margin-top: auto;
  align-self: flex-start;
}

.small {
  font-size: 0.875rem;
}
</style>
