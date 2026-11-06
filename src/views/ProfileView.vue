<script setup lang="ts">
import { reactive, ref } from 'vue'
import { WILAYAH } from '../data/demo'

const ROLES = ['Pencari kerja dan pembelajar', 'Mentor atau pemilik usaha'] as const

const form = reactive({
  nama: 'Nama Kamu',
  domisili: 'Ubud',
  peran: ROLES[0],
  tentang: 'Lulusan SMA yang ingin bekerja sambil belajar keterampilan baru.',
})

const errors = reactive<Record<keyof typeof form, string>>({
  nama: '',
  domisili: '',
  peran: '',
  tentang: '',
})

const saved = ref(false)

function validate(): boolean {
  errors.nama = form.nama.trim().length < 3 ? 'Nama wajib diisi, minimal 3 huruf.' : ''
  errors.domisili = WILAYAH.includes(form.domisili as (typeof WILAYAH)[number])
    ? ''
    : 'Pilih domisili dari daftar.'
  errors.peran = ROLES.includes(form.peran) ? '' : 'Pilih peran yang sesuai.'
  errors.tentang = form.tentang.length > 200 ? 'Maksimal 200 karakter.' : ''
  return !errors.nama && !errors.domisili && !errors.peran && !errors.tentang
}

function saveProfile() {
  saved.value = validate()
}

function onEdit() {
  saved.value = false
}
</script>

<template>
  <div class="container profile">
    <header class="page-header">
      <span class="eyebrow">Profil</span>
      <h1>Profil kamu</h1>
      <p>Informasi ini membantu usaha dan mentor mengenalmu sebelum menghubungi.</p>
    </header>

    <div class="profile-grid">
      <section class="card identity">
        <div class="avatar" aria-hidden="true">{{ form.nama.trim().charAt(0).toUpperCase() || '?' }}</div>
        <h2>{{ form.nama }}</h2>
        <p class="muted">{{ form.domisili }}</p>
        <p class="role-badge">{{ form.peran }}</p>
        <p class="tentang">{{ form.tentang }}</p>
      </section>

      <section class="card">
        <h2 class="form-title">Ubah profil</h2>
        <form class="form" novalidate @submit.prevent="saveProfile" @input="onEdit">
          <div class="field">
            <label for="profile-nama">Nama lengkap</label>
            <input
              id="profile-nama"
              v-model="form.nama"
              class="input"
              :class="{ 'is-invalid': errors.nama }"
              :aria-invalid="Boolean(errors.nama)"
              aria-describedby="err-nama"
              autocomplete="name"
            />
            <span v-if="errors.nama" id="err-nama" class="field-error">{{ errors.nama }}</span>
          </div>

          <div class="field">
            <label for="profile-domisili">Domisili</label>
            <select
              id="profile-domisili"
              v-model="form.domisili"
              class="input"
              :class="{ 'is-invalid': errors.domisili }"
              :aria-invalid="Boolean(errors.domisili)"
              aria-describedby="err-domisili"
            >
              <option v-for="area in WILAYAH" :key="area" :value="area">{{ area }}</option>
            </select>
            <span v-if="errors.domisili" id="err-domisili" class="field-error">{{ errors.domisili }}</span>
          </div>

          <div class="field">
            <label for="profile-peran">Peran</label>
            <select
              id="profile-peran"
              v-model="form.peran"
              class="input"
              :class="{ 'is-invalid': errors.peran }"
              :aria-invalid="Boolean(errors.peran)"
              aria-describedby="err-peran"
            >
              <option v-for="role in ROLES" :key="role" :value="role">{{ role }}</option>
            </select>
            <span v-if="errors.peran" id="err-peran" class="field-error">{{ errors.peran }}</span>
          </div>

          <div class="field">
            <label for="profile-tentang">Deskripsi singkat</label>
            <textarea
              id="profile-tentang"
              v-model="form.tentang"
              class="input"
              :class="{ 'is-invalid': errors.tentang }"
              :aria-invalid="Boolean(errors.tentang)"
              aria-describedby="err-tentang"
            />
            <span v-if="errors.tentang" id="err-tentang" class="field-error">{{ errors.tentang }}</span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Simpan profil</button>
            <p v-if="saved" class="saved-note" role="status">
              Profil diperbarui di halaman ini. Penyimpanan permanen belum aktif pada versi contoh ini.
            </p>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile {
  padding-bottom: var(--space-6);
}

.profile-grid {
  display: grid;
  gap: var(--space-3);
}

.identity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  align-self: start;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--primary-500);
  color: var(--neutral-0);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.role-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--secondary-100);
  color: var(--secondary-700);
  font-weight: 600;
  font-size: 0.875rem;
}

.tentang {
  color: var(--neutral-900);
}

.form-title {
  font-size: 1.25rem;
  margin-bottom: var(--space-2);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
}

.saved-note {
  color: var(--success-700);
  font-weight: 600;
}

@media (min-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr 2fr;
  }
}
</style>
