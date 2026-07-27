/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Kategori, Supplier, Unit, Satuan, Barang, BarangMasuk, BarangKeluar, Riwayat, AuditLog, SystemNotification, Settings, Pegawai, DriveFileItem } from './types';

export const INITIAL_KATEGORI: Kategori[] = [
  {
    id: '1010301001',
    nama: 'ALAT TULIS',
    deskripsi: 'Kebutuhan alat tulis kantor dan perlengkapan penulisan',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=1010301001'
  },
  {
    id: '1010301002',
    nama: 'TINTA TULIS, TINTA STEMPEL',
    deskripsi: 'Tinta printer, tinta stempel, dan cairan pengisi ulang',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=1010301002'
  },
  {
    id: '1010301003',
    nama: 'PENJEPIT KERTAS',
    deskripsi: 'Klip kertas, necis, isi necis, binder clip, dan stapler',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=1010301003'
  },
  {
    id: '1010301004',
    nama: 'PERALATAN KOMPUTER & IT',
    deskripsi: 'Hardware, flashdisk, mouse, peripheral, dan aksesoris IT',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=1010301004'
  },
  {
    id: '1010301005',
    nama: 'SARANA KEBERSIHAN & SANITASI',
    deskripsi: 'Pembersih lantai, hand sanitizer, tisu, dan sabun antiseptik',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=1010301005'
  }
];

export const INITIAL_SUPPLIER: Supplier[] = [
  { id: 'SUP-001', nama: 'CV Sriwijaya Abadi Jaya', kontak: 'Bpk. Ahmad Fauzi', telepon: '0812-7345-6789', alamat: 'Jl. Jenderal Sudirman No. 120, Palembang' },
  { id: 'SUP-002', nama: 'PT Tekno Mandiri Sumsel', kontak: 'Ibu Rina Lestari', telepon: '0813-8899-0011', alamat: 'Komplek Ruko Palembang Square Block B-4, Palembang' },
  { id: 'SUP-003', nama: 'Toko ATK Utama Jaya', kontak: 'Bpk. Hendra Wijaya', telepon: '0711-356789', alamat: 'Jl. Kolonel Atmo No. 45A, Palembang' },
  { id: 'SUP-004', nama: 'CV Indah Boga Catering', kontak: 'Ibu Hj. Aminah', telepon: '0821-4455-6677', alamat: 'Jl. Demang Lebar Daun No. 89, Palembang' }
];

export const INITIAL_UNIT: Unit[] = [
  { id: 'UNT-001', nama: 'Subbagian Umum', penanggungJawab: 'ILHAM MUHARRAMA', keterangan: 'Urusan persuratan, rumah tangga, kepegawaian, dan perlengkapan' },
  { id: 'UNT-002', nama: 'Fasilitasi Peningkatan Mutu (FPMP)', penanggungJawab: 'Ibu Dr. Hartati, M.Pd.', keterangan: 'Program penjaminan mutu pendidikan PAUD, SD, SMP, SMA' },
  { id: 'UNT-003', nama: 'Seksi Pemetaan & Supervisi', penanggungJawab: 'Bpk. Ir. Gunawan, M.Si.', keterangan: 'Urusan analisis pemetaan mutu dan pengawasan sekolah' },
  { id: 'UNT-004', nama: 'Seksi Kemitraan & Kerja Sama', penanggungJawab: 'Ibu Dian Safitri, S.E.', keterangan: 'Urusan kerja sama dengan Pemerintah Daerah dan dinas terkait' }
];

export const INITIAL_SATUAN: Satuan[] = [
  { id: 'SAT-001', nama: 'Rim', keterangan: 'Untuk kertas' },
  { id: 'SAT-002', nama: 'Box', keterangan: 'Kotak sedang berisi beberapa item' },
  { id: 'SAT-003', nama: 'Pcs', keterangan: 'Satuan per biji / pieces' },
  { id: 'SAT-004', nama: 'Dus', keterangan: 'Karton besar berisi volume banyak' },
  { id: 'SAT-005', nama: 'Unit', keterangan: 'Untuk peralatan elektronik / mesin' },
  { id: 'SAT-006', nama: 'Kotak', keterangan: 'Kemasan kotak kecil' }
];

export const INITIAL_BARANG: Barang[] = [
  // 1010301001: ALAT TULIS
  {
    id: '000001',
    kategoriId: '1010301001',
    kategori: 'ALAT TULIS',
    nama: 'Pena Click G2 Pilot',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak ATK - A1',
    stokSekarang: 25,
    stokMin: 5,
    stokMaks: 50,
    deskripsi: 'Pena gel hitam 0.5mm merk Pilot Click G2',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-07-15T10:30:00Z'
  },
  {
    id: '000002',
    kategoriId: '1010301001',
    kategori: 'ALAT TULIS',
    nama: 'Kertas HVS A4 80gr Sinar Dunia',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Rim',
    lokasiRak: 'Rak ATK - A2',
    stokSekarang: 45,
    stokMin: 15,
    stokMaks: 100,
    deskripsi: 'Kertas HVS putih ukuran A4 berat 80gr',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-10T08:15:00Z',
    updatedAt: '2026-07-18T14:20:00Z'
  },
  {
    id: '000003',
    kategoriId: '1010301001',
    kategori: 'ALAT TULIS',
    nama: 'Pulpen Standard AE7 Hitam',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak ATK - A3',
    stokSekarang: 12,
    stokMin: 5,
    stokMaks: 30,
    deskripsi: 'Pulpen Standard AE7 hitam 0.5mm',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-10T08:20:00Z',
    updatedAt: '2026-07-18T14:20:00Z'
  },

  // 1010301002: TINTA TULIS, TINTA STEMPEL
  {
    id: '000001',
    kategoriId: '1010301002',
    kategori: 'TINTA TULIS, TINTA STEMPEL',
    nama: 'Tinta Cao Press',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Pcs',
    lokasiRak: 'Rak Tinta - B1',
    stokSekarang: 15,
    stokMin: 3,
    stokMaks: 30,
    deskripsi: 'Tinta stempel Cao Press warna ungu',
    imageUrl: 'https://images.unsplash.com/photo-1585336261026-6757f541a674?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-11T09:00:00Z',
    updatedAt: '2026-07-19T10:00:00Z'
  },
  {
    id: '000002',
    kategoriId: '1010301002',
    kategori: 'TINTA TULIS, TINTA STEMPEL',
    nama: 'Tinta Stempel Yamura 50ml',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Pcs',
    lokasiRak: 'Rak Tinta - B2',
    stokSekarang: 8,
    stokMin: 2,
    stokMaks: 20,
    deskripsi: 'Tinta stempel isi ulang 50ml',
    imageUrl: 'https://images.unsplash.com/photo-1585336261026-6757f541a674?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-11T09:30:00Z',
    updatedAt: '2026-07-19T10:30:00Z'
  },

  // 1010301003: PENJEPIT KERTAS
  {
    id: '000001',
    kategoriId: '1010301003',
    kategori: 'PENJEPIT KERTAS',
    nama: 'NECIS NO.10 KECIL',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak Klip - C1',
    stokSekarang: 20,
    stokMin: 5,
    stokMaks: 40,
    deskripsi: 'Stapler/necis ukuran No.10 kecil',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T10:00:00Z',
    updatedAt: '2026-07-20T11:00:00Z'
  },
  {
    id: '000002',
    kategoriId: '1010301003',
    kategori: 'PENJEPIT KERTAS',
    nama: 'ISI NECIS NO. 10',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Kotak',
    lokasiRak: 'Rak Klip - C2',
    stokSekarang: 50,
    stokMin: 10,
    stokMaks: 100,
    deskripsi: 'Isi staples / necis ukuran No.10 Max',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T10:15:00Z',
    updatedAt: '2026-07-20T11:15:00Z'
  },
  {
    id: '000003',
    kategoriId: '1010301003',
    kategori: 'PENJEPIT KERTAS',
    nama: 'KLIP KERTAS',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak Klip - C3',
    stokSekarang: 30,
    stokMin: 5,
    stokMaks: 60,
    deskripsi: 'Paper clip / klip kertas nomor 3 Joyko',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T10:30:00Z',
    updatedAt: '2026-07-20T11:30:00Z'
  },
  {
    id: '000004',
    kategoriId: '1010301003',
    kategori: 'PENJEPIT KERTAS',
    nama: 'BINDER NO 111',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak Klip - C4',
    stokSekarang: 18,
    stokMin: 4,
    stokMaks: 40,
    deskripsi: 'Binder clip no. 111 hitam',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T10:45:00Z',
    updatedAt: '2026-07-20T11:45:00Z'
  },

  // 1010301004: PERALATAN KOMPUTER & IT
  {
    id: '000001',
    kategoriId: '1010301004',
    kategori: 'PERALATAN KOMPUTER & IT',
    nama: 'Flashdisk SanDisk Ultra 64GB USB 3.0',
    supplier: 'PT Tekno Mandiri Sumsel',
    satuan: 'Pcs',
    lokasiRak: 'Laci Elektronik - E1',
    stokSekarang: 2,
    stokMin: 5,
    stokMaks: 20,
    deskripsi: 'Flashdisk kecepatan tinggi USB 3.0',
    imageUrl: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T09:30:00Z',
    updatedAt: '2026-07-20T09:00:00Z'
  },
  {
    id: '000002',
    kategoriId: '1010301004',
    kategori: 'PERALATAN KOMPUTER & IT',
    nama: 'Mouse Wireless Logitech M170',
    supplier: 'PT Tekno Mandiri Sumsel',
    satuan: 'Pcs',
    lokasiRak: 'Laci Elektronik - E2',
    stokSekarang: 18,
    stokMin: 4,
    stokMaks: 25,
    deskripsi: 'Mouse wireless ergonomis',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T09:45:00Z',
    updatedAt: '2026-07-10T11:00:00Z'
  },

  // 1010301005: SARANA KEBERSIHAN & SANITASI
  {
    id: '000001',
    kategoriId: '1010301005',
    kategori: 'SARANA KEBERSIHAN & SANITASI',
    nama: 'Hand Sanitizer Gel Antis 500ml',
    supplier: 'CV Sriwijaya Abadi Jaya',
    satuan: 'Botol',
    lokasiRak: 'Gudang Kebersihan - D1',
    stokSekarang: 22,
    stokMin: 5,
    stokMaks: 50,
    deskripsi: 'Cairan pembersih tangan antiseptik 500ml botol pump',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-22T08:00:00Z',
    updatedAt: '2026-07-15T09:00:00Z'
  }
];

export const INITIAL_BARANG_MASUK: BarangMasuk[] = [
  {
    id: 'TRM-260710-01',
    tanggal: '2026-07-10T09:00:00Z',
    barangId: '000002',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 15,
    supplier: 'PT Tekno Mandiri Sumsel',
    petugas: 'Roni Setiawan (Petugas BMN)',
    fileDokumen: 'Faktur_Tekno_M170_signed.pdf',
    catatan: 'Pengadaan kuartal II untuk staf administrasi baru.'
  },
  {
    id: 'TRM-260715-01',
    tanggal: '2026-07-15T10:30:00Z',
    barangId: '000002',
    namaBarang: 'Kertas HVS A4 80gr Sinar Dunia',
    jumlah: 30,
    supplier: 'Toko ATK Utama Jaya',
    petugas: 'Roni Setiawan (Petugas BMN)',
    fileDokumen: 'DO_ATK_Kertas_A4_signed.pdf',
    catatan: 'Restock kertas habis untuk persiapan pelatihan guru.'
  }
];

export const INITIAL_BARANG_KELUAR: BarangKeluar[] = [
  {
    id: 'TRK-260711-01',
    tanggal: '2026-07-11T13:30:00Z',
    barangId: '000002',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 2,
    unitId: 'Subbagian Umum',
    petugas: 'Roni Setiawan (Petugas BMN)',
    keperluan: 'Pemberian fasilitas mouse baru untuk staf persuratan',
    statusPersetujuan: 'Disetujui',
    catatan: 'Disetujui oleh Kasubag Umum.'
  },
  {
    id: 'TRK-260718-01',
    tanggal: '2026-07-18T14:20:00Z',
    barangId: '000003',
    namaBarang: 'Pulpen Standard AE7 Hitam',
    jumlah: 3,
    unitId: 'Fasilitasi Peningkatan Mutu (FPMP)',
    petugas: 'Roni Setiawan (Petugas BMN)',
    keperluan: 'Kebutuhan menulis formulir penilaian peserta bimtek',
    statusPersetujuan: 'Disetujui',
    catatan: 'Serah terima di ruang FPMP.'
  }
];

export const INITIAL_RIWAYAT: Riwayat[] = [
  {
    id: 'TRM-260710-01',
    tanggal: '2026-07-10T09:00:00Z',
    tipe: 'Masuk',
    barangId: '000002',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 15,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Masuk dari PT Tekno Mandiri Sumsel'
  },
  {
    id: 'TRK-260711-01',
    tanggal: '2026-07-11T13:30:00Z',
    tipe: 'Keluar',
    barangId: '000002',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 2,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Keluar ke Unit Subbagian Umum'
  },
  {
    id: 'TRM-260710-01',
    tanggal: '2026-07-10T09:00:00Z',
    tipe: 'Masuk',
    barangId: '000002',
    namaBarang: 'Kertas HVS A4 80gr Sinar Dunia',
    jumlah: 30,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Masuk dari Toko ATK Utama Jaya'
  }
];

export const INITIAL_AUDIT_LOG: AuditLog[] = [
  { id: 'LOG-001', tanggal: '2026-07-20T08:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Login', detail: 'Sesi login dimulai pada peranti desktop Google Chrome' },
  { id: 'LOG-002', tanggal: '2026-07-20T09:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Transaksi Keluar', detail: 'Menginput pengajuan barang keluar Flashdisk SanDisk Ultra 64GB' },
  { id: 'LOG-003', tanggal: '2026-07-20T10:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Transaksi Masuk', detail: 'Berhasil memproses pencatatan barang masuk' },
  { id: 'LOG-004', tanggal: '2026-07-20T10:15:00Z', aktor: 'Drs. H. Syahidin, M.Si.', role: 'Kepala Subbagian', aksi: 'Persetujuan', detail: 'Melihat rincian pengajuan barang keluar Flashdisk SanDisk Ultra 64GB' }
];

export const INITIAL_NOTIFICATION: SystemNotification[] = [
  { id: 'NOT-001', tipe: 'stok_rendah', pesan: 'Stok barang "Flashdisk SanDisk Ultra 64GB USB 3.0" tersisa 2 Pcs (Stok minimum: 5).', tanggal: '2026-07-20T09:00:00Z', read: false, readByUsers: '', barangId: '000001' }
];

export const DEFAULT_SETTINGS: Settings = {
  namaInstitusi: 'BALAI PENJAMINAN MUTU PENDIDIKAN PROVINSI SUMATERA SELATAN',
  subHeaderKop: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
  alamatKop: 'Jl. Jenderal Sudirman Km. 6.5 Palembang Telp. (0711) 356789 Fax. 356790',
  kontakKop: 'Email: bpmp.sumsel@kemdikbud.go.id | Laman: bpmp-sumsel.kemdikbud.go.id',
  namaPenanggungJawab: 'Ilham Muharrama',
  jabatanPenanggungJawab: 'Magang/KP / Petugas BMN',
  nipPenanggungJawab: '-',
  logoUrl: '/logo.png',
  prefiksKodeBarang: 'BRG-',
  defaultStokMin: 5,
  autoSyncIntervalSec: 2,
  folderQrId: '1dr_qr_code_bpmp_sumsel_folder',
  folderImagesId: '1dr_images_bpmp_sumsel_folder',
  folderReportsId: '1dr_reports_bpmp_sumsel_folder',
  folderBackupId: '1dr_backup_bpmp_sumsel_folder',
  spreadsheetId: '1ss_bpmp_sumsel_inventory_database',
  bilaStokRendahNotif: true,
  bilaStokHabisNotif: true,
  konfirmasiOtomatisKeluar: true
};

export const INITIAL_PEGAWAI: Pegawai[] = [
  { id: 'PGW-001', nama: 'Roni Setiawan', jabatan: 'Petugas BMN', nip: '198804152014021003', telepon: '0812-7123-4567' },
  { id: 'PGW-002', nama: 'Ilham Muharrama', jabatan: 'Magang/KP', nip: '-', telepon: '08981741680' },
  { id: 'PGW-003', nama: 'Budi Hermawan', jabatan: 'Staf BMN', nip: '199112022019031005', telepon: '0821-8899-7711' },
  { id: 'PGW-004', nama: 'Drs. H. Sunardi, M.Pd.', jabatan: 'Pimpinan / Kepala BPMP', nip: '196703081992031003', telepon: '0812-7345-9988' },
  { id: 'PGW-005', nama: 'Siti Aminah, S.E.', jabatan: 'Staf Administrasi BMN', nip: '199305142020012003', telepon: '0813-6677-8899' },
  { id: 'PGW-006', nama: 'Heri Prasetyo', jabatan: 'Staf Inventarisasi BMN', nip: '198911102016031001', telepon: '0812-5544-3322' }
];

export const INITIAL_DRIVE_FILES: DriveFileItem[] = [
  {
    id: 'DRV-001',
    name: 'Faktur_Tekno_M170_signed.pdf',
    folder: 'Reports',
    size: '245 KB',
    type: 'application/pdf',
    uploadedAt: '2026-07-10T09:00:00Z',
    uploadedBy: 'Roni Setiawan (Petugas BMN)'
  },
  {
    id: 'DRV-002',
    name: 'DO_ATK_Kertas_A4_signed.pdf',
    folder: 'Reports',
    size: '180 KB',
    type: 'application/pdf',
    uploadedAt: '2026-07-15T10:30:00Z',
    uploadedBy: 'Roni Setiawan (Petugas BMN)'
  },
  {
    id: 'DRV-003',
    name: 'Inv_Boga_Wahana_signed.pdf',
    folder: 'Reports',
    size: '310 KB',
    type: 'application/pdf',
    uploadedAt: '2026-07-20T10:00:00Z',
    uploadedBy: 'Roni Setiawan (Petugas BMN)'
  },
  {
    id: 'DRV-004',
    name: 'QR_Code_Katalog_BMN_All.zip',
    folder: 'QRCode',
    size: '1.2 MB',
    type: 'application/zip',
    uploadedAt: '2026-07-20T12:00:00Z',
    uploadedBy: 'System Backup'
  },
  {
    id: 'DRV-005',
    name: 'Database_Backup_20260720.json',
    folder: 'Backup',
    size: '512 KB',
    type: 'application/json',
    uploadedAt: '2026-07-20T18:00:00Z',
    uploadedBy: 'System Auto-Backup'
  }
];
