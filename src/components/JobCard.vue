<script setup lang="ts">
import type { Job } from '../lib/jobs'
import { RouterLink } from 'vue-router'
import { formatGaji } from '../utils/format'

defineProps<{ job: Job }>()
</script>

<template>
  <article class="card job-card">
    <div class="job-card-top">
      <span class="badge badge-demo">Data demo</span>
      <span class="badge badge-secondary">{{ job.tipe }}</span>
    </div>
    <h3>{{ job.posisi }}</h3>
    <p class="muted">{{ job.usaha }} &middot; {{ job.wilayah }}</p>
    <p class="job-salary">{{ formatGaji(job) }}</p>
    <p v-if="job.gajiEstimasi" class="muted small">Nominal ini estimasi.</p>
    <RouterLink :to="`/peluang-kerja/${job.id}`" class="btn btn-outline job-card-action">
      Lihat detail
    </RouterLink>
  </article>
</template>

<style scoped>
.job-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.job-card-top {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.job-salary {
  font-weight: 600;
  color: var(--neutral-900);
}

.small {
  font-size: 0.875rem;
}

.job-card-action {
  margin-top: auto;
  align-self: flex-start;
}
</style>
