import { supabase } from './supabase'

export type JobType = 'Penuh waktu' | 'Paruh waktu' | 'Harian'
export type JobStatus = 'aktif' | 'ditutup'

export const WILAYAH = ['Gianyar', 'Sukawati', 'Ubud', 'Blahbatuh', 'Tampaksiring'] as const

export const JOB_TYPES: JobType[] = ['Penuh waktu', 'Paruh waktu', 'Harian']

export interface Job {
  id: string
  ownerId: string | null
  isDemo: boolean
  posisi: string
  usaha: string
  wilayah: string
  bidang: string
  tipe: JobType
  gajiMin: number
  gajiMax: number
  gajiEstimasi: boolean
  satuanGaji: string
  deskripsi: string
  syarat: string[]
  tugas: string[]
  jamKerja: string
  status: JobStatus
  kontak: string
  skillIds: string[]
  peta: { x: number; y: number } | null
}

export type JobInput = Omit<Job, 'id' | 'ownerId' | 'isDemo' | 'peta'>

interface JobRow {
  id: string
  owner_id: string | null
  is_demo: boolean
  posisi: string
  usaha: string
  wilayah: string
  bidang: string
  tipe: JobType
  gaji_min: number
  gaji_max: number
  gaji_estimasi: boolean
  satuan_gaji: string
  deskripsi: string
  syarat: string[]
  tugas: string[]
  jam_kerja: string
  status: JobStatus
  kontak: string
  skill_ids: string[]
  peta_x: number | null
  peta_y: number | null
}

const JOB_COLUMNS =
  'id, owner_id, is_demo, posisi, usaha, wilayah, bidang, tipe, gaji_min, gaji_max, gaji_estimasi, satuan_gaji, deskripsi, syarat, tugas, jam_kerja, status, kontak, skill_ids, peta_x, peta_y'

function toJob(row: JobRow): Job {
  return {
    id: row.id,
    ownerId: row.owner_id,
    isDemo: row.is_demo,
    posisi: row.posisi,
    usaha: row.usaha,
    wilayah: row.wilayah,
    bidang: row.bidang,
    tipe: row.tipe,
    gajiMin: row.gaji_min,
    gajiMax: row.gaji_max,
    gajiEstimasi: row.gaji_estimasi,
    satuanGaji: row.satuan_gaji,
    deskripsi: row.deskripsi,
    syarat: row.syarat,
    tugas: row.tugas,
    jamKerja: row.jam_kerja,
    status: row.status,
    kontak: row.kontak,
    skillIds: row.skill_ids,
    peta: row.peta_x !== null && row.peta_y !== null ? { x: row.peta_x, y: row.peta_y } : null,
  }
}

function toRow(input: JobInput) {
  return {
    posisi: input.posisi,
    usaha: input.usaha,
    wilayah: input.wilayah,
    bidang: input.bidang,
    tipe: input.tipe,
    gaji_min: input.gajiMin,
    gaji_max: input.gajiMax,
    gaji_estimasi: input.gajiEstimasi,
    satuan_gaji: input.satuanGaji,
    deskripsi: input.deskripsi,
    syarat: input.syarat,
    tugas: input.tugas,
    jam_kerja: input.jamKerja,
    status: input.status,
    kontak: input.kontak,
    skill_ids: input.skillIds,
  }
}

export async function listActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    .eq('status', 'aktif')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as JobRow[]).map(toJob)
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('jobs').select(JOB_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toJob(data as JobRow) : null
}

export async function listOwnJobs(ownerId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_COLUMNS)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as JobRow[]).map(toJob)
}

export async function createJob(input: JobInput): Promise<void> {
  const { error } = await supabase.from('jobs').insert(toRow(input))
  if (error) throw error
}

export async function updateJob(id: string, input: JobInput): Promise<void> {
  const { error } = await supabase.from('jobs').update(toRow(input)).eq('id', id)
  if (error) throw error
}

export async function setJobStatus(id: string, status: JobStatus): Promise<void> {
  const { error } = await supabase.from('jobs').update({ status }).eq('id', id)
  if (error) throw error
}
