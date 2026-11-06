<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { activeJobs, WILAYAH, type Job } from '../data/demo'
import { formatGaji } from '../utils/format'

const ALL = ''
const selectedWilayah = ref(ALL)
const selectedJobId = ref<string | null>(null)

const markerJobs = computed(() =>
  activeJobs().filter((job) => selectedWilayah.value === ALL || job.wilayah === selectedWilayah.value),
)

const selectedJob = computed<Job | undefined>(() =>
  markerJobs.value.find((job) => job.id === selectedJobId.value),
)

function selectMarker(job: Job) {
  selectedJobId.value = job.id
}

function chooseWilayah(area: string) {
  selectedWilayah.value = area
  selectedJobId.value = null
}
</script>

<template>
  <div class="container">
    <header class="page-header">
      <span class="eyebrow">Map</span>
      <h1>Temukan peluang di wilayahmu</h1>
      <p>Pilih wilayah, lalu klik penanda untuk melihat ringkasan lowongan di sana.</p>
    </header>

    <div class="demo-banner" role="note">
      <span>Ini tampilan contoh. Posisi penanda adalah ilustrasi, bukan koordinat sebenarnya, dan belum memakai layanan peta.</span>
    </div>

    <div class="area-row" role="group" aria-label="Pilih wilayah">
      <button
        type="button"
        class="area-chip"
        :class="{ 'is-active': selectedWilayah === ALL }"
        :aria-pressed="selectedWilayah === ALL"
        @click="chooseWilayah(ALL)"
      >
        Semua wilayah
      </button>
      <button
        v-for="area in WILAYAH"
        :key="area"
        type="button"
        class="area-chip"
        :class="{ 'is-active': selectedWilayah === area }"
        :aria-pressed="selectedWilayah === area"
        @click="chooseWilayah(area)"
      >
        {{ area }}
      </button>
    </div>

    <div class="map-layout">
      <div class="map-board" role="region" aria-label="Peta penanda lowongan contoh">
        <button
          v-for="job in markerJobs"
          :key="job.id"
          type="button"
          class="marker"
          :class="{ 'is-selected': job.id === selectedJobId }"
          :style="{ left: `${job.peta.x}%`, top: `${job.peta.y}%` }"
          :aria-label="`${job.posisi}, ${job.wilayah}`"
          :aria-pressed="job.id === selectedJobId"
          @click="selectMarker(job)"
        />
      </div>

      <aside class="side-panel">
        <div v-if="selectedJob" class="card summary" aria-live="polite">
          <span class="badge badge-demo">Data demo</span>
          <h3>{{ selectedJob.posisi }}</h3>
          <p class="muted">{{ selectedJob.usaha }} &middot; {{ selectedJob.wilayah }}</p>
          <p class="summary-salary">{{ formatGaji(selectedJob) }}</p>
          <RouterLink :to="`/peluang-kerja/${selectedJob.id}`" class="btn btn-primary">Lihat detail</RouterLink>
        </div>
        <div v-else class="card summary">
          <p class="muted">Klik penanda di peta untuk melihat ringkasan lowongan.</p>
        </div>

        <h2 class="list-title">Lowongan di wilayah ini</h2>
        <ul v-if="markerJobs.length" class="job-list">
          <li v-for="job in markerJobs" :key="job.id">
            <button type="button" class="job-item" :class="{ 'is-selected': job.id === selectedJobId }" @click="selectMarker(job)">
              <strong>{{ job.posisi }}</strong>
              <span class="muted small">{{ job.usaha }}, {{ job.wilayah }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="muted">Belum ada lowongan aktif di wilayah ini.</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.area-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.area-chip {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--neutral-200);
  background: var(--neutral-0);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.area-chip:hover {
  border-color: var(--primary-500);
}

.area-chip.is-active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: var(--neutral-0);
}

.map-layout {
  display: grid;
  gap: var(--space-3);
  padding-bottom: var(--space-6);
}

.map-board {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  border: 1px solid var(--neutral-200);
  background:
    linear-gradient(var(--neutral-200) 1px, transparent 1px) 0 0 / 12.5% 25%,
    linear-gradient(90deg, var(--neutral-200) 1px, transparent 1px) 0 0 / 12.5% 25%,
    var(--primary-50);
  overflow: hidden;
}

.marker {
  position: absolute;
  width: 28px;
  height: 28px;
  transform: translate(-50%, -50%);
  border-radius: 50% 50% 50% 0;
  rotate: -45deg;
  border: 3px solid var(--neutral-0);
  background: var(--primary-500);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.marker:hover {
  transform: translate(-50%, -50%) scale(1.15);
}

.marker.is-selected {
  background: var(--accent-500);
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: flex-start;
}

.summary-salary {
  font-weight: 600;
}

.list-title {
  font-size: 1.125rem;
}

.job-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.job-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: var(--space-1) var(--space-2);
  border-radius: 10px;
  border: 1px solid var(--neutral-200);
  background: var(--neutral-0);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.job-item:hover,
.job-item.is-selected {
  border-color: var(--primary-500);
}

.small {
  font-size: 0.875rem;
}

@media (min-width: 900px) {
  .map-layout {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}
</style>
