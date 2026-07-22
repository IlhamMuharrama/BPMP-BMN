/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X, Database, Cloud } from 'lucide-react';
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
    nama: 'ILHAM MUHARRAMA',
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
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('bpmp_bmn_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        const loginTime = new Date(parsed.timestamp).getTime();
        const now = new Date().getTime();
        // 12 hours = 12 * 60 * 60 * 1000 = 43200000 ms
        if (now - loginTime < 43200000) {
          return parsed.user;
        } else {
          localStorage.removeItem('bpmp_bmn_session');
        }
      }
    } catch (e) {
      console.error('Failed to parse session:', e);
    }
    return null;
  });

  const handleSetCurrentUser = (user: UserAccount | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('bpmp_bmn_session', JSON.stringify({
        user,
        timestamp: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem('bpmp_bmn_session');
    }
  };
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const firstLoadRef = React.useRef(true);

  // Load from Sheets on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          if (data.Barang && data.Barang.length > 0) setBarangList(data.Barang);
          if (data.Kategori && data.Kategori.length > 0) setKategoriList(data.Kategori);
          if (data.Supplier && data.Supplier.length > 0) setSupplierList(data.Supplier);
          if (data.Unit && data.Unit.length > 0) setUnitList(data.Unit);
          if (data.Satuan && data.Satuan.length > 0) setSatuanList(data.Satuan);
          if (data.Pegawai && data.Pegawai.length > 0) setPegawaiList(data.Pegawai);
          if (data.BarangMasuk && data.BarangMasuk.length > 0) setBarangMasukList(data.BarangMasuk);
          if (data.BarangKeluar && data.BarangKeluar.length > 0) setBarangKeluarList(data.BarangKeluar);
          if (data.Riwayat && data.Riwayat.length > 0) setRiwayatList(data.Riwayat);
          if (data.AuditLog && data.AuditLog.length > 0) setAuditLogsList(data.AuditLog);
          if (data.Accounts && data.Accounts.length > 0) setAccounts(data.Accounts);
          if (data.Settings && data.Settings.length > 0) setSettings(data.Settings[0]);
          if (data.Notifications && data.Notifications.length > 0) setNotificationsList(data.Notifications);
        } else {
          const errData = await res.json();
          setSyncError(`Gagal memuat data: ${errData.error || 'Server error'}`);
        }
      } catch (e: any) {
        console.error("Gagal sinkronisasi data awal:", e);
        setSyncError(`Gagal memuat data: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save to Sheets on change (debounced)
  React.useEffect(() => {
    if (isLoading) return; // Jangan save saat masih loading awal
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return; // Skip save pada render pertama setelah loading
    }

    const handler = setTimeout(async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Barang: barangList,
            Kategori: kategoriList,
            Supplier: supplierList,
            Unit: unitList,
            Satuan: satuanList,
            Pegawai: pegawaiList,
            BarangMasuk: barangMasukList,
            BarangKeluar: barangKeluarList,
            Riwayat: riwayatList,
            AuditLog: auditLogsList,
            Accounts: accounts,
            Settings: settings,
            Notifications: notificationsList
          })
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Server error');
        }
      } catch (e: any) {
        console.error("Gagal menyimpan ke spreadsheet:", e);
        setSyncError(`Gagal menyimpan: ${e.message}`);
      } finally {
        setIsSyncing(false);
      }
    }, 2000); // Debounce 2 detik

    return () => clearTimeout(handler);
  }, [
    barangList, kategoriList, supplierList, unitList, satuanList, pegawaiList,
    barangMasukList, barangKeluarList, riwayatList, auditLogsList, accounts, settings, notificationsList, isLoading
  ]);

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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <Database className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>
          <p className="font-bold text-lg animate-pulse tracking-wide text-indigo-100">Menghubungkan ke Database...</p>
          <p className="text-xs text-indigo-300 mt-2 font-medium">Memuat profil dan data inventaris</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginView
        accounts={accounts}
        onLoginSuccess={(acc) => {
          handleSetCurrentUser(acc);
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
            handleSetCurrentUser(null);
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

      {/* Syncing Indicator */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-6 right-6 bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl px-5 py-3 flex items-center gap-3 border border-slate-700/50 z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 animate-pulse"></div>
            <div className="relative flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400 animate-bounce" />
              <span className="text-sm font-bold text-white tracking-wide">Menyimpan ke Database...</span>
            </div>
          </motion.div>
        )}
        
        {syncError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 right-6 bg-red-50 shadow-xl rounded-xl px-4 py-3 flex flex-col gap-1 border border-red-200 z-50 max-w-sm"
          >
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              Kesalahan Sinkronisasi
            </div>
            <span className="text-xs font-medium text-red-600">{syncError}</span>
            <button 
              onClick={() => setSyncError(null)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
