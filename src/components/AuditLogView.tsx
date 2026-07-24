/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Shield, RefreshCcw } from 'lucide-react';
import { AuditLog, UserAccount } from '../types';

interface AuditLogViewProps {
  logs: AuditLog[];
  onClearLogs: () => void;
  currentUser: UserAccount;
}

export default function AuditLogView({ logs, onClearLogs, currentUser }: AuditLogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log =>
    log.aktor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.aksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detail.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pelaku, peran, aksi, rincian..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {currentUser.role === 'Administrator' || currentUser.username === 'admin' && (
        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mengarsipkan / mengosongkan seluruh log audit aktivitas lokal?')) {
              onClearLogs();
            }
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-gray-600 cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Kosongkan Log
        </button>
        )}
      </div>

      {/* Terminal logs list */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
            <h3 className="font-bold text-gray-900 text-sm">Buku Catatan Keamanan & Log Aktivitas (Audit Trail)</h3>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
            Sistem Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Stempel Waktu (WIB)</th>
                <th className="p-4">Aktor / Pelaku</th>
                <th className="p-4">Peran (Role)</th>
                <th className="p-4">Aksi / Operasi</th>
                <th className="p-4">Rincian Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    Tidak ada catatan aktivitas terekam.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-gray-500">
                      {new Date(log.tanggal).toLocaleDateString('id-ID')} {new Date(log.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{log.aktor}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.role.includes('Admin') ? 'bg-blue-100 text-blue-700' :
                        log.role.includes('Subbagian') ? 'bg-amber-100 text-amber-700' :
                        log.role.includes('Petugas') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">{log.aksi}</td>
                    <td className="p-4 text-gray-500 max-w-sm font-medium">{log.detail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
