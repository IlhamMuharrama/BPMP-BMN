/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, User, Shield, Menu, ChevronDown, Check, CheckSquare, LogOut, AlertTriangle, X } from 'lucide-react';
import { ActiveTab, SystemNotification, UserAccount } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  notifications: SystemNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
}

export default function Navbar({
  activeTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  onLogout,
  notifications,
  setNotifications
}: NavbarProps) {
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Pemantauan';
      case 'barang':
        return 'Data Master Barang';
      case 'kategori':
        return 'Kategori Barang';
      case 'supplier':
        return 'Daftar Supplier';
      case 'unit':
        return 'Daftar Unit Kerja';
      case 'satuan':
        return 'Satuan Barang';
      case 'pegawai':
        return 'Daftar Pegawai BMN';
      case 'barang_masuk':
        return 'Transaksi Barang Masuk';
      case 'barang_keluar':
        return 'Transaksi Barang Keluar';
      case 'riwayat':
        return 'Riwayat Mutasi Stok';
      case 'laporan':
        return 'Laporan & Analytics';
      case 'pengaturan':
        return 'Pengaturan Sistem';
      case 'audit_log':
        return 'Audit Log & Keamanan';
      case 'admin_control':
        return 'Admin Control Center';
      default:
        return 'Sistem Persediaan';
    }
  };

  const getBreadcrumbs = () => {
    const root = 'BPMP Sumsel';
    let child = '';
    switch (activeTab) {
      case 'dashboard':
        child = 'Dashboard';
        break;
      case 'barang':
      case 'kategori':
      case 'supplier':
      case 'unit':
      case 'satuan':
      case 'pegawai':
        child = `Data Master / ${getPageTitle()}`;
        break;
      case 'barang_masuk':
      case 'barang_keluar':
      case 'riwayat':
        child = `Transaksi / ${getPageTitle()}`;
        break;
      case 'laporan':
        child = 'Laporan';
        break;
      case 'pengaturan':
        child = 'Pengaturan';
        break;
      case 'audit_log':
        child = 'Keamanan';
        break;
      case 'admin_control':
        child = 'Admin Control';
        break;
    }
    return (
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <span>{root}</span>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{child}</span>
      </div>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 px-4 md:px-6 flex items-center justify-between z-20">
      {/* Title & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 md:hidden flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col min-w-0">
          {getBreadcrumbs()}
          <h1 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight truncate max-w-[115px] xs:max-w-[165px] sm:max-w-none" title={getPageTitle()}>
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Active Profile Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-xs">
            {currentUser ? currentUser.nama.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">
              {currentUser ? currentUser.nama : 'Petugas BMN'}
            </span>
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
              {currentUser ? currentUser.role : 'Petugas'}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationPopover(!showNotificationPopover);
            }}
            className="p-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 relative transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-bounce" />
            )}
          </button>

          {showNotificationPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-40 text-gray-700">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">Pemberitahuan Sistem</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3 h-3" /> Tandai Semua Terbaca
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    Tidak ada pemberitahuan baru
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs flex gap-2 items-start transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/40'}`}
                    >
                      <div className="mt-0.5">
                        {n.tipe === 'stok_habis' && (
                          <span className="w-2 h-2 rounded-full bg-red-500 block" />
                        )}
                        {n.tipe === 'stok_rendah' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 block" />
                        )}
                        {n.tipe === 'sistem' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-700 font-medium ${!n.read && 'font-semibold'}`}>{n.pesan}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(n.tanggal).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkOneRead(n.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                          title="Tandai terbaca"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          title="Keluar Aplikasi"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Konfirmasi Keluar</h3>
                <p className="text-sm text-slate-500 text-center mb-6">
                  Apakah Anda yakin ingin keluar dari sesi saat ini? Anda harus masuk kembali untuk mengakses sistem.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      onLogout();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
