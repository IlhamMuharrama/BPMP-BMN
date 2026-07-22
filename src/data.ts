/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Kategori, Supplier, Unit, Satuan, Barang, BarangMasuk, BarangKeluar, Riwayat, AuditLog, SystemNotification, Settings, Pegawai } from './types';

export const INITIAL_KATEGORI: Kategori[] = [
  { id: 'KAT-001', nama: 'Alat Tulis Kantor (ATK)', deskripsi: 'Kebutuhan alat tulis dan kertas kantor sehari-hari' },
  { id: 'KAT-002', nama: 'Peralatan Komputer & IT', deskripsi: 'Hardware, software, peripheral, dan jaringan internet' },
  { id: 'KAT-003', nama: 'Sarana Sosialisasi & Publikasi', deskripsi: 'Spanduk, brosur, banner, merchandise, dan media humas' },
  { id: 'KAT-004', nama: 'Konsumsi & Logistik Acara', deskripsi: 'Makanan, minuman, paket rapat, dan kelengkapan kegiatan' },
  { id: 'KAT-005', nama: 'Sarana Kebersihan & Sanitasi', deskripsi: 'Pembersih lantai, cairan antiseptik, tisu, dan hand sanitizer' }
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
  { id: 'SAT-006', nama: 'Pack', keterangan: 'Kemasan bungkus kecil' }
];

export const INITIAL_BARANG: Barang[] = [
  {
    id: 'BRG-001',
    nama: 'Kertas HVS A4 80gr Sinar Dunia',
    kategori: 'Alat Tulis Kantor (ATK)',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Rim',
    lokasiRak: 'Rak ATK - A1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-001',
    stokSekarang: 45,
    stokMin: 15,
    stokMaks: 100,
    deskripsi: 'Kertas HVS putih ukuran A4 berat 80gr untuk cetak laporan evaluasi mutu sekolah.',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-07-15T10:30:00Z'
  },
  {
    id: 'BRG-002',
    nama: 'Pulpen Standard AE7 Hitam',
    kategori: 'Alat Tulis Kantor (ATK)',
    supplier: 'Toko ATK Utama Jaya',
    satuan: 'Box',
    lokasiRak: 'Rak ATK - A2',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-002',
    stokSekarang: 12,
    stokMin: 5,
    stokMaks: 30,
    deskripsi: 'Pulpen gel tinta hitam 0.5mm, nyaman untuk penulisan tanda tangan dokumen dinas.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-10T08:15:00Z',
    updatedAt: '2026-07-18T14:20:00Z'
  },
  {
    id: 'BRG-003',
    nama: 'Flashdisk SanDisk Ultra 64GB USB 3.0',
    kategori: 'Peralatan Komputer & IT',
    supplier: 'PT Tekno Mandiri Sumsel',
    satuan: 'Pcs',
    lokasiRak: 'Laci Elektronik - E1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-003',
    stokSekarang: 2,
    stokMin: 5,
    stokMaks: 20,
    deskripsi: 'Flashdisk kecepatan tinggi USB 3.0 untuk memindahkan data instrumen akreditasi sekolah.',
    imageUrl: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T09:30:00Z',
    updatedAt: '2026-07-20T09:00:00Z'
  },
  {
    id: 'BRG-004',
    nama: 'Mouse Wireless Logitech M170',
    kategori: 'Peralatan Komputer & IT',
    supplier: 'PT Tekno Mandiri Sumsel',
    satuan: 'Pcs',
    lokasiRak: 'Laci Elektronik - E2',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-004',
    stokSekarang: 18,
    stokMin: 4,
    stokMaks: 25,
    deskripsi: 'Mouse wireless ergonomis untuk kemudahan operasional laptop staf pemetaan pendidikan.',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-12T09:45:00Z',
    updatedAt: '2026-07-10T11:00:00Z'
  },
  {
    id: 'BRG-005',
    nama: 'Banner Roll X-Stand Sosialisasi Kurikulum Merdeka',
    kategori: 'Sarana Sosialisasi & Publikasi',
    supplier: 'CV Sriwijaya Abadi Jaya',
    satuan: 'Pcs',
    lokasiRak: 'Gudang Promosi - B1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-005',
    stokSekarang: 0,
    stokMin: 2,
    stokMaks: 10,
    deskripsi: 'Roll up banner ukuran 60x160cm dengan materi sosialisasi kurikulum nasional.',
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-15T11:00:00Z',
    updatedAt: '2026-07-19T16:30:00Z'
  },
  {
    id: 'BRG-006',
    nama: 'Air Mineral Cup Wahana 240ml',
    kategori: 'Konsumsi & Logistik Acara',
    supplier: 'CV Indah Boga Catering',
    satuan: 'Dus',
    lokasiRak: 'Gudang Konsumsi - C1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-006',
    stokSekarang: 35,
    stokMin: 10,
    stokMaks: 60,
    deskripsi: 'Air minum cup untuk konsumsi peserta rapat koordinasi kepala sekolah se-Sumsel.',
    imageUrl: 'https://images.unsplash.com/photo-1548839130-3fd96cd5cc49?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-20T14:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z'
  },
  {
    id: 'BRG-007',
    nama: 'Hand Sanitizer Gel Antis 500ml',
    kategori: 'Sarana Kebersihan & Sanitasi',
    supplier: 'CV Sriwijaya Abadi Jaya',
    satuan: 'Pcs',
    lokasiRak: 'Gudang Kebersihan - D1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BRG-007',
    stokSekarang: 24,
    stokMin: 8,
    stokMaks: 40,
    deskripsi: 'Cairan sanitasi tangan anti kuman untuk ditempatkan di setiap pintu masuk ruang rapat BPMP.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
    createdAt: '2026-05-22T08:30:00Z',
    updatedAt: '2026-07-14T09:15:00Z'
  }
];

export const INITIAL_BARANG_MASUK: BarangMasuk[] = [
  {
    id: 'TRM-260710-01',
    tanggal: '2026-07-10T09:00:00Z',
    barangId: 'BRG-004',
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
    barangId: 'BRG-001',
    namaBarang: 'Kertas HVS A4 80gr Sinar Dunia',
    jumlah: 30,
    supplier: 'Toko ATK Utama Jaya',
    petugas: 'Roni Setiawan (Petugas BMN)',
    fileDokumen: 'DO_ATK_Kertas_A4_signed.pdf',
    catatan: 'Restock kertas habis untuk persiapan pelatihan guru.'
  },
  {
    id: 'TRM-260720-01',
    tanggal: '2026-07-20T10:00:00Z',
    barangId: 'BRG-006',
    namaBarang: 'Air Mineral Cup Wahana 240ml',
    jumlah: 20,
    supplier: 'CV Indah Boga Catering',
    petugas: 'Roni Setiawan (Petugas BMN)',
    fileDokumen: 'Inv_Boga_Wahana_signed.pdf',
    catatan: 'Pengadaan konsumsi rapat koordinasi dinas pendidikan kabupaten.'
  }
];

export const INITIAL_BARANG_KELUAR: BarangKeluar[] = [
  {
    id: 'TRK-260711-01',
    tanggal: '2026-07-11T13:30:00Z',
    barangId: 'BRG-004',
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
    barangId: 'BRG-002',
    namaBarang: 'Pulpen Standard AE7 Hitam',
    jumlah: 3,
    unitId: 'Fasilitasi Peningkatan Mutu (FPMP)',
    petugas: 'Roni Setiawan (Petugas BMN)',
    keperluan: 'Kebutuhan menulis formulir penilaian peserta bimtek',
    statusPersetujuan: 'Disetujui',
    catatan: 'Serah terima di ruang FPMP.'
  },
  {
    id: 'TRK-260719-01',
    tanggal: '2026-07-19T16:30:00Z',
    barangId: 'BRG-005',
    namaBarang: 'Banner Roll X-Stand Sosialisasi Kurikulum Merdeka',
    jumlah: 2,
    unitId: 'Seksi Pemetaan & Supervisi',
    petugas: 'Roni Setiawan (Petugas BMN)',
    keperluan: 'Pemasangan display sosialisasi di lobi utama BPMP',
    statusPersetujuan: 'Disetujui',
    catatan: 'Dipasang sementara sampai tanggal 30 Juli.'
  },
  {
    id: 'TRK-260720-02',
    tanggal: '2026-07-20T09:00:00Z',
    barangId: 'BRG-003',
    namaBarang: 'Flashdisk SanDisk Ultra 64GB USB 3.0',
    jumlah: 4,
    unitId: 'Seksi Pemetaan & Supervisi',
    petugas: 'Roni Setiawan (Petugas BMN)',
    keperluan: 'Penyimpanan berkas instrumen akreditasi sekolah',
    statusPersetujuan: 'Pending',
    catatan: 'Menunggu persetujuan Kasubag Umum karena stok sisa sedikit (2 pcs).'
  }
];

export const INITIAL_RIWAYAT: Riwayat[] = [
  {
    id: 'TRM-260710-01',
    tanggal: '2026-07-10T09:00:00Z',
    tipe: 'Masuk',
    barangId: 'BRG-004',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 15,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Masuk dari PT Tekno Mandiri Sumsel'
  },
  {
    id: 'TRK-260711-01',
    tanggal: '2026-07-11T13:30:00Z',
    tipe: 'Keluar',
    barangId: 'BRG-004',
    namaBarang: 'Mouse Wireless Logitech M170',
    jumlah: 2,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Keluar ke Unit Subbagian Umum'
  },
  {
    id: 'TRM-260715-01',
    tanggal: '2026-07-15T10:30:00Z',
    tipe: 'Masuk',
    barangId: 'BRG-001',
    namaBarang: 'Kertas HVS A4 80gr Sinar Dunia',
    jumlah: 30,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Masuk dari Toko ATK Utama Jaya'
  },
  {
    id: 'TRK-260718-01',
    tanggal: '2026-07-18T14:20:00Z',
    tipe: 'Keluar',
    barangId: 'BRG-002',
    namaBarang: 'Pulpen Standard AE7 Hitam',
    jumlah: 3,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Keluar ke Unit Fasilitasi Peningkatan Mutu (FPMP)'
  },
  {
    id: 'TRK-260719-01',
    tanggal: '2026-07-19T16:30:00Z',
    tipe: 'Keluar',
    barangId: 'BRG-005',
    namaBarang: 'Banner Roll X-Stand Sosialisasi Kurikulum Merdeka',
    jumlah: 2,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Keluar ke Unit Seksi Pemetaan & Supervisi'
  },
  {
    id: 'TRM-260720-01',
    tanggal: '2026-07-20T10:00:00Z',
    tipe: 'Masuk',
    barangId: 'BRG-006',
    namaBarang: 'Air Mineral Cup Wahana 240ml',
    jumlah: 20,
    petugas: 'Roni Setiawan (Petugas BMN)',
    keterangan: 'Barang Masuk dari CV Indah Boga Catering'
  }
];

export const INITIAL_AUDIT_LOG: AuditLog[] = [
  { id: 'LOG-001', tanggal: '2026-07-20T08:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Login', detail: 'Sesi login dimulai pada peranti desktop Google Chrome' },
  { id: 'LOG-002', tanggal: '2026-07-20T09:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Transaksi Keluar', detail: 'Menginput pengajuan barang keluar Flashdisk SanDisk Ultra 64GB sebanyak 4 pcs' },
  { id: 'LOG-003', tanggal: '2026-07-20T10:00:00Z', aktor: 'Roni Setiawan', role: 'Petugas BMN', aksi: 'Transaksi Masuk', detail: 'Berhasil memproses pencatatan barang masuk Air Mineral Cup sebanyak 20 Dus' },
  { id: 'LOG-004', tanggal: '2026-07-20T10:15:00Z', aktor: 'Drs. H. Syahidin, M.Si.', role: 'Kepala Subbagian', aksi: 'Persetujuan', detail: 'Melihat rincian pengajuan barang keluar Flashdisk SanDisk Ultra 64GB' }
];

export const INITIAL_NOTIFICATION: SystemNotification[] = [
  { id: 'NOT-001', tipe: 'stok_habis', pesan: 'Stok barang "Banner Roll X-Stand Sosialisasi Kurikulum Merdeka" HABIS! Segera lakukan pengadaan.', tanggal: '2026-07-19T16:30:00Z', read: false, barangId: 'BRG-005' },
  { id: 'NOT-002', tipe: 'stok_rendah', pesan: 'Stok barang "Flashdisk SanDisk Ultra 64GB USB 3.0" tersisa 2 Pcs (Stok minimum: 5).', tanggal: '2026-07-20T09:00:00Z', read: false, barangId: 'BRG-003' }
];

export const DEFAULT_SETTINGS: Settings = {
  namaInstitusi: 'BPMP Provinsi Sumatera Selatan',
  logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png',
  folderQrId: '1dr_qr_code_bpmp_sumsel_folder',
  folderImagesId: '1dr_images_bpmp_sumsel_folder',
  folderReportsId: '1dr_reports_bpmp_sumsel_folder',
  folderBackupId: '1dr_backup_bpmp_sumsel_folder',
  spreadsheetId: '1ss_bpmp_sumsel_inventory_database',
  bilaStokRendahNotif: true,
  bilaStokHabisNotif: true
};

export const INITIAL_PEGAWAI: Pegawai[] = [
  { id: 'PGW-001', nama: 'Roni Setiawan', jabatan: 'Petugas BMN', nip: '198804152014021003', telepon: '0812-7123-4567' },
  { id: 'PGW-002', nama: 'ILHAM MUHARRAMA', jabatan: 'Kepala Subbagian Umum', nip: '197509121999031002', telepon: '0811-7890-1234' },
  { id: 'PGW-003', nama: 'Budi Hermawan', jabatan: 'Staf BMN', nip: '199112022019031005', telepon: '0821-8899-7711' },
  { id: 'PGW-004', nama: 'Drs. H. Sunardi, M.Pd.', jabatan: 'Pimpinan / Kepala BPMP', nip: '196703081992031003', telepon: '0812-7345-9988' },
  { id: 'PGW-005', nama: 'Siti Aminah, S.E.', jabatan: 'Staf Administrasi BMN', nip: '199305142020012003', telepon: '0813-6677-8899' },
  { id: 'PGW-006', nama: 'Heri Prasetyo', jabatan: 'Staf Inventarisasi BMN', nip: '198911102016031001', telepon: '0812-5544-3322' }
];
