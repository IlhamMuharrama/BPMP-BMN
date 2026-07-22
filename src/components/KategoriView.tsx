/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { Kategori, Barang } from '../types';

interface KategoriViewProps {
  kategoriList: Kategori[];
  barang: Barang[];
  onAddKategori: (k: Omit<Kategori, 'id'>) => void;
  onEditKategori: (id: string, k: Partial<Kategori>) => void;
  onDeleteKategori: (id: string) => void;
  currentUserRole: string;
}

export default function KategoriView({
  kategoriList,
  barang,
  onAddKategori,
  onEditKategori,
  onDeleteKategori,
  currentUserRole
}: KategoriViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeKategori, setActiveKategori] = useState<Kategori | null>(null);

  const [formData, setFormData] = useState({ nama: '', deskripsi: '' });
  const [editFormData, setEditFormData] = useState<Partial<Kategori>>({});

  const isReadOnly = currentUserRole === 'Viewer' || currentUserRole === 'Pimpinan';

  const getBarangCount = (kategoriNama: string) => {
    return barang.filter(b => b.kategori === kategoriNama).length;
  };

  const handleOpenAdd = () => {
    setFormData({ nama: '', deskripsi: '' });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;
    onAddKategori(formData);
    setShowAddModal(false);
  };

  const handleOpenEdit = (k: Kategori) => {
    setEditFormData(k);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id || !editFormData.nama) return;
    onEditKategori(editFormData.id, editFormData);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">
          Daftar klasifikasi kategori persediaan inventaris BMN BPMP Sumsel.
        </span>
        {!isReadOnly && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        )}
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kategoriList.map(cat => {
          const count = getBarangCount(cat.nama);
          return (
            <div key={cat.id} className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 uppercase">{cat.id}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg text-[10px]">
                    {count} Barang
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{cat.nama}</h4>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{cat.deskripsi || 'Tidak ada deskripsi.'}</p>
              </div>

              {!isReadOnly && (
                <div className="flex justify-end gap-1.5 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 hover:bg-slate-50 text-amber-600 rounded-lg cursor-pointer"
                    title="Ubah Kategori"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (count > 0) {
                        alert(`Tidak dapat menghapus. Ada ${count} item barang menggunakan kategori ini.`);
                        return;
                      }
                      if (confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.nama}"?`)) {
                        onDeleteKategori(cat.id);
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-gray-900 text-sm">Tambah Kategori Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4 text-xs font-medium text-gray-700">
              <div className="space-y-1">
                <label className="block text-gray-500">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ATK, Peralatan IT..."
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-500">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Keterangan klasifikasi..."
                  value={formData.deskripsi}
                  onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-slate-50 cursor-pointer text-gray-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Tambah Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editFormData.id && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-gray-900 text-sm">Edit Kategori ({editFormData.id})</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4 text-xs font-medium text-gray-700">
              <div className="space-y-1">
                <label className="block text-gray-500">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={editFormData.nama}
                  onChange={e => setEditFormData({ ...editFormData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-gray-500">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={editFormData.deskripsi}
                  onChange={e => setEditFormData({ ...editFormData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-slate-50 cursor-pointer text-gray-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
