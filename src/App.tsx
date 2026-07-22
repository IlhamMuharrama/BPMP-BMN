/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import BarangView from './components/BarangView';
import KategoriView from './components/KategoriView';
import SupplierView from './components/SupplierView';
import UnitView from './components/UnitView';
import SatuanView from './components/SatuanView';
import TransaksiMasukView from './components/TransaksiMasukView';
import TransaksiKeluarView from './components/TransaksiKeluarView';
import RiwayatView from './components/RiwayatView';
import LaporanView from './components/LaporanView';
import PengaturanView from './components/PengaturanView';
import AuditLogView from './components/AuditLogView';
import PegawaiView from './components/PegawaiView';
import LoginView from './components/LoginView';
import AdminControlView from './components/AdminControlView';

import {
  INITIAL_BARANG,
  INITIAL_KATEGORI,
  INITIAL_SUPPLIER,
  INITIAL_UNIT,
  INITIAL_SATUAN,
  INITIAL_BARANG_MASUK,
  INITIAL_BARANG_KELUAR,
  INITIAL_RIWAYAT,
  INITIAL_AUDIT_LOG,
  INITIAL_NOTIFICATION,
  DEFAULT_SETTINGS,
  INITIAL_PEGAWAI
} from './data';

import {
  Barang,
  Kategori,
  Supplier,
  Unit,
  Satuan,
  BarangMasuk,
  BarangKeluar,
  Riwayat,
  AuditLog,
  SystemNotification,
  Settings,
  ActiveTab,
  Pegawai,
  UserAccount
} from './types';

const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    username: 'admin',
    nama: 'M. Syarif, S.Sos.',
    nip: '197509121999031002',
    jabatan: 'Kepala Subbagian Umum / Administrator',
    telepon: '081178901234',
    password: 'admin',
    role: 'Administrator',
    status: 'Disetujui',
    registeredAt: '2026-07-15T08:00:00Z'
  },
  {
    username: 'petugas',
    nama: 'Roni Setiawan',
    nip: '198804152014021003',
    jabatan: 'Petugas BMN',
    telepon: '081271234567',
    password: 'bmn',
    role: 'Petugas BMN',
    status: 'Disetujui',
    registeredAt: '2026-07-18T08:00:00Z'
  },
  {
    username: 'budi_baru',
    nama: 'Budi Budiman',
    nip: '199112022019031005',
    jabatan: 'Petugas BMN Baru',
    telepon: '08981741680',
    password: 'budi',
    role: 'Petugas BMN',
    status: 'Pending',
    registeredAt: '2026-07-20T11:45:00Z'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Core Authentication states
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);

  // Core database states
  const [barangList, setBarangList] = useState<Barang[]>(INITIAL_BARANG);
  const [kategoriList, setKategoriList] = useState<Kategori[]>(INITIAL_KATEGORI);
  const [supplierList, setSupplierList] = useState<Supplier[]>(INITIAL_SUPPLIER);
  const [unitList, setUnitList] = useState<Unit[]>(INITIAL_UNIT);
  const [satuanList, setSatuanList] = useState<Satuan[]>(INITIAL_SATUAN);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(INITIAL_PEGAWAI);
  const [barangMasukList, setBarangMasukList] = useState<BarangMasuk[]>(INITIAL_BARANG_MASUK);
  const [barangKeluarList, setBarangKeluarList] = useState<BarangKeluar[]>(INITIAL_BARANG_KELUAR);
  const [riwayatList, setRiwayatList] = useState<Riwayat[]>(INITIAL_RIWAYAT);
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>(INITIAL_AUDIT_LOG);
  const [notificationsList, setNotificationsList] = useState<SystemNotification[]>(INITIAL_NOTIFICATION);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // State for item quick mutation from dashboard
  const [quickAddBarangId, setQuickAddBarangId] = useState<string>('');

  const currentRole = currentUser ? currentUser.role : 'Petugas BMN';
  const currentUserActor = currentUser ? currentUser.nama : 'Tamu Pengunjung';

  // Audit Logging Helper
  const writeAuditLog = (aksi: string, detail: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString(),
      aktor: currentUserActor,
      role: currentRole,
      aksi,
      detail
    };
    setAuditLogsList(prev => [newLog, ...prev]);
  };

  // Add Notification Helper
  const sendSystemNotification = (tipe: 'stok_rendah' | 'stok_habis' | 'sistem', pesan: string, bId?: string) => {
    const newNotif: SystemNotification = {
      id: `NOT-${Date.now().toString().slice(-6)}`,
      tipe,
      pesan,
      tanggal: new Date().toISOString(),
      read: false,
      barangId: bId
    };
    setNotificationsList(prev => [newNotif, ...prev]);
  };

  // --- CATALOG CRUD CONTROLLERS ---

  const handleAddBarang = (item: Omit<Barang, 'id' | 'qrCodeUrl' | 'createdAt' | 'updatedAt'>) => {
    const newId = `BRG-${String(barangList.length + 1).padStart(3, '0')}`;
    const newBarang: Barang = {
      ...item,
      id: newId,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${newId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBarangList(prev => [...prev, newBarang]);
    writeAuditLog('Tambah Barang', `Mendaftarkan barang baru ke katalog BMN: "${item.nama}" (${newId})`);
  };

  const handleEditBarang = (id: string, updated: Partial<Barang>) => {
    setBarangList(prev => prev.map(b => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b)));
    writeAuditLog('Ubah Barang', `Mengubah spesifikasi katalog barang: "${updated.nama || id}"`);
  };

  const handleDeleteBarang = (id: string) => {
    setBarangList(prev => prev.filter(b => b.id !== id));
    writeAuditLog('Hapus Barang', `Menghapus item barang BMN dari katalog: ID ${id}`);
  };

  const handleAddKategori = (kat: Omit<Kategori, 'id'>) => {
    const newId = `KAT-${String(kategoriList.length + 1).padStart(3, '0')}`;
    setKategoriList(prev => [...prev, { ...kat, id: newId }]);
    writeAuditLog('Tambah Kategori', `Mendaftarkan kategori baru: "${kat.nama}" (${newId})`);
  };

  const handleEditKategori = (id: string, updated: Partial<Kategori>) => {
    setKategoriList(prev => prev.map(k => (k.id === id ? { ...k, ...updated } : k)));
    writeAuditLog('Ubah Kategori', `Mengubah kategori: "${updated.nama || id}"`);
  };

  const handleDeleteKategori = (id: string) => {
    setKategoriList(prev => prev.filter(k => k.id !== id));
    writeAuditLog('Hapus Kategori', `Menghapus kategori: ID ${id}`);
  };

  const handleAddSupplier = (sup: Omit<Supplier, 'id'>) => {
    const newId = `SUP-${String(supplierList.length + 1).padStart(3, '0')}`;
    setSupplierList(prev => [...prev, { ...sup, id: newId }]);
    writeAuditLog('Tambah Supplier', `Mendaftarkan supplier penyedia baru: "${sup.nama}" (${newId})`);
  };

  const handleEditSupplier = (id: string, updated: Partial<Supplier>) => {
    setSupplierList(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    writeAuditLog('Ubah Supplier', `Mengubah rincian supplier: "${updated.nama || id}"`);
  };

  const handleDeleteSupplier = (id: string) => {
    setSupplierList(prev => prev.filter(s => s.id !== id));
    writeAuditLog('Hapus Supplier', `Menghapus supplier: ID ${id}`);
  };

  const handleAddUnit = (un: Omit<Unit, 'id'>) => {
    const newId = `UNT-${String(unitList.length + 1).padStart(3, '0')}`;
    setUnitList(prev => [...prev, { ...un, id: newId }]);
    writeAuditLog('Tambah Unit Kerja', `Mendaftarkan unit kerja baru: "${un.nama}" (${newId})`);
  };

  const handleEditUnit = (id: string, updated: Partial<Unit>) => {
    setUnitList(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
    writeAuditLog('Ubah Unit Kerja', `Mengubah unit kerja: "${updated.nama || id}"`);
  };

  const handleDeleteUnit = (id: string) => {
    setUnitList(prev => prev.filter(u => u.id !== id));
    writeAuditLog('Hapus Unit Kerja', `Menghapus unit kerja: ID ${id}`);
  };

  const handleAddSatuan = (sat: Omit<Satuan, 'id'>) => {
    const newId = `SAT-${String(satuanList.length + 1).padStart(3, '0')}`;
    setSatuanList(prev => [...prev, { ...sat, id: newId }]);
    writeAuditLog('Tambah Satuan', `Mendaftarkan satuan ukuran baru: "${sat.nama}" (${newId})`);
  };

  const handleEditSatuan = (id: string, updated: Partial<Satuan>) => {
    setSatuanList(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    writeAuditLog('Ubah Satuan', `Mengubah satuan ukuran: "${updated.nama || id}"`);
  };

  const handleDeleteSatuan = (id: string) => {
    setSatuanList(prev => prev.filter(s => s.id !== id));
    writeAuditLog('Hapus Satuan', `Menghapus satuan ukuran: ID ${id}`);
  };

  const handleAddPegawai = (peg: Omit<Pegawai, 'id'>) => {
    const newId = `PGW-${String(pegawaiList.length + 1).padStart(3, '0')}`;
    setPegawaiList(prev => [...prev, { ...peg, id: newId }]);
    writeAuditLog('Tambah Pegawai BMN', `Mendaftarkan pegawai BMN baru: "${peg.nama}" (${newId})`);
  };

  const handleEditPegawai = (id: string, updated: Partial<Pegawai>) => {
    setPegawaiList(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    writeAuditLog('Ubah Pegawai BMN', `Mengubah informasi pegawai BMN: "${updated.nama || id}"`);
  };

  const handleDeletePegawai = (id: string) => {
    setPegawaiList(prev => prev.filter(p => p.id !== id));
    writeAuditLog('Hapus Pegawai BMN', `Menghapus pegawai BMN: ID ${id}`);
  };

  // --- TRANS MUTATION CONTROLLERS ---

  const handleProcessTransaksiMasuk = (trans: Omit<BarangMasuk, 'id' | 'tanggal'>) => {
    const newId = `TRM-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(barangMasukList.length + 1).padStart(2, '0')}`;
    const timestamp = new Date().toISOString();

    const newTrans: BarangMasuk = {
      ...trans,
      id: newId,
      tanggal: timestamp
    };

    // 1. Append inbound history
    setBarangMasukList(prev => [newTrans, ...prev]);

    // 2. Increase stock
    setBarangList(prev =>
      prev.map(b => (b.id === trans.barangId ? { ...b, stokSekarang: b.stokSekarang + trans.jumlah } : b))
    );

    // 3. Log mutation timeline
    const newRiwayat: Riwayat = {
      id: newId,
      tanggal: timestamp,
      tipe: 'Masuk',
      barangId: trans.barangId,
      namaBarang: trans.namaBarang,
      jumlah: trans.jumlah,
      petugas: trans.petugas,
      keterangan: `Barang masuk penyedia ${trans.supplier}. ${trans.catatan || ''}`
    };
    setRiwayatList(prev => [newRiwayat, ...prev]);

    writeAuditLog(
      'Transaksi Masuk',
      `Menerima barang masuk: ${trans.jumlah} unit "${trans.namaBarang}" dari ${trans.supplier} (${newId})`
    );
  };

  const handleProcessTransaksiKeluar = (trans: Omit<BarangKeluar, 'id' | 'tanggal' | 'statusPersetujuan'>) => {
    const newId = `TRK-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(barangKeluarList.length + 1).padStart(2, '0')}`;
    const timestamp = new Date().toISOString();

    const newTrans: BarangKeluar = {
      ...trans,
      id: newId,
      tanggal: timestamp,
      statusPersetujuan: 'Disetujui'
    };

    // 1. Append to outbound list with "Disetujui" status
    setBarangKeluarList(prev => [newTrans, ...prev]);

    // 2. Decrease stock immediately
    const vol = trans.jumlah;
    const bId = trans.barangId;
    setBarangList(prev =>
      prev.map(b => {
        if (b.id === bId) {
          const nextStock = Math.max(0, b.stokSekarang - vol);

          // Trigger stock level warnings
          if (nextStock === 0) {
            sendSystemNotification('stok_habis', `PERINGATAN KRITIS: Stok "${b.nama}" habis (0 unit)!`, bId);
          } else if (nextStock < b.stokMin) {
            sendSystemNotification('stok_rendah', `Peringatan: Stok "${b.nama}" sisa ${nextStock} unit (dibawah minimum ${b.stokMin}).`, bId);
          }

          return { ...b, stokSekarang: nextStock };
        }
        return b;
      })
    );

    // 3. Log mutation timeline immediately
    const newRiwayat: Riwayat = {
      id: newId,
      tanggal: timestamp,
      tipe: 'Keluar',
      barangId: bId,
      namaBarang: trans.namaBarang,
      jumlah: vol,
      petugas: trans.petugas,
      keterangan: `Didistribusikan ke unit ${trans.unitId}. Keperluan: ${trans.keperluan}. ${trans.catatan || ''}`
    };
    setRiwayatList(prev => [newRiwayat, ...prev]);

    writeAuditLog(
      'Transaksi Keluar',
      `Mengeluarkan barang persediaan: ${trans.jumlah} unit "${trans.namaBarang}" untuk ${trans.unitId} (${newId})`
    );
  };

  const handleApproveRejectTransaksiKeluar = (id: string, status: 'Disetujui' | 'Ditolak') => {
    const timestamp = new Date().toISOString();
    let transObj: BarangKeluar | undefined;

    setBarangKeluarList(prev =>
      prev.map(t => {
        if (t.id === id) {
          transObj = t;
          return { ...t, statusPersetujuan: status };
        }
        return t;
      })
    );

    if (!transObj) return;

    if (status === 'Disetujui') {
      const vol = transObj.jumlah;
      const bId = transObj.barangId;

      // 1. Decrease inventory catalog stock
      setBarangList(prev => {
        return prev.map(b => {
          if (b.id === bId) {
            const nextStock = Math.max(0, b.stokSekarang - vol);

            // Trigger stock level warnings
            if (nextStock === 0) {
              sendSystemNotification('stok_habis', `PERINGATAN KRITIS: Stok "${b.nama}" habis (0 unit)!`, bId);
            } else if (nextStock < b.stokMin) {
              sendSystemNotification('stok_rendah', `Peringatan: Stok "${b.nama}" sisa ${nextStock} unit (dibawah minimum ${b.stokMin}).`, bId);
            }

            return { ...b, stokSekarang: nextStock };
          }
          return b;
        });
      });

      // 2. Log mutation timeline
      const newRiwayat: Riwayat = {
        id,
        tanggal: timestamp,
        tipe: 'Keluar',
        barangId: bId,
        namaBarang: transObj.namaBarang,
        jumlah: vol,
        petugas: currentUserActor,
        keterangan: `Didistribusikan ke unit ${transObj.unitId}. Keperluan: ${transObj.keperluan}`
      };
      setRiwayatList(prev => [newRiwayat, ...prev]);
    }

    writeAuditLog(
      `Approval ${status}`,
      `Keputusan otorisasi barang keluar ${id}: status "${status}" oleh ${currentUserActor}`
    );
  };

  // --- GENERAL ACTIONS ---

  const handleSaveSettings = (updated: Settings) => {
    setSettings(updated);
    writeAuditLog('Ubah Setelan', 'Memperbarui konfigurasi parameter sistem BMN dan Google Drive Sync ID.');
  };

  const handleResetDatabase = () => {
    setBarangList(INITIAL_BARANG);
    setKategoriList(INITIAL_KATEGORI);
    setSupplierList(INITIAL_SUPPLIER);
    setUnitList(INITIAL_UNIT);
    setSatuanList(INITIAL_SATUAN);
    setPegawaiList(INITIAL_PEGAWAI);
    setBarangMasukList(INITIAL_BARANG_MASUK);
    setBarangKeluarList(INITIAL_BARANG_KELUAR);
    setRiwayatList(INITIAL_RIWAYAT);
    setNotificationsList(INITIAL_NOTIFICATION);
    setSettings(DEFAULT_SETTINGS);

    // Reset logs with single starting row
    const starterLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString(),
      aktor: currentUserActor,
      role: currentRole,
      aksi: 'Sistem Reset',
      detail: 'Seluruh basis data utama di-restore ke kondisi awal lembaga.'
    };
    setAuditLogsList([starterLog]);
  };

  const handleSimulateBackup = () => {
    writeAuditLog(
      'Backup Database',
      `Berhasil mengekspor cadangan database lengkap ke Google Drive file "backup_bpmp_${new Date().toISOString().slice(0, 10)}.json"`
    );
  };

  const handleClearNotifications = () => {
    setNotificationsList([]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleQuickAddStock = (barangId: string) => {
    setQuickAddBarangId(barangId);
    setActiveTab('barang_masuk');
  };

  // Stats today count
  const todayStr = new Date().toISOString().slice(0, 10);
  const barangMasukToday = barangMasukList.filter(t => t.tanggal.startsWith(todayStr)).length;
  const barangKeluarToday = barangKeluarList.filter(t => t.tanggal.startsWith(todayStr)).length;

  if (!currentUser) {
    return (
      <LoginView
        accounts={accounts}
        onLoginSuccess={(acc) => {
          setCurrentUser(acc);
          setActiveTab('dashboard');
          // Write login log
          const newLog: AuditLog = {
            id: `LOG-${Date.now().toString().slice(-6)}`,
            tanggal: new Date().toISOString(),
            aktor: acc.nama,
            role: acc.role,
            aksi: 'Login',
            detail: `Sesi login baru dimulai oleh ${acc.nama} (${acc.role}) pada peranti desktop`
          };
          setAuditLogsList(prev => [newLog, ...prev]);
        }}
        onRegisterAccount={(newAcc) => {
          setAccounts(prev => [...prev, newAcc]);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans antialiased select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        instituteName={settings.namaInstitusi}
        currentUser={currentUser}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentUser={currentUser}
          onLogout={() => {
            writeAuditLog('Logout', `Sesi diakhiri oleh ${currentUser.nama}`);
            setCurrentUser(null);
          }}
          notifications={notificationsList}
          setNotifications={setNotificationsList}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  barang={barangList}
                  categoriesCount={kategoriList.length}
                  suppliersCount={supplierList.length}
                  barangMasukCountToday={barangMasukToday}
                  barangKeluarCountToday={barangKeluarToday}
                  recentLogs={auditLogsList.slice(0, 5)}
                  setActiveTab={setActiveTab}
                  setQuickAddBarangId={handleQuickAddStock}
                  unitList={unitList}
                  pegawaiList={pegawaiList}
                  onProcessTransaksi={handleProcessTransaksiKeluar}
                />
              )}

              {activeTab === 'barang' && (
                <BarangView
                  barang={barangList}
                  kategoriList={kategoriList}
                  supplierList={supplierList}
                  satuanList={satuanList}
                  onAddBarang={handleAddBarang}
                  onEditBarang={handleEditBarang}
                  onDeleteBarang={handleDeleteBarang}
                  currentUserRole={currentRole}
                />
              )}

              {activeTab === 'kategori' && (
                <KategoriView
                  kategoriList={kategoriList}
                  barang={barangList}
                  onAddKategori={handleAddKategori}
                  onEditKategori={handleEditKategori}
                  onDeleteKategori={handleDeleteKategori}
                  currentUserRole={currentRole}
                />
              )}

              {activeTab === 'supplier' && (
                <SupplierView
                  supplierList={supplierList}
                  onAddSupplier={handleAddSupplier}
                  onEditSupplier={handleEditSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                  currentUserRole={currentRole}
                />
              )}

              {activeTab === 'unit' && (
                <UnitView
                  unitList={unitList}
                  onAddUnit={handleAddUnit}
                  onEditUnit={handleEditUnit}
                  onDeleteUnit={handleDeleteUnit}
                  currentUserRole={currentRole}
                  pegawaiList={pegawaiList}
                />
              )}

              {activeTab === 'satuan' && (
                <SatuanView
                  satuanList={satuanList}
                  onAddSatuan={handleAddSatuan}
                  onEditSatuan={handleEditSatuan}
                  onDeleteSatuan={handleDeleteSatuan}
                  currentUserRole={currentRole}
                />
              )}

              {activeTab === 'pegawai' && (
                <PegawaiView
                  pegawaiList={pegawaiList}
                  onAddPegawai={handleAddPegawai}
                  onEditPegawai={handleEditPegawai}
                  onDeletePegawai={handleDeletePegawai}
                  currentUserRole={currentRole}
                />
              )}

              {activeTab === 'barang_masuk' && (
                <TransaksiMasukView
                  barangList={barangList}
                  supplierList={supplierList}
                  transaksiList={barangMasukList}
                  onProcessTransaksi={handleProcessTransaksiMasuk}
                  currentUserRole={currentRole}
                  quickAddBarangId={quickAddBarangId}
                  clearQuickAdd={() => setQuickAddBarangId('')}
                  pegawaiList={pegawaiList}
                />
              )}

              {activeTab === 'barang_keluar' && (
                <TransaksiKeluarView
                  barangList={barangList}
                  unitList={unitList}
                  transaksiList={barangKeluarList}
                  onProcessTransaksi={handleProcessTransaksiKeluar}
                  onApproveRejectTransaksi={handleApproveRejectTransaksiKeluar}
                  currentUserRole={currentRole}
                  quickAddBarangId={quickAddBarangId}
                  clearQuickAdd={() => setQuickAddBarangId('')}
                  pegawaiList={pegawaiList}
                />
              )}

              {activeTab === 'riwayat' && <RiwayatView riwayat={riwayatList} />}

              {activeTab === 'laporan' && (
                <LaporanView barang={barangList} riwayat={riwayatList} instituteName={settings.namaInstitusi} />
              )}

              {activeTab === 'pengaturan' && (
                <PengaturanView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  onResetDatabase={handleResetDatabase}
                  onSimulateBackup={handleSimulateBackup}
                />
              )}

              {activeTab === 'audit_log' && <AuditLogView logs={auditLogsList} onClearLogs={() => setAuditLogsList([])} />}

              {activeTab === 'admin_control' && currentUser?.role === 'Administrator' && (
                <AdminControlView
                  accounts={accounts}
                  barangList={barangList}
                  riwayatList={riwayatList}
                  settings={settings}
                  onApproveAccount={(username) => {
                    setAccounts(prev => prev.map(acc => acc.username === username ? { ...acc, status: 'Disetujui' } : acc));
                    writeAuditLog('Konfirmasi Akun', `Menyetujui pembuatan akun pegawai: ${username}`);
                  }}
                  onRejectAccount={(username) => {
                    setAccounts(prev => prev.map(acc => acc.username === username ? { ...acc, status: 'Ditolak' } : acc));
                    writeAuditLog('Penolakan Akun', `Menolak pendaftaran akun pegawai: ${username}`);
                  }}
                  onDeleteAccount={(username) => {
                    setAccounts(prev => prev.filter(acc => acc.username !== username));
                    writeAuditLog('Hapus Akun', `Menghapus pendaftaran akun pegawai: ${username}`);
                  }}
                  onUpdatePassword={(username, newPassword) => {
                    setAccounts(prev => prev.map(acc => acc.username === username ? { ...acc, password: newPassword } : acc));
                    writeAuditLog('Ubah Sandi', `Mengubah kata sandi untuk pegawai: ${username}`);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
