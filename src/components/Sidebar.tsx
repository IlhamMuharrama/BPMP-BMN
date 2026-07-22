/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Box,
  FolderTree,
  Users,
  Building,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  FileText,
  Settings as SettingsIcon,
  ShieldAlert,
  CodeXml,
  Menu,
  ChevronLeft,
  ChevronRight,
  Database,
  Contact
} from 'lucide-react';
import { ActiveTab, UserAccount } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  instituteName: string;
  currentUser: UserAccount | null;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  instituteName,
  currentUser
}: SidebarProps) {
  const [openMaster, setOpenMaster] = useState(true);
  const [openTransaksi, setOpenTransaksi] = useState(true);

  const navItemClass = (tab: ActiveTab) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ";
    const active = "bg-[#2563EB] text-white shadow-sm";
    const inactive = "text-white/70 hover:bg-white/5 hover:text-white";
    return base + (activeTab === tab ? active : inactive);
  };

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  const menuSectionHeaderClass = "px-3 mt-4 mb-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between";

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <div
        className={`bg-[#111827] flex flex-col h-screen fixed md:sticky top-0 left-0 transition-all duration-300 z-50 md:z-30 ${
          collapsed
            ? '-translate-x-full md:translate-x-0 md:w-20'
            : 'translate-x-0 md:w-64'
        } w-64`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-[#2563EB] text-white p-2 rounded-lg flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-bold text-white text-sm tracking-tight">BPMP SUMSEL</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Inventory v2.0</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-white/5 rounded-lg text-white/50 hover:text-white hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {/* Close button for mobile */}
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 hover:bg-white/5 rounded-lg text-white/50 hover:text-white md:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {/* Dashboard */}
        <div onClick={() => handleNavClick('dashboard')} className={navItemClass('dashboard')}>
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </div>

        {/* MASTER DATA */}
        <div>
          {!collapsed ? (
            <div className={menuSectionHeaderClass}>
              <span>Main Menu</span>
            </div>
          ) : (
            <div className="h-px bg-white/10 my-4" />
          )}
          <div className="space-y-1">
            <div onClick={() => handleNavClick('barang')} className={navItemClass('barang')}>
              <Box className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Data Master Barang</span>}
            </div>
            <div onClick={() => handleNavClick('kategori')} className={navItemClass('kategori')}>
              <FolderTree className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Kategori</span>}
            </div>
            <div onClick={() => handleNavClick('supplier')} className={navItemClass('supplier')}>
              <Users className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Supplier</span>}
            </div>
            <div onClick={() => handleNavClick('unit')} className={navItemClass('unit')}>
              <Building className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Unit Kerja</span>}
            </div>
            <div onClick={() => handleNavClick('satuan')} className={navItemClass('satuan')}>
              <Scale className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Satuan Barang</span>}
            </div>
            <div onClick={() => handleNavClick('pegawai')} className={navItemClass('pegawai')}>
              <Contact className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Pegawai BMN</span>}
            </div>
          </div>
        </div>

        {/* TRANSAKSI */}
        <div>
          {!collapsed ? (
            <div className={menuSectionHeaderClass}>
              <span>Operational</span>
            </div>
          ) : (
            <div className="h-px bg-white/10 my-4" />
          )}
          <div className="space-y-1">
            <div onClick={() => handleNavClick('barang_masuk')} className={navItemClass('barang_masuk')}>
              <ArrowDownLeft className="w-4 h-4 flex-shrink-0 text-green-400" />
              {!collapsed && <span>Barang Masuk</span>}
            </div>
            <div onClick={() => handleNavClick('barang_keluar')} className={navItemClass('barang_keluar')}>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0 text-red-400" />
              {!collapsed && <span>Barang Keluar</span>}
            </div>
            <div onClick={() => handleNavClick('riwayat')} className={navItemClass('riwayat')}>
              <History className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Riwayat Mutasi</span>}
            </div>
          </div>
        </div>

        {/* LAPORAN & AUDIT */}
        <div>
          {!collapsed ? (
            <div className={menuSectionHeaderClass}>
              <span>Administrasi</span>
            </div>
          ) : (
            <div className="h-px bg-white/10 my-4" />
          )}
          <div className="space-y-1">
            <div onClick={() => handleNavClick('laporan')} className={navItemClass('laporan')}>
              <FileText className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Laporan Stok</span>}
            </div>
            <div onClick={() => handleNavClick('audit_log')} className={navItemClass('audit_log')}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Audit Log</span>}
            </div>
            <div onClick={() => handleNavClick('pengaturan')} className={navItemClass('pengaturan')}>
              <SettingsIcon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Pengaturan</span>}
            </div>
          </div>
        </div>

        {/* ADMINISTRATOR ACCESS (ONLY FOR ADMINS) */}
        {currentUser?.role === 'Administrator' && (
          <div>
            {!collapsed ? (
              <div className={menuSectionHeaderClass}>
                <span>Super Admin</span>
              </div>
            ) : (
              <div className="h-px bg-white/10 my-4" />
            )}
            <div onClick={() => handleNavClick('admin_control')} className={navItemClass('admin_control')}>
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500 animate-pulse" />
              {!collapsed && <span className="font-bold text-red-400">Admin Control</span>}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        {!collapsed ? (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">SISTEM AKTIF</span>
            <span className="text-[11px] text-white/70 font-medium truncate">{instituteName}</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-green-500 mx-auto" />
        )}
      </div>
    </div>
  </>
  );
}
