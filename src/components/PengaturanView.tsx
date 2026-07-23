/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Database,
  Folder,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Check,
  HardDrive,
  FileText,
  Download,
  Building,
  Bell,
  Sliders,
  HelpCircle,
  Copy,
  ExternalLink,
  Info,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Settings, DriveFileItem } from '../types';

interface PengaturanViewProps {
  settings: Settings;
  onSaveSettings: (s: Settings) => void;
  onResetDatabase: () => void;
  onSimulateBackup: () => void;
  driveFiles?: DriveFileItem[];
}

export default function PengaturanView({
  settings,
  onSaveSettings,
  onResetDatabase,
  onSimulateBackup,
  driveFiles = []
}: PengaturanViewProps) {
  const [formData, setFormData] = useState<Settings>({
    namaInstitusi: settings.namaInstitusi || 'BALAI PENJAMINAN MUTU PENDIDIKAN PROVINSI SUMATERA SELATAN',
    subHeaderKop: settings.subHeaderKop || 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI',
    alamatKop: settings.alamatKop || 'Jl. Jenderal Sudirman Km. 6.5 Palembang Telp. (0711) 356789 Fax. 356790',
    kontakKop: settings.kontakKop || 'Email: bpmp.sumsel@kemdikbud.go.id | Laman: bpmp-sumsel.kemdikbud.go.id',
    namaPenanggungJawab: settings.namaPenanggungJawab || 'Ilham Muharrama',
    jabatanPenanggungJawab: settings.jabatanPenanggungJawab || 'Magang/KP / Petugas BMN',
    nipPenanggungJawab: settings.nipPenanggungJawab || '-',
    logoUrl: settings.logoUrl || 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png',
    prefiksKodeBarang: settings.prefiksKodeBarang || 'BRG-',
    defaultStokMin: settings.defaultStokMin || 5,
    autoSyncIntervalSec: settings.autoSyncIntervalSec || 2,
    folderQrId: settings.folderQrId || '1dr_qr_code_bpmp_sumsel_folder',
    folderImagesId: settings.folderImagesId || '1dr_images_bpmp_sumsel_folder',
    folderReportsId: settings.folderReportsId || '1dr_reports_bpmp_sumsel_folder',
    folderBackupId: settings.folderBackupId || '1dr_backup_bpmp_sumsel_folder',
    spreadsheetId: settings.spreadsheetId || '1ss_bpmp_sumsel_inventory_database',
    bilaStokRendahNotif: settings.bilaStokRendahNotif ?? true,
    bilaStokHabisNotif: settings.bilaStokHabisNotif ?? true,
    konfirmasiOtomatisKeluar: settings.konfirmasiOtomatisKeluar ?? true
  });

  const [activeTab, setActiveTab] = useState<'profil' | 'operasional' | 'notifikasi' | 'cloud' | 'maintenance'>('profil');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleBackup = () => {
    setIsBackupRunning(true);
    setTimeout(() => {
      setIsBackupRunning(false);
      onSimulateBackup();
    }, 1500);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJSONBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      settings: formData,
      version: "2.0"
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_SILAP_BMN_Settings_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Confirmation */}
      {showSavedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl z-50 flex items-center gap-2.5 border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan sistem berhasil diperbarui dan tersimpan!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider border border-blue-500/30">
              Super Admin Mode
            </span>
            <span className="text-[10px] text-slate-400 font-medium">BPMP SUMSEL v2.0</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-400" /> Pengaturan System & Konfigurasi
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kelola profil instansi, header kop laporan resmi, parameter operasional barang, notifikasi, serta pemantauan integrasi database Google Cloud.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profil'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building className="w-4 h-4" /> Profil & Kop Laporan
        </button>
        <button
          onClick={() => setActiveTab('operasional')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'operasional'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Parameter Operasional
        </button>
        <button
          onClick={() => setActiveTab('notifikasi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'notifikasi'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifikasi & Peringatan
        </button>
        <button
          onClick={() => setActiveTab('cloud')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cloud'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <HardDrive className="w-4 h-4" /> Integrasi Cloud & Drive
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'maintenance'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Pemeliharaan & Backup
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: PROFIL & KOP SURAT */}
        {activeTab === 'profil' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building className="w-4.5 h-4.5 text-blue-600" /> Profil Instansi & Header Kop Cetak Laporan PDF
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Informasi di bawah ini digunakan untuk mencetak Kop Resmi Surat & Laporan Rekapitulasi BMN BPMP Sumatera Selatan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-gray-700">Nama Instansi / Lembaga Utama *</label>
                <input
                  type="text"
                  required
                  value={formData.namaInstitusi}
                  onChange={e => setFormData({ ...formData, namaInstitusi: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-gray-700">Sub-Header Kementerian / Induk Organisasi</label>
                <input
                  type="text"
                  value={formData.subHeaderKop || ''}
                  onChange={e => setFormData({ ...formData, subHeaderKop: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Alamat Lengkap Kantor</label>
                <input
                  type="text"
                  value={formData.alamatKop || ''}
                  onChange={e => setFormData({ ...formData, alamatKop: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Kontak Email & Website</label>
                <input
                  type="text"
                  value={formData.kontakKop || ''}
                  onChange={e => setFormData({ ...formData, kontakKop: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-gray-700">URL Logo Resmi Instansi</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider text-slate-500">
                Penanggung Jawab Laporan (Tanda Tangan Official)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Nama Pejabat / Pengelola *</label>
                  <input
                    type="text"
                    required
                    value={formData.namaPenanggungJawab || ''}
                    onChange={e => setFormData({ ...formData, namaPenanggungJawab: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Jabatan Resmi *</label>
                  <input
                    type="text"
                    required
                    value={formData.jabatanPenanggungJawab || ''}
                    onChange={e => setFormData({ ...formData, jabatanPenanggungJawab: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">NIP Pejabat</label>
                  <input
                    type="text"
                    value={formData.nipPenanggungJawab || ''}
                    onChange={e => setFormData({ ...formData, nipPenanggungJawab: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARAMETER OPERASIONAL */}
        {activeTab === 'operasional' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sliders className="w-4.5 h-4.5 text-blue-600" /> Parameter Operasional Inventaris & Penomoran
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Atur format otomatisasi penomoran kode barang, ambang batas default stok, dan interval sinkronisasi database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Prefiks Standar Kode Barang Baru</label>
                <input
                  type="text"
                  value={formData.prefiksKodeBarang || 'BRG-'}
                  onChange={e => setFormData({ ...formData, prefiksKodeBarang: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 block">Contoh hasil penomoran: BRG-001, BRG-002, dst.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Stok Minimum Default Item Baru</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.defaultStokMin || 5}
                  onChange={e => setFormData({ ...formData, defaultStokMin: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 block">Batas minimum default saat membuat katalog barang baru.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Waktu Tunda Sinkronisasi Ke Spreadsheet</label>
                <select
                  value={formData.autoSyncIntervalSec || 2}
                  onChange={e => setFormData({ ...formData, autoSyncIntervalSec: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value={1}>1.0 Detik (Instant Auto-Save)</option>
                  <option value={2}>1.5 - 2.0 Detik (Standar Rekomendasi)</option>
                  <option value={3}>3.0 Detik (Sangat Hemat Quota API)</option>
                </select>
                <span className="text-[10px] text-gray-400 block">Interval waktu pengiriman perubahan data ke Google Sheets.</span>
              </div>

              <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Konfirmasi Otomatis Barang Keluar</span>
                  <span className="text-[10px] text-gray-500 block">Langsung kurangi stok saat diajukan oleh Petugas BMN</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.konfirmasiOtomatisKeluar ?? true}
                  onChange={e => setFormData({ ...formData, konfirmasiOtomatisKeluar: e.target.checked })}
                  className="w-4.5 h-4.5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFIKASI & PERINGATAN */}
        {activeTab === 'notifikasi' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Bell className="w-4.5 h-4.5 text-blue-600" /> Notifikasi & Peringatan Otomatis System
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Atur pengiriman lonceng notifikasi real-time di bagian atas aplikasi saat terjadi perubahan stok kritis.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900 block">Pemberitahuan Stok Menipis</span>
                  <span className="text-[11px] text-gray-500 block">
                    Munculkan pesan lonceng peringatan ketika sisa barang berada di bawah ambang stok minimum.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.bilaStokRendahNotif}
                  onChange={e => setFormData({ ...formData, bilaStokRendahNotif: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between hover:border-red-300 transition-all">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900 block">Pemberitahuan Stok Habis (Kritis)</span>
                  <span className="text-[11px] text-gray-500 block">
                    Kirim notifikasi berwarna merah mendesak apabila kuantitas stok barang menyentuh 0 (habis).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.bilaStokHabisNotif}
                  onChange={e => setFormData({ ...formData, bilaStokHabisNotif: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTEGRASI CLOUD & PENJELASAN DRIVE */}
        {activeTab === 'cloud' && (
          <div className="space-y-6">
            {/* Professional Explanation Card addressing user question */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-700/40 space-y-4">
              <div className="flex items-center gap-2.5 text-blue-300">
                <Info className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-bold tracking-tight">
                  Penjelasan Arsitektur Storage: Google Sheets vs Google Drive
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-200 pt-1">
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Database className="w-4 h-4" /> 1. Google Sheets (Database Utama)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Sistem menggunakan Google Sheets sebagai <strong>Database Tabular / RDBMS Utama</strong>. Seluruh baris data barang, mutasi masuk/keluar, unit kerja, supplier, pegawai, dan akun pengguna disimpan di sini. Inilah mengapa proses simpan data Anda sudah berjalan sangat cepat dan stabil.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-bold">
                    <Folder className="w-4 h-4" /> 2. Google Drive (Storage Berkas Fisik)
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Folder Google Drive disiapkan untuk <strong>penyimpanan media / berkas fisik</strong> (seperti foto faktur, scan Surat Jalan, QR Code PNG resolusi tinggi, atau file cadangan ekspor).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/80 rounded-xl border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Mengapa folder di Google Drive Anda masih kosong?</strong>
                  Saat ini seluruh transaksi inventaris dicatat dalam bentuk data angka/teks langsung ke Google Sheets (yang mana sudah berjalan sangat sempurna), sedangkan foto barang dikompresi ringan dan gambar QR dibuat secara otomatis saat dibutuhkan. Folder Google Drive tetap tersambung dan siap jika Anda mengunggah lampiran dokumen Surat Jalan atau menyimpan berkas backup fisik di kemudian hari.
                </div>
              </div>
            </div>

            {/* Storage Parameters Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <HardDrive className="w-4.5 h-4.5 text-blue-600" /> Parameter Kunci Integrasi Google Workspace
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-600" /> ID Spreadsheet Database Utama
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(formData.spreadsheetId, 'ss')}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-normal"
                    >
                      {copiedKey === 'ss' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'ss' ? 'Tersalin' : 'Salin ID'}
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.spreadsheetId}
                    onChange={e => setFormData({ ...formData, spreadsheetId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Folder ID QR Code PNG</label>
                    <input
                      type="text"
                      required
                      value={formData.folderQrId}
                      onChange={e => setFormData({ ...formData, folderQrId: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Folder ID Images Barang</label>
                    <input
                      type="text"
                      required
                      value={formData.folderImagesId}
                      onChange={e => setFormData({ ...formData, folderImagesId: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Folder ID Reports / Surat Jalan</label>
                    <input
                      type="text"
                      required
                      value={formData.folderReportsId}
                      onChange={e => setFormData({ ...formData, folderReportsId: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Folder ID Backup JSON</label>
                    <input
                      type="text"
                      required
                      value={formData.folderBackupId}
                      onChange={e => setFormData({ ...formData, folderBackupId: e.target.value })}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PEMELIHARAAN & BACKUP */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-600" /> Cadangkan & Pemeliharaan Database
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Amankan seluruh data inventaris BMN secara berkala untuk mencegah kehilangan informasi saat pemeliharaan sistem.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-gray-200 bg-slate-50/70 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 text-xs block">Unduh File Backup Lokal (.json)</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Ekspor seluruh konfigurasi dan pengaturan sistem SILAP BMN dalam bentuk berkas JSON aman ke komputer Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadJSONBackup}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Unduh Backup JSON
                  </button>
                </div>

                <div className="p-5 border border-gray-200 bg-slate-50/70 rounded-xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 text-xs block">Sinkronisasi Backup Cloud</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Jalankan simulasi backup otomatis ke Google Drive Folder Backup yang terhubung dengan akun Google Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackup}
                    disabled={isBackupRunning}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isBackupRunning && 'animate-spin'}`} />
                    {isBackupRunning ? 'Proses Backup...' : 'Mulai Sync Backup Drive'}
                  </button>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-red-50/40 border border-red-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-bold">Zona Bahaya — Reset Database Ke Awal</h4>
              </div>
              <p className="text-xs text-red-600 leading-relaxed">
                Tindakan ini akan mengembalikan seluruh data katalog barang, transaksi keluar/masuk, supplier, dan logs ke data bawaan awal. Tindakan ini tidak dapat dibatalkan.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('PERINGATAN SANGAT PENTING: Apakah Anda benar-benar yakin ingin mereset basis data ke kondisi awal semula?')) {
                    onResetDatabase();
                  }
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Setel Ulang Database
              </button>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between shadow-xs">
          <span className="text-xs text-gray-500 font-medium">
            Sistem: <strong className="text-gray-900">{formData.namaInstitusi}</strong>
          </span>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Simpan Semua Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
