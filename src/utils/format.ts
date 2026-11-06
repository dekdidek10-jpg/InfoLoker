import type { Job } from '../lib/jobs'

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`
}

export function formatGaji(job: Job): string {
  return `${formatRupiah(job.gajiMin)} - ${formatRupiah(job.gajiMax)} ${job.satuanGaji}`
}
