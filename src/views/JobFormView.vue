<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/auth'
import {
  createJob,
  getJob,
  JOB_TYPES,
  updateJob,
  WILAYAH,
  type JobInput,
  type JobStatus,
  type JobType,
} from '../lib/jobs'
import { bidangList, skills } from '../data/demo'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const auth = useAuth()

const SATUAN_GAJI = ['per bulan', 'per minggu', 'per hari', 'per jam']

const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)
const submitError = ref('')

const canManage = computed(() => auth.profile.value?.role === 'usaha')

const form = reactive({
  posisi: '',
  usaha: '',
  wilayah: '',
  bidang: '',
  tipe: '' as '' | JobType,
  gajiMin: '',
  gajiMax: '',
  gajiEstimasi: false,
  satuanGaji: 'per bulan',
  jamKerja: '',
  deskripsi: '',
  syarat: '',
  tugas: '',
  kontak: '',
  status: 'aktif' as JobStatus,
  skillIds: [] as string[],
})

const errors = reactive<Record<string, string>>({
  posisi: '',
  usaha: '',
  wilayah: '',
  bidang: '',
  tipe: '',
  gajiMin: '',
  gajiMax: '',
  jamKerja: '',
  deskripsi: '',
  syarat: '',
  kontak: '',
})

function lines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function validate(): JobInput | null {
  const gajiMin = Number(form.gajiMin)
  const gajiMax = Number(form.gajiMax)

  errors.posisi = form.posisi.trim() ? '' : 'Isi nama posisi.'
  errors.usaha = form.usaha.trim() ? '' : 'Isi nama usaha.'
  errors.wilayah = WILAYAH.includes(form.wilayah as (typeof WILAYAH)[number]) ? '' : 'Pilih wilayah dari daftar.'
  errors.bidang = bidangList.includes(form.bidang) ? '' : 'Pilih bidang dari daftar.'
  errors.tipe = JOB_TYPES.includes(form.tipe as JobType) ? '' : 'Pilih tipe kerja.'
  errors.gajiMin =
    form.gajiMin.trim() !== '' && Number.isInteger(gajiMin) && gajiMin >= 0
      ? ''
      : 'Isi gaji minimum dengan angka bulat.'
  errors.gajiMax =
    form.gajiMax.trim() !== '' && Number.isInteger(gajiMax) && gajiMax >= gajiMin
      ? ''
      : 'Isi gaji maksimum dengan angka yang tidak lebih kecil dari minimum.'
  errors.jamKerja = form.jamKerja.trim() ? '' : 'Isi jam kerja.'
  errors.deskripsi = form.deskripsi.trim() ? '' : 'Isi deskripsi pekerjaan.'
  errors.syarat = lines(form.syarat).length ? '' : 'Isi minimal satu syarat, satu baris untuk setiap syarat.'
  errors.kontak = form.kontak.trim() ? '' : 'Isi kontak yang bisa dihubungi pelamar.'

  if (Object.values(errors).some(Boolean)) return null

  return {
    posisi: form.posisi.trim(),
    usaha: form.usaha.trim(),
    wilayah: form.wilayah,
    bidang: form.bidang,
    tipe: form.tipe as JobType,
    gajiMin,
    gajiMax,
    gajiEstimasi: form.gajiEstimasi,
    satuanGaji: form.satuanGaji,
    deskripsi: form.deskripsi.trim(),
    syarat: lines(form.syarat),
    tugas: lines(form.tugas),
    jamKerja: form.jamKerja.trim(),
    status: form.status,
    kontak: form.kontak.trim(),
    skillIds: [...form.skillIds],
  }
}

async function loadJob(id: string) {
  loading.value = true
  loadError.value = ''
  try {
    const job = await getJob(id)
    if (!job || job.ownerId !== auth.session.value?.user.id) {
      loadError.value = 'Lowongan tidak ditemukan atau bukan milikmu.'
      return
    }
    form.posisi = job.posisi
    form.usaha = job.usaha
    form.wilayah = job.wilayah
    form.bidang = job.bidang
    form.tipe = job.tipe
    form.gajiMin = String(job.gajiMin)
    form.gajiMax = String(job.gajiMax)
    form.gajiEstimasi = job.gajiEstimasi
    form.satuanGaji = job.satuanGaji
    form.jamKerja = job.jamKerja
    form.deskripsi = job.deskripsi
    form.syarat = job.syarat.join('\n')
    form.tugas = job.tugas.join('\n')
    form.kontak = job.kontak
    form.status = job.status
    form.skillIds = [...job.skillIds]
  } catch {
    loadError.value = 'Lowongan belum bisa dimuat. Coba lagi.'
  } finally {
    loading.value = false
  }
}

async function submit() {
  submitError.value = ''
  const input = validate()
  if (!input) return

  submitting.value = true
  try {
    if (props.id) {
      await updateJob(props.id, input)
    } else {
      await createJob(input)
    }
    await router.push('/kelola-lowongan')
  } catch {
    submitError.value = 'Lowongan belum bisa disimpan. Periksa koneksi lalu coba lagi.'
  } finally {
    submitting.value = false
  }
}

watch(
  () => [auth.ready.value, canManage.value, props.id] as const,
  ([ready, allowed, id]) => {
    if (ready && allowed && id) void loadJob(id)
  },
  { immediate: true },
)
</script>

<template>
  <div class="container job-form-page">
    <RouterLink to="/kelola-lowongan" class="back-link">Kembali ke daftar lowongan</RouterLink>

    <header class="page-header">
      <span class="eyebrow">Kelola Lowongan</span>
      <h1>{{ props.id ? 'Ubah lowongan' : 'Pasang lowongan baru' }}</h1>
      <p>Isi informasi yang dibaca pelamar. Kisaran gaji dan syarat sebaiknya dituliskan apa adanya.</p>
    </header>

    <p v-if="!auth.ready.value" class="muted">Memuat akun...</p>

    <section v-else-if="!auth.session.value" class="card notice">
      <p>Masuk sebagai pemilik usaha untuk memasang lowongan.</p>
      <RouterLink to="/masuk" class="btn btn-primary">Masuk</RouterLink>
    </section>

    <section v-else-if="!canManage" class="card notice">
      <p>Halaman ini hanya untuk akun pemilik usaha.</p>
    </section>

    <p v-else-if="loading" class="muted" aria-live="polite">Memuat lowongan...</p>

    <section v-else-if="loadError" class="card notice">
      <p class="form-error" role="alert">{{ loadError }}</p>
    </section>

    <form v-else class="card job-form" novalidate @submit.prevent="submit">
      <div class="form-grid">
        <div class="field">
          <label for="job-posisi">Posisi</label>
          <input id="job-posisi" v-model="form.posisi" class="input" :class="{ 'is-invalid': errors.posisi }" :aria-invalid="Boolean(errors.posisi)" aria-describedby="err-posisi" />
          <span v-if="errors.posisi" id="err-posisi" class="field-error">{{ errors.posisi }}</span>
        </div>

        <div class="field">
          <label for="job-usaha">Nama usaha</label>
          <input id="job-usaha" v-model="form.usaha" class="input" :class="{ 'is-invalid': errors.usaha }" :aria-invalid="Boolean(errors.usaha)" aria-describedby="err-usaha" />
          <span v-if="errors.usaha" id="err-usaha" class="field-error">{{ errors.usaha }}</span>
        </div>

        <div class="field">
          <label for="job-wilayah">Wilayah</label>
          <select id="job-wilayah" v-model="form.wilayah" class="input" :class="{ 'is-invalid': errors.wilayah }" :aria-invalid="Boolean(errors.wilayah)" aria-describedby="err-wilayah">
            <option value="" disabled>Pilih wilayah</option>
            <option v-for="area in WILAYAH" :key="area" :value="area">{{ area }}</option>
          </select>
          <span v-if="errors.wilayah" id="err-wilayah" class="field-error">{{ errors.wilayah }}</span>
        </div>

        <div class="field">
          <label for="job-bidang">Bidang</label>
          <select id="job-bidang" v-model="form.bidang" class="input" :class="{ 'is-invalid': errors.bidang }" :aria-invalid="Boolean(errors.bidang)" aria-describedby="err-bidang">
            <option value="" disabled>Pilih bidang</option>
            <option v-for="item in bidangList" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="errors.bidang" id="err-bidang" class="field-error">{{ errors.bidang }}</span>
        </div>

        <div class="field">
          <label for="job-tipe">Tipe kerja</label>
          <select id="job-tipe" v-model="form.tipe" class="input" :class="{ 'is-invalid': errors.tipe }" :aria-invalid="Boolean(errors.tipe)" aria-describedby="err-tipe">
            <option value="" disabled>Pilih tipe</option>
            <option v-for="item in JOB_TYPES" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="errors.tipe" id="err-tipe" class="field-error">{{ errors.tipe }}</span>
        </div>

        <div class="field">
          <label for="job-status">Status</label>
          <select id="job-status" v-model="form.status" class="input">
            <option value="aktif">Aktif</option>
            <option value="ditutup">Ditutup</option>
          </select>
        </div>

        <div class="field">
          <label for="job-gaji-min">Gaji minimum (Rp)</label>
          <input id="job-gaji-min" v-model="form.gajiMin" class="input" type="number" min="0" inputmode="numeric" :class="{ 'is-invalid': errors.gajiMin }" :aria-invalid="Boolean(errors.gajiMin)" aria-describedby="err-gaji-min" />
          <span v-if="errors.gajiMin" id="err-gaji-min" class="field-error">{{ errors.gajiMin }}</span>
        </div>

        <div class="field">
          <label for="job-gaji-max">Gaji maksimum (Rp)</label>
          <input id="job-gaji-max" v-model="form.gajiMax" class="input" type="number" min="0" inputmode="numeric" :class="{ 'is-invalid': errors.gajiMax }" :aria-invalid="Boolean(errors.gajiMax)" aria-describedby="err-gaji-max" />
          <span v-if="errors.gajiMax" id="err-gaji-max" class="field-error">{{ errors.gajiMax }}</span>
        </div>

        <div class="field">
          <label for="job-satuan">Satuan pembayaran</label>
          <select id="job-satuan" v-model="form.satuanGaji" class="input">
            <option v-for="item in SATUAN_GAJI" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <label class="checkbox">
          <input v-model="form.gajiEstimasi" type="checkbox" />
          <span>Nominal gaji ini hanya estimasi</span>
        </label>

        <div class="field full">
          <label for="job-jam">Jam kerja</label>
          <input id="job-jam" v-model="form.jamKerja" class="input" :class="{ 'is-invalid': errors.jamKerja }" :aria-invalid="Boolean(errors.jamKerja)" aria-describedby="err-jam" />
          <span v-if="errors.jamKerja" id="err-jam" class="field-error">{{ errors.jamKerja }}</span>
        </div>

        <div class="field full">
          <label for="job-deskripsi">Deskripsi pekerjaan</label>
          <textarea id="job-deskripsi" v-model="form.deskripsi" class="input" :class="{ 'is-invalid': errors.deskripsi }" :aria-invalid="Boolean(errors.deskripsi)" aria-describedby="err-deskripsi" />
          <span v-if="errors.deskripsi" id="err-deskripsi" class="field-error">{{ errors.deskripsi }}</span>
        </div>

        <div class="field full">
          <label for="job-syarat">Syarat (satu baris untuk setiap syarat)</label>
          <textarea id="job-syarat" v-model="form.syarat" class="input" :class="{ 'is-invalid': errors.syarat }" :aria-invalid="Boolean(errors.syarat)" aria-describedby="err-syarat" />
          <span v-if="errors.syarat" id="err-syarat" class="field-error">{{ errors.syarat }}</span>
        </div>

        <div class="field full">
          <label for="job-tugas">Tugas (satu baris untuk setiap tugas)</label>
          <textarea id="job-tugas" v-model="form.tugas" class="input" />
        </div>

        <div class="field full">
          <label for="job-kontak">Kontak untuk pelamar</label>
          <input id="job-kontak" v-model="form.kontak" class="input" :class="{ 'is-invalid': errors.kontak }" :aria-invalid="Boolean(errors.kontak)" aria-describedby="err-kontak" />
          <span v-if="errors.kontak" id="err-kontak" class="field-error">{{ errors.kontak }}</span>
        </div>

        <fieldset class="field full skill-fieldset">
          <legend>Skill yang dibutuhkan</legend>
          <label v-for="skill in skills" :key="skill.id" class="checkbox">
            <input v-model="form.skillIds" type="checkbox" :value="skill.id" />
            <span>{{ skill.nama }}</span>
          </label>
        </fieldset>
      </div>

      <p v-if="submitError" class="form-error" role="alert">{{ submitError }}</p>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Menyimpan...' : 'Simpan lowongan' }}
        </button>
        <RouterLink to="/kelola-lowongan" class="btn btn-ghost">Batal</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.job-form-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-bottom: var(--space-6);
}

.back-link {
  font-weight: 600;
  align-self: flex-start;
}

.job-form-page .page-header {
  padding-top: 0;
}

.notice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
}

.job-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.form-grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 1fr;
}

.full {
  grid-column: 1 / -1;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-height: 40px;
  font-weight: 600;
  cursor: pointer;
}

.skill-fieldset {
  border: 1px solid var(--neutral-200);
  border-radius: 10px;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.skill-fieldset legend {
  font-weight: 600;
  padding: 0 4px;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.form-error {
  color: var(--error-700);
  font-weight: 600;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
