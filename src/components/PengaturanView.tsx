/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Folder, RefreshCw, Trash2, ShieldCheck, Check, HardDrive, FileText, Download, Eye, ExternalLink, CloudUpload } from 'lucide-react';
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
  const [formData, setFormData] = useState<Settings>({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [activeDriveFolder, setActiveDriveFolder] = useState<'Reports' | 'QRCode' | 'Images' | 'Backup'>('Reports');
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<DriveFileItem | null>(null);

  const safeDriveFiles = Array.isArray(driveFiles) ? driveFiles : [];
  const filteredFiles = safeDriveFiles.filter(f => f.folder === activeDriveFolder);

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
    }, 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Saved Toast */}
      {showSavedToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg z-50 flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" /> Pengaturan berhasil disimpan secara lokal dan disinkronisasikan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-slate-50">
          <SettingsIcon className="w-4.5 h-4.5 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">Konfigurasi Umum & Metadata Sistem</h3>
        </div>

        <div className="p-6 space-y-5 text-xs font-medium text-gray-700">
          {/* Institution profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-5">
            <h4 className="font-bold text-gray-900 text-xs sm:col-span-2 uppercase tracking-wider text-gray-400">Profil Lembaga</h4>
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-gray-500">Nama Lembaga (Indonesian Government Body) *</label>
              <input
                type="text"
                required
                value={formData.namaInstitusi}
                onChange={e => setFormData({ ...formData, namaInstitusi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-gray-500">URL Logo Lembaga Kemdikbud</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Drive Folders sync */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-5">
            <div className="sm:col-span-2">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-400">Integrasi Folder Google Drive</h4>
              <p className="text-[10px] text-gray-400 mt-1">ID Folder penyimpanan hasil otomatis dari script Setup.gs di Google Workspace.</p>
            </div>
            <div className="space-y-1">
              <label className="block text-gray-500 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-blue-500" /> Folder ID QR Codes
              </label>
              <input
                type="text"
                required
                value={formData.folderQrId}
                onChange={e => setFormData({ ...formData, folderQrId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-500 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-blue-500" /> Folder ID Images
              </label>
              <input
                type="text"
                required
                value={formData.folderImagesId}
                onChange={e => setFormData({ ...formData, folderImagesId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-500 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-blue-500" /> Folder ID Reports
              </label>
              <input
                type="text"
                required
                value={formData.folderReportsId}
                onChange={e => setFormData({ ...formData, folderReportsId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-500 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-blue-500" /> Folder ID Backup
              </label>
              <input
                type="text"
                required
                value={formData.folderBackupId}
                onChange={e => setFormData({ ...formData, folderBackupId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Active spreadsheet */}
          <div className="space-y-2 pb-5 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-400">Penyimpanan Database Utama (Spreadsheet)</h4>
            <div className="space-y-1">
              <label className="block text-gray-500 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-blue-500" /> Spreadsheet Database ID
              </label>
              <input
                type="text"
                required
                value={formData.spreadsheetId}
                onChange={e => setFormData({ ...formData, spreadsheetId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Alerts setup */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gray-400">Notifikasi & Peringatan</h4>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-xl">
              <div>
                <span className="font-bold text-gray-900 block">Pemberitahuan Stok Rendah</span>
                <span className="text-[10px] text-gray-400 font-medium block">Kirim notifikasi di panel atas ketika stok menyentuh batas minimum</span>
              </div>
              <input
                type="checkbox"
                checked={formData.bilaStokRendahNotif}
                onChange={e => setFormData({ ...formData, bilaStokRendahNotif: e.target.checked })}
                className="w-4.5 h-4.5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-100 rounded-xl">
              <div>
                <span className="font-bold text-gray-900 block">Pemberitahuan Stok Habis</span>
                <span className="text-[10px] text-gray-400 font-medium block">Kirim notifikasi kritis ketika volume persediaan mencapai nol</span>
              </div>
              <input
                type="checkbox"
                checked={formData.bilaStokHabisNotif}
                onChange={e => setFormData({ ...formData, bilaStokHabisNotif: e.target.checked })}
                className="w-4.5 h-4.5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Simpan Konfigurasi
          </button>
        </div>
      </form>

      {/* Google Drive Cloud Storage Explorer */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4.5 h-4.5 text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Penyimpanan Cloud Google Drive</h3>
              <p className="text-[10px] text-gray-500 font-medium">Monitoring berkas Surat Jalan, QR Code, dan Backup Terintegrasi</p>
            </div>
          </div>
          <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" /> Drive Active
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Folder Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => setActiveDriveFolder('Reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeDriveFolder === 'Reports' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" /> Reports / Surat Jalan ({safeDriveFiles.filter(f => f.folder === 'Reports').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveDriveFolder('QRCode')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeDriveFolder === 'QRCode' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" /> Folder QR Code ({safeDriveFiles.filter(f => f.folder === 'QRCode').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveDriveFolder('Backup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeDriveFolder === 'Backup' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" /> Folder Backup ({safeDriveFiles.filter(f => f.folder === 'Backup').length})
            </button>
          </div>

          {/* File List in Folder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold px-1">
              <span>Nama Berkas & Dokumen</span>
              <span>Ukuran & Pengunggah</span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <CloudUpload className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold">Folder Drive Kosong</p>
                <p className="text-[10px]">Unggah Surat Jalan atau Faktur di menu Barang Masuk untuk otomatis menyimpan file ke folder ini.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {filteredFiles.map(file => (
                  <div key={file.id} className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-blue-50/50 transition-all">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs block truncate">{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Disimpan: {new Date(file.uploadedAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="font-mono text-[10px] text-slate-600 font-bold block">{file.size}</span>
                        <span className="text-[9px] text-slate-400 block">{file.uploadedBy}</span>
                      </div>

                      <div className="flex gap-1">
                        {file.dataUrl ? (
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Unduh
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => alert(`Membuka simulasi berkas Google Drive: ${file.name}`)}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced utilities: backup, reset */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-red-600" />
          Alat & Pemeliharaan Sistem
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Backup */}
          <div className="p-4 border border-gray-100 bg-slate-50/50 rounded-xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="font-bold text-gray-900 text-xs block">Cadangkan Data (Backup ke Drive)</span>
              <span className="text-[10px] text-gray-400 font-medium block">
                Menyimpan seluruh katalog barang, mutasi riwayat, dan logs ke bentuk file JSON terenkripsi ke folder Backup di Google Drive Anda.
              </span>
            </div>
            <button
              onClick={handleBackup}
              disabled={isBackupRunning}
              className="mt-3.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isBackupRunning && 'animate-spin'}`} />
              {isBackupRunning ? 'Memproses Backup...' : 'Mulai Cadangkan Sekarang'}
            </button>
          </div>

          {/* Reset */}
          <div className="p-4 border border-red-100 bg-red-50/20 rounded-xl flex flex-col justify-between">
            <div className="space-y-1">
              <span className="font-bold text-red-800 text-xs block">Reset Basis Data Utama</span>
              <span className="text-[10px] text-red-700 font-medium block">
                PERINGATAN: Tindakan ini akan mengembalikan seluruh data barang, kategori, supplier, unit, dan transaksi ke kondisi awal semula.
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('APAKAH ANDA YAKIN? Tindakan ini akan menghapus seluruh modifikasi data Anda dan menyetel ulang database ke kondisi default.')) {
                  onResetDatabase();
                }
              }}
              className="mt-3.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Setel Ulang Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
