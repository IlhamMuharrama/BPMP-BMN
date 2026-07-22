/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, ArrowDownLeft, ArrowUpRight, History, Download, FileSpreadsheet } from 'lucide-react';
import { Riwayat } from '../types';

interface RiwayatViewProps {
  riwayat: Riwayat[];
}

export default function RiwayatView({ riwayat }: RiwayatViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'masuk' | 'keluar'>('all');

  const filteredRiwayat = riwayat.filter(item => {
    const matchesSearch =
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barangId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.petugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' ? true : item.tipe.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    // Generate actual CSV content
    const headers = 'ID Transaksi,Tanggal,Tipe,Kode Barang,Nama Barang,Jumlah,Petugas,Keterangan\n';
    const rows = filteredRiwayat
      .map(
        r =>
          `"${r.id}","${new Date(r.tanggal).toLocaleDateString()}","${r.tipe}","${r.barangId}","${
            r.namaBarang
          }",${r.tipe === 'Masuk' ? '+' : '-'}${r.jumlah},"${r.petugas}","${r.keterangan}"`
      )
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Riwayat_Mutasi_BMN_BPMP_Sumsel_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-auto flex-1 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, barang, petugas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Jenis Mutasi</option>
            <option value="masuk">Barang Masuk (+)</option>
            <option value="keluar">Barang Keluar (-)</option>
          </select>
        </div>

        {/* Export action */}
        <button
          onClick={handleExportCSV}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-green-400" /> Ekspor ke Spreadsheet (CSV)
        </button>
      </div>

      {/* Timeline List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <History className="w-4.5 h-4.5 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">Garis Waktu Mutasi Persediaan BMN</h3>
        </div>

        <div className="relative border-l-2 border-gray-100 pl-4 space-y-6 ml-3 py-2">
          {filteredRiwayat.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-6 -ml-4">
              Tidak ada catatan riwayat mutasi ditemukan.
            </div>
          ) : (
            filteredRiwayat.map(r => (
              <div key={r.id} className="relative">
                {/* Dot marker */}
                <span className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                  r.tipe === 'Masuk' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {r.tipe === 'Masuk' ? <ArrowDownLeft className="w-2.5 h-2.5 text-white" /> : <ArrowUpRight className="w-2.5 h-2.5 text-white" />}
                </span>

                {/* Timeline Content */}
                <div className="bg-slate-50 hover:bg-slate-100/60 transition-colors border border-gray-100 p-3.5 rounded-xl text-xs space-y-2">
                  <div className="flex flex-wrap justify-between items-start gap-1.5">
                    <div>
                      <span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600 mr-2">
                        {r.id}
                      </span>
                      <span className="font-semibold text-gray-500">
                        {new Date(r.tanggal).toLocaleDateString('id-ID')} • {new Date(r.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.tipe === 'Masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.tipe === 'Masuk' ? 'Masuk' : 'Keluar'} • {r.tipe === 'Masuk' ? '+' : '-'}{r.jumlah}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm">{r.namaBarang}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-gray-100 pt-2 font-medium">
                    <div>
                      <span className="text-gray-400">Kode Barang: </span>
                      <span className="text-gray-700 font-bold">{r.barangId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Petugas BMN: </span>
                      <span className="text-gray-700 font-bold">{r.petugas}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-400">Keterangan: </span>
                      <span className="text-gray-700">{r.keterangan}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
