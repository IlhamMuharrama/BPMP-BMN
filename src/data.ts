/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Kategori, Supplier, Unit, Satuan, Barang, BarangMasuk, BarangKeluar, Riwayat, AuditLog, SystemNotification, Settings, Pegawai, DriveFileItem } from './types';

export const INITIAL_KATEGORI: Kategori[] = [
  {
    id: "1010301001",
    nama: "Alat Tulis Kantor (Pena & Tinta)",
    deskripsi: "Subkelompok BMN 1010301001 - Pena Tulis, Pulpen, & Tinta Tulis"
  },
  {
    id: "1010301002",
    nama: "Tinta Cap Press",
    deskripsi: "Subkelompok BMN 1010301002 - Tinta Stampel / Cap Press"
  },
  {
    id: "1010301003",
    nama: "Necis, Klip, & Binder",
    deskripsi: "Subkelompok BMN 1010301003 - Stapler, Isi Necis, Binder Clip, Klip Kertas, & Trigonal"
  },
  {
    id: "1010301004",
    nama: "Penghapus, Tip-Ex, & Kuas",
    deskripsi: "Subkelompok BMN 1010301004 - Penghapus WB, Tip-Ex, Stabilo, Kuas Cat"
  },
  {
    id: "1010301005",
    nama: "Buku, Agenda, & Lem",
    deskripsi: "Subkelompok BMN 1010301005 - Buku Block Note, Buku Folio, Agenda, Lem, Tip-Ex Cair"
  },
  {
    id: "1010301006",
    nama: "Map & Tempat Dokumen",
    deskripsi: "Subkelompok BMN 1010301006 - Map Plastik, Map Ordner, File Box, Pocket Sheet, Paper Bag"
  },
  {
    id: "1010301007",
    nama: "Mistar & Penggaris",
    deskripsi: "Subkelompok BMN 1010301007 - Mistar Plastik & Mistar Besi 30 CM"
  },
  {
    id: "1010301008",
    nama: "Pemotong, Gunting, & Perlengkapan Kantor",
    deskripsi: "Subkelompok BMN 1010301008 - Cutter, Gunting, Pin Magnet, Pemanas Air, Keranjang, Gelas"
  }
];

export const INITIAL_SATUAN: Satuan[] = [
  { id: "SAT-001", nama: "Buah", keterangan: "Satuan per unit/buah item" },
  { id: "SAT-002", nama: "Lusin", keterangan: "Satuan 12 buah" },
  { id: "SAT-003", nama: "Kotak", keterangan: "Satuan per kotak/box kecil" },
  { id: "SAT-004", nama: "Pak", keterangan: "Satuan kemasan pak" },
  { id: "SAT-005", nama: "Tube", keterangan: "Satuan kemasan tube" },
  { id: "SAT-006", nama: "Unit", keterangan: "Satuan per unit peralatan" },
  { id: "SAT-007", nama: "Set", keterangan: "Satuan 1 set lengkap" }
];

export const INITIAL_SUPPLIER: Supplier[] = [
  { id: "SUP-001", nama: "CV Media Utama Palembang", kontak: "Budi Santoso", telepon: "0711-312455", alamat: "Jl. Angkatan 45 No. 12 Palembang" },
  { id: "SUP-002", nama: "PT Gramedia Asri Media", kontak: "Siska Dewi", telepon: "0711-351221", alamat: "Jl. Jend. Sudirman No. 120 Palembang" },
  { id: "SUP-003", nama: "Toko ATK Jaya Abadi", kontak: "Hengky", telepon: "0812-7890-1122", alamat: "Jl. Mesjid Lama No. 45 Palembang" }
];

export const INITIAL_UNIT: Unit[] = [
  { id: "UNT-001", nama: "Bagian Umum / Tata Usaha", penanggungJawab: "Roni Setiawan", keterangan: "Unit pengelola administrasi dan BMN BPMP" },
  { id: "UNT-002", nama: "Tim Kerja Penjaminan Mutu", penanggungJawab: "Drs. H. Sunardi, M.Pd.", keterangan: "Tim kerja penjaminan mutu pendidikan" },
  { id: "UNT-003", nama: "Tim Kerja Data & Informasi", penanggungJawab: "Heri Prasetyo", keterangan: "Pengelola IT dan sistem informasi" },
  { id: "UNT-004", nama: "Subbag Keuangan & BMN", penanggungJawab: "Siti Aminah, S.E.", keterangan: "Unit pengelola keuangan dan aset BMN" }
];

export const INITIAL_BARANG: Barang[] = [
  // 1010301001
  {
    id: "1010301001-000001",
    kategoriId: "1010301001",
    kategori: "Alat Tulis Kantor (Pena & Tinta)",
    nama: "Pena Click G2 Pillot",
    supplier: "CV Media Utama Palembang",
    satuan: "Lusin",
    lokasiRak: "Rak A-1",
    stokSekarang: 25,
    stokMin: 5,
    stokMaks: 100,
    deskripsi: "Pena gel Pilot G2 Click hitam/biru",
    imageUrl: "",
    createdAt: "2026-07-08T08:00:00Z",
    updatedAt: "2026-07-08T08:00:00Z"
  },
  // 1010301002
  {
    id: "1010301002-000001",
    kategoriId: "1010301002",
    kategori: "Tinta Cap Press",
    nama: "TINTA CAP PRESS",
    supplier: "CV Media Utama Palembang",
    satuan: "Tube",
    lokasiRak: "Rak A-2",
    stokSekarang: 15,
    stokMin: 3,
    stokMaks: 50,
    deskripsi: "Tinta stampel otomatis/cap press",
    imageUrl: "",
    createdAt: "2026-07-08T08:00:00Z",
    updatedAt: "2026-07-08T08:00:00Z"
  },
  // 1010301003
  { id: "1010301003-000001", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "NECIS NO.10 KECIL", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak B-1", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Stapler necis ukuran no 10", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000002", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS NO. 10", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 50, stokMin: 10, stokMaks: 200, deskripsi: "Isi necis stapler no 10", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000003", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "KLIP KERTAS", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak B-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Klip penjepit kertas standar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000004", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "BINDER NO 111", supplier: "PT Gramedia Asri Media", satuan: "Kotak", lokasiRak: "Rak B-2", stokSekarang: 20, stokMin: 5, stokMaks: 80, deskripsi: "Binder clip no 111", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000005", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "BINDER NO.155", supplier: "PT Gramedia Asri Media", satuan: "Kotak", lokasiRak: "Rak B-2", stokSekarang: 25, stokMin: 5, stokMaks: 80, deskripsi: "Binder clip no 155", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000006", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "BINDER NO. 260", supplier: "PT Gramedia Asri Media", satuan: "Kotak", lokasiRak: "Rak B-2", stokSekarang: 18, stokMin: 5, stokMaks: 80, deskripsi: "Binder clip no 260 besar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000007", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "KLIP KERTAS NACHI PANJANG", supplier: "CV Media Utama Palembang", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 35, stokMin: 5, stokMaks: 120, deskripsi: "Paper clip Nachi panjang", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000008", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "NECIS NO.10 KECIL", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak B-1", stokSekarang: 12, stokMin: 3, stokMaks: 50, deskripsi: "Stapler necis kecil BMN", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000009", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS KECIL NO.10", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 45, stokMin: 10, stokMaks: 150, deskripsi: "Isi stapler necis kecil no 10", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000010", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "NECIS NO.3", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak B-1", stokSekarang: 15, stokMin: 3, stokMaks: 60, deskripsi: "Stapler necis ukuran no 3", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000011", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS NO. 3", supplier: "CV Media Utama Palembang", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Isi necis stapler no 3", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000012", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "NECIS JUMBO TEMBAK", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak B-3", stokSekarang: 8, stokMin: 2, stokMaks: 30, deskripsi: "Stapler tembak jumbo", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000017", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS NO.10 AUG", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 25, stokMin: 5, stokMaks: 80, deskripsi: "Isi necis no 10 AUG", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000018", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "NECIS JUMBO BESAR", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak B-3", stokSekarang: 10, stokMin: 2, stokMaks: 40, deskripsi: "Stapler necis jumbo heavy duty", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000019", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS JUMBO", supplier: "PT Gramedia Asri Media", satuan: "Kotak", lokasiRak: "Rak B-3", stokSekarang: 20, stokMin: 5, stokMaks: 80, deskripsi: "Isi stapler necis jumbo", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000020", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "ISI NECIS TEMBAK T13", supplier: "PT Gramedia Asri Media", satuan: "Kotak", lokasiRak: "Rak B-3", stokSekarang: 15, stokMin: 3, stokMaks: 60, deskripsi: "Isi stapler tembak T13", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000021", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "BINDER KLIP 105", supplier: "CV Media Utama Palembang", satuan: "Kotak", lokasiRak: "Rak B-2", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Binder clip no 105", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000022", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "BINDER KLIP 107", supplier: "CV Media Utama Palembang", satuan: "Kotak", lokasiRak: "Rak B-2", stokSekarang: 28, stokMin: 5, stokMaks: 100, deskripsi: "Binder clip no 107", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000023", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "TRIGONAL NO 1", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Klip trigonal no 1", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000024", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "TRIGONAL NO. 3", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 35, stokMin: 10, stokMaks: 150, deskripsi: "Klip trigonal no 3", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000025", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "TRIGONAL NO. 5", supplier: "Toko ATK Jaya Abadi", satuan: "Kotak", lokasiRak: "Rak B-1", stokSekarang: 30, stokMin: 10, stokMaks: 150, deskripsi: "Klip trigonal no 5", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301003-000026", kategoriId: "1010301003", kategori: "Necis, Klip, & Binder", nama: "PEMBATAS KERTAS", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak B-1", stokSekarang: 50, stokMin: 10, stokMaks: 200, deskripsi: "Pembatas kertas indeks warna", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },

  // 1010301004
  { id: "1010301004-000001", kategoriId: "1010301004", kategori: "Penghapus, Tip-Ex, & Kuas", nama: "PENGHAPUS WB", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak C-1", stokSekarang: 25, stokMin: 5, stokMaks: 100, deskripsi: "Penghapus papan tulis whiteboard magnet", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301004-000002", kategoriId: "1010301004", kategori: "Penghapus, Tip-Ex, & Kuas", nama: "TIP-EX", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak C-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Correction tape / Tip-ex kertas", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301004-000003", kategoriId: "1010301004", kategori: "Penghapus, Tip-Ex, & Kuas", nama: "STABILO", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak C-1", stokSekarang: 60, stokMin: 10, stokMaks: 200, deskripsi: "Penanda penyorot warna Stabilo Boss", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301004-000006", kategoriId: "1010301004", kategori: "Penghapus, Tip-Ex, & Kuas", nama: "PENGHAPUS PENSIL", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak C-1", stokSekarang: 45, stokMin: 10, stokMaks: 150, deskripsi: "Penghapus pensil hitam/putih", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301004-000007", kategoriId: "1010301004", kategori: "Penghapus, Tip-Ex, & Kuas", nama: "KUAS CAT", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak C-2", stokSekarang: 15, stokMin: 3, stokMaks: 50, deskripsi: "Kuas cat 2 inchi", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },

  // 1010301005
  { id: "1010301005-000001", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "BUKU BLOCK NOTE", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak D-1", stokSekarang: 80, stokMin: 15, stokMaks: 300, deskripsi: "Buku catatan block note A5/A6", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000002", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "BUKU FOLIO ISI 200 LBR", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak D-1", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Buku folio bergaris 200 lembar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000003", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "BUKU FOLIO ISI 100 LBR", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak D-1", stokSekarang: 45, stokMin: 10, stokMaks: 150, deskripsi: "Buku folio bergaris 100 lembar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000004", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "Stabilo", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak D-2", stokSekarang: 35, stokMin: 5, stokMaks: 120, deskripsi: "Penanda warna highlighter", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000005", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "LEM Glue Stick", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak D-2", stokSekarang: 50, stokMin: 10, stokMaks: 200, deskripsi: "Lem kertas batangan glue stick", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000006", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "Penghapus fiber castle", supplier: "Toko ATK Jaya Abadi", satuan: "Lusin", lokasiRak: "Rak D-2", stokSekarang: 12, stokMin: 3, stokMaks: 50, deskripsi: "Penghapus Faber Castell dus/lusin", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000007", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "TIP-EX CAIR", supplier: "CV Media Utama Palembang", satuan: "Lusin", lokasiRak: "Rak D-2", stokSekarang: 10, stokMin: 2, stokMaks: 40, deskripsi: "Tip-ex cair botol/lusin", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000008", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "AGENDA/ BUKU KERJA", supplier: "PT Gramedia Asri Media", satuan: "Unit", lokasiRak: "Rak D-1", stokSekarang: 25, stokMin: 5, stokMaks: 100, deskripsi: "Buku agenda kerja dinas BPMP", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301005-000009", kategoriId: "1010301005", kategori: "Buku, Agenda, & Lem", nama: "Buku Folio 100 Lbr", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak D-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Buku folio kover tebal 100lbr", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },

  // 1010301006
  { id: "1010301006-000001", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP PLASTIK JEPIT", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 60, stokMin: 10, stokMaks: 200, deskripsi: "Map plastik jepit dokumen", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000002", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP PLASTIK BERLOBANG", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 75, stokMin: 15, stokMaks: 250, deskripsi: "Map plastik berlobang binder", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000003", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP KERTAS FOLIO", supplier: "Toko ATK Jaya Abadi", satuan: "Pak", lokasiRak: "Rak E-1", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Map kertas folio warna", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000004", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP ORDNER", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak E-2", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Map ordner kuitansi/arsip tebal", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000005", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP PLASTIK", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 100, stokMin: 20, stokMaks: 300, deskripsi: "Map plastik kancing transparant", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000006", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "FILE BOX R16", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak E-3", stokSekarang: 25, stokMin: 5, stokMaks: 80, deskripsi: "Kotak arsip file box R16", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000007", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP PLASTIK BERLOBANG R16", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 50, stokMin: 10, stokMaks: 150, deskripsi: "Map plastik berlobang ukuran R16", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000010", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "POCKET SHEET", supplier: "PT Gramedia Asri Media", satuan: "Pak", lokasiRak: "Rak E-2", stokSekarang: 20, stokMin: 5, stokMaks: 80, deskripsi: "Plastik transparant pameran pocket sheet", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000011", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP Kertas Bermotif Kain", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 35, stokMin: 5, stokMaks: 120, deskripsi: "Map kertas eksklusif bermotif kain", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000012", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP KANCING SCHOOL BAG", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak E-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Map kancing pegangan jinjing", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000013", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "MAP BPMP", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-3", stokSekarang: 150, stokMin: 30, stokMaks: 500, deskripsi: "Map Batik / Resmi Logo BPMP Sumsel", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000014", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "Paper bag bpmp", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak E-3", stokSekarang: 200, stokMin: 50, stokMaks: 600, deskripsi: "Tas kertas seminar/kegiatan BPMP", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000015", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "Map Holder", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak E-2", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Tempat/wadah penataan map", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301006-000016", kategoriId: "1010301006", kategori: "Map & Tempat Dokumen", nama: "Pocket Sheet A4", supplier: "PT Gramedia Asri Media", satuan: "Pak", lokasiRak: "Rak E-2", stokSekarang: 25, stokMin: 5, stokMaks: 100, deskripsi: "Pocket sheet plastik bening A4", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },

  // 1010301007
  { id: "1010301007-000001", kategoriId: "1010301007", kategori: "Mistar & Penggaris", nama: "MISTAR PLASTIK 30 CM", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak F-1", stokSekarang: 45, stokMin: 10, stokMaks: 150, deskripsi: "Penggaris mistar bening plastik 30 cm", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301007-000002", kategoriId: "1010301007", kategori: "Mistar & Penggaris", nama: "MISTAR BESI 30 CM", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak F-1", stokSekarang: 35, stokMin: 5, stokMaks: 120, deskripsi: "Penggaris mistar stainless steel besi 30 cm", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },

  // 1010301008
  { id: "1010301008-000001", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "PISAU CUTTER", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak G-1", stokSekarang: 40, stokMin: 10, stokMaks: 150, deskripsi: "Pisau cutter potong kertas", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000002", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "GUNTING KEMBANG BESAR", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak G-1", stokSekarang: 15, stokMin: 3, stokMaks: 50, deskripsi: "Gunting hias kembang besar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000003", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "GUNTING KEMBANG KECIL", supplier: "Toko ATK Jaya Abadi", satuan: "Buah", lokasiRak: "Rak G-1", stokSekarang: 20, stokMin: 5, stokMaks: 60, deskripsi: "Gunting hias kembang kecil", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000004", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "PISAU CUTTER R16", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak G-1", stokSekarang: 25, stokMin: 5, stokMaks: 80, deskripsi: "Pisau cutter tipe R16", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000005", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "GUNTING SEDANG", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak G-1", stokSekarang: 30, stokMin: 5, stokMaks: 100, deskripsi: "Gunting stainless sedang", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000006", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "REFILL MATA PISAU CUTTER", supplier: "Toko ATK Jaya Abadi", satuan: "Tube", lokasiRak: "Rak G-1", stokSekarang: 50, stokMin: 10, stokMaks: 200, deskripsi: "Refill isi mata pisau cutter", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000007", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "Gunting Kertas", supplier: "CV Media Utama Palembang", satuan: "Lusin", lokasiRak: "Rak G-1", stokSekarang: 10, stokMin: 2, stokMaks: 40, deskripsi: "Gunting kertas per lusin", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000008", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "Gunting pipa paralon", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak G-2", stokSekarang: 8, stokMin: 2, stokMaks: 30, deskripsi: "Gunting pemotong pipa PVC/paralon", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000009", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "PIN MAGNET", supplier: "PT Gramedia Asri Media", satuan: "Set", lokasiRak: "Rak G-2", stokSekarang: 35, stokMin: 5, stokMaks: 100, deskripsi: "Pin magnet papan pengumuman/whiteboard", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000010", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "PEMANAS AIR", supplier: "PT Gramedia Asri Media", satuan: "Buah", lokasiRak: "Rak G-3", stokSekarang: 5, stokMin: 1, stokMaks: 20, deskripsi: "Pemanas air minum/teko listrik kantor", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000011", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "KERANJANG BESAR", supplier: "CV Media Utama Palembang", satuan: "Buah", lokasiRak: "Rak G-3", stokSekarang: 12, stokMin: 3, stokMaks: 50, deskripsi: "Keranjang penampung dokumen/barang besar", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" },
  { id: "1010301008-000012", kategoriId: "1010301008", kategori: "Pemotong, Gunting, & Perlengkapan Kantor", nama: "GELAS DAN TUTUP", supplier: "CV Media Utama Palembang", satuan: "Lusin", lokasiRak: "Rak G-3", stokSekarang: 8, stokMin: 2, stokMaks: 30, deskripsi: "Set gelas air minum plus tutup rapat kantor", imageUrl: "", createdAt: "2026-07-08T08:00:00Z", updatedAt: "2026-07-08T08:00:00Z" }
];

export const INITIAL_BARANG_MASUK: BarangMasuk[] = [];

export const INITIAL_BARANG_KELUAR: BarangKeluar[] = [];

export const INITIAL_RIWAYAT: Riwayat[] = [];

export const INITIAL_AUDIT_LOG: AuditLog[] = [];

export const INITIAL_NOTIFICATION: SystemNotification[] = [];

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

export const INITIAL_DRIVE_FILES: DriveFileItem[] = [];
