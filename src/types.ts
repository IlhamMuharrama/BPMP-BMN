/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Barang {
  id: string; // Kode Barang
  nama: string;
  kategori: string;
  supplier: string;
  satuan: string;
  lokasiRak: string;
  qrCodeUrl: string;
  stokSekarang: number;
  stokMin: number;
  stokMaks: number;
  deskripsi: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Kategori {
  id: string;
  nama: string;
  deskripsi: string;
}

export interface Supplier {
  id: string;
  nama: string;
  kontak: string;
  telepon: string;
  alamat: string;
}

export interface Unit {
  id: string;
  nama: string;
  penanggungJawab: string;
  keterangan: string;
}

export interface Satuan {
  id: string;
  nama: string;
  keterangan: string;
}

export interface BarangMasuk {
  id: string;
  tanggal: string;
  barangId: string;
  namaBarang: string;
  jumlah: number;
  supplier: string;
  petugas: string;
  fileDokumen: string; // Filename or Drive URL
  fileData?: string; // Base64 or Object URL of uploaded document
  catatan: string;
}

export interface BarangKeluar {
  id: string;
  tanggal: string;
  barangId: string;
  namaBarang: string;
  jumlah: number;
  unitId: string;
  petugas: string;
  keperluan: string;
  statusPersetujuan: 'Pending' | 'Disetujui' | 'Ditolak';
  fileDokumen?: string;
  fileData?: string;
  catatan: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  folder: 'Reports' | 'Images' | 'QRCode' | 'Backup';
  size: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  dataUrl?: string;
}

export interface Riwayat {
  id: string;
  tanggal: string;
  tipe: 'Masuk' | 'Keluar';
  barangId: string;
  namaBarang: string;
  jumlah: number;
  petugas: string;
  keterangan: string;
}

export interface AuditLog {
  id: string;
  tanggal: string;
  aktor: string;
  role: string;
  aksi: string;
  detail: string;
}

export interface SystemNotification {
  id: string;
  tipe: 'stok_rendah' | 'stok_habis' | 'sistem';
  pesan: string;
  tanggal: string;
  read: boolean;
  barangId?: string;
}

export interface Settings {
  namaInstitusi: string;
  subHeaderKop?: string;
  alamatKop?: string;
  kontakKop?: string;
  namaPenanggungJawab?: string;
  jabatanPenanggungJawab?: string;
  nipPenanggungJawab?: string;
  logoUrl: string;
  prefiksKodeBarang?: string;
  defaultStokMin?: number;
  autoSyncIntervalSec?: number;
  folderQrId: string;
  folderImagesId: string;
  folderReportsId?: string; // Legacy
  folderLaporanId?: string;
  folderDokumenId?: string;
  folderBackupId: string;
  spreadsheetId: string;
  bilaStokRendahNotif: boolean;
  bilaStokHabisNotif: boolean;
  konfirmasiOtomatisKeluar?: boolean;
}

export interface Pegawai {
  id: string;
  nama: string;
  jabatan: string;
  nip?: string;
  telepon?: string;
}

export interface UserAccount {
  username: string;
  nama: string;
  nip: string;
  jabatan: string;
  telepon: string;
  password?: string;
  role: 'Administrator' | 'Petugas BMN';
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  registeredAt: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'barang'
  | 'kategori'
  | 'supplier'
  | 'unit'
  | 'satuan'
  | 'pegawai'
  | 'barang_masuk'
  | 'barang_keluar'
  | 'riwayat'
  | 'laporan'
  | 'pengaturan'
  | 'audit_log'
  | 'admin_control';
