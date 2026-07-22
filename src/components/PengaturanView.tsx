/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Folder, RefreshCw, Trash2, ShieldCheck, Check } from 'lucide-react';
import { Settings } from '../types';

interface PengaturanViewProps {
  settings: Settings;
  onSaveSettings: (s: Settings) => void;
  onResetDatabase: () => void;
  onSimulateBackup: () => void;
}

export default function PengaturanView({
  settings,
  onSaveSettings,
  onResetDatabase,
  onSimulateBackup
}: PengaturanViewProps) {
  const [formData, setFormData] = useState<Settings>({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isBackupRunning, setIsBackupRunning] = useState(false);

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
