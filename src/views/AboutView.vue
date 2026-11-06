
<script setup>
import { reactive, ref } from 'vue'

const report = reactive({
  target: 'Lowongan',
  alasan: '',
})

const reportError = ref('')
const reportSent = ref(false)

function submitReport() {
  if (report.alasan.trim().length < 10) {
    reportError.value = 'Tuliskan alasan laporan, minimal 10 karakter.'
    reportSent.value = false
    return
  }

  reportError.value = ''
  reportSent.value = true
  report.alasan = ''
}
</script>

<template>
  <div class="container about">
    <header class="page-header">
      <span class="eyebrow">Tentang</span>
      <h1>Tentang Jalur Kerja</h1>
      <p>
        Platform ini membantu lulusan SMA dan SMK menemukan peluang kerja,
        memahami syaratnya, dan belajar skill yang dibutuhkan.
      </p>
    </header>

    <div class="grid grid-2">
      <section class="card">
        <h2>Cara kerja</h2>

        <ol class="steps">
          <li>Cari peluang kerja di sekitar domisilimu.</li>
          <li>Baca syarat dan skill yang dibutuhkan.</li>
          <li>Belajar skill tersebut melalui mentor lokal.</li>
          <li>Hubungi pemberi kerja dan ajukan lamaran.</li>
        </ol>

        <p class="note">
          Belajar skill meningkatkan kesiapanmu, tetapi tidak menjamin
          diterima bekerja.
        </p>
      </section>

      <section class="card">
        <h2>Lapor lowongan atau mentor</h2>

        <p class="muted">
          Laporan kamu akan ditinjau untuk memastikan informasi
          lowongan dan mentor sesuai.
        </p>

        <form
          class="report-form"
          novalidate
          @submit.prevent="submitReport"
        >
          <div class="field">
            <label for="report-target">Yang dilaporkan</label>

            <select
              id="report-target"
              v-model="report.target"
              class="input"
            >
              <option>Lowongan</option>
              <option>Mentor</option>
              <option>Profil usaha</option>
            </select>
          </div>

          <div class="field">
            <label for="report-alasan">Alasan</label>

            <textarea
              id="report-alasan"
              v-model="report.alasan"
              class="input"
              :class="{ 'is-invalid': reportError }"
              :aria-invalid="Boolean(reportError)"
              aria-describedby="report-error"
              rows="4"
              placeholder="Tuliskan alasan laporan..."
            ></textarea>

            <span
              v-if="reportError"
              id="report-error"
              class="field-error"
              role="alert"
            >
              {{ reportError }}
            </span>
          </div>

          <button type="submit" class="btn btn-primary">
            Kirim laporan
          </button>

          <p
            v-if="reportSent"
            class="sent-note"
            role="status"
          >
            Laporan diterima sebagai simulasi. Pengiriman ke tim
            moderasi belum aktif pada versi contoh ini.
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding-bottom: var(--space-6);
}

.steps {
  margin: 0 0 var(--space-2);
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note {
  padding: var(--space-2);
  border-radius: 10px;
  background: var(--primary-50);
  color: var(--primary-700);
  font-weight: 600;
}

.report-form {
  margin-top: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.report-form .field {
  width: 100%;
}

.report-form .btn {
  align-self: flex-start;
}

.sent-note {
  color: var(--success-700);
  font-weight: 600;
}
</style>
