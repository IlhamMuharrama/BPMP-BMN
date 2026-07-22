/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import { Camera, X, AlertCircle, Check, RefreshCw, Search, PackageCheck, Upload, Image as ImageIcon, SwitchCamera, Sparkles } from 'lucide-react';
import { Barang } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barangId: string) => void;
  barangList: Barang[];
}

interface CameraDevice {
  id: string;
  label: string;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  barangList = []
}: QRScannerModalProps) {
  const [cameraState, setCameraState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedItem, setScannedItem] = useState<Barang | null>(null);
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(null);
  const [manualSearch, setManualSearch] = useState('');
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const qrId = "qr-reader-element-static";

  // Play audio beep on successful QR match
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1400, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext not supported or restricted
    }
  };

  // Extract barang item from decoded QR string
  const parseScannedText = (rawCode: string): Barang | null => {
    if (!rawCode || typeof rawCode !== 'string') return null;
    const text = rawCode.trim();
    if (!text) return null;

    // 1. Direct ID match (case insensitive)
    let matched = barangList.find(b => String(b.id || '').toLowerCase() === text.toLowerCase());
    if (matched) return matched;

    // 2. Extract BRG-xxx pattern via Regex
    const brgMatch = text.match(/(BRG-\d+)/i);
    if (brgMatch) {
      const extractedId = brgMatch[1].toUpperCase();
      matched = barangList.find(b => String(b.id || '').toUpperCase() === extractedId);
      if (matched) return matched;
    }

    // 3. Extract query param 'data=' or 'id='
    if (text.includes('data=')) {
      const dataVal = text.split('data=')[1]?.split('&')[0];
      if (dataVal) {
        const decoded = decodeURIComponent(dataVal).trim().toLowerCase();
        matched = barangList.find(b => String(b.id || '').toLowerCase() === decoded);
        if (matched) return matched;
      }
    }
    if (text.includes('id=')) {
      const idVal = text.split('id=')[1]?.split('&')[0];
      if (idVal) {
        const decoded = decodeURIComponent(idVal).trim().toLowerCase();
        matched = barangList.find(b => String(b.id || '').toLowerCase() === decoded);
        if (matched) return matched;
      }
    }

    // 4. Match against item name
    matched = barangList.find(b => 
      text.toLowerCase().includes(String(b.nama || '').toLowerCase()) ||
      String(b.nama || '').toLowerCase().includes(text.toLowerCase())
    );

    return matched || null;
  };

  // Handle scanned result
  const handleScannedCode = async (decodedText: string, activeScanner = scannerInstance) => {
    const matched = parseScannedText(decodedText);

    if (matched) {
      setScannedItem(matched);
      setCameraState('success');
      playSuccessSound();

      await stopScanner(activeScanner);

      setTimeout(() => {
        onScanSuccess(matched.id);
        onClose();
      }, 1100);
    } else {
      const cleanSnippet = decodedText.length > 30 ? decodedText.substring(0, 30) + '...' : decodedText;
      setErrorMessage(`Kode QR "${cleanSnippet}" dibaca, namun tidak terdaftar di katalog barang BMN.`);
      setCameraState('error');
    }
  };

  // Stop active camera scanner safely
  const stopScanner = async (instanceToStop = scannerInstance) => {
    if (instanceToStop) {
      try {
        if (instanceToStop.isScanning) {
          await instanceToStop.stop();
        }
        await instanceToStop.clear();
      } catch (err) {
        // ignore stop errors
      }
    }
  };

  // Start continuous camera stream scanner
  const startScanner = async (overrideCameraId = selectedCameraId) => {
    setCameraState('scanning');
    setErrorMessage('');
    setScannedItem(null);

    // Give DOM time to mount container element
    setTimeout(async () => {
      try {
        // Stop prior instance if present
        if (scannerInstance) {
          await stopScanner(scannerInstance);
        }

        // Request browser camera permissions explicitly first (trigges prompt in mobile/iframe)
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: "environment" } }
            });
            // Stop temporary stream track
            stream.getTracks().forEach(track => track.stop());
          }
        } catch (permErr) {
          console.log("Explicit camera permission prompt error:", permErr);
        }

        // Fetch camera devices list
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const formatted = cameras.map(c => ({ id: c.id, label: c.label || `Kamera ${c.id.substring(0, 5)}` }));
            setAvailableCameras(formatted);
            if (!overrideCameraId) {
              // Prefer back/rear/environment camera
              const backCam = cameras.find(c => /back|rear|environment|belakang/i.test(c.label));
              overrideCameraId = backCam ? backCam.id : cameras[0].id;
              setSelectedCameraId(overrideCameraId);
            }
          }
        } catch (e) {
          console.log("Could not list cameras:", e);
        }

        const html5QrCode = new Html5Qrcode(qrId);
        setScannerInstance(html5QrCode);

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minEdge * 0.75);
            return { width: Math.max(size, 180), height: Math.max(size, 180) };
          },
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        };

        if (overrideCameraId) {
          await html5QrCode.start(
            overrideCameraId,
            config,
            (decodedText) => handleScannedCode(decodedText, html5QrCode),
            () => {}
          );
        } else {
          // Fallback facingMode environment then user
          try {
            await html5QrCode.start(
              { facingMode: "environment" },
              config,
              (decodedText) => handleScannedCode(decodedText, html5QrCode),
              () => {}
            );
          } catch (envErr) {
            await html5QrCode.start(
              { facingMode: "user" },
              config,
              (decodedText) => handleScannedCode(decodedText, html5QrCode),
              () => {}
            );
          }
        }
      } catch (err: any) {
        console.error("Camera start failed:", err);
        setCameraState('error');
        setErrorMessage(
          err?.message || "Kamera tidak dapat diakses atau izin diblokir browser. Silakan gunakan tombol Upload Foto / Kamera HP di bawah."
        );
      }
    }, 200);
  };

  // Robust canvas JS QR decoder for uploaded or captured image files
  const processImageFile = async (file: File) => {
    if (!file) return;
    setIsProcessingFile(true);
    setErrorMessage('');

    try {
      // 1. Try jsQR canvas engine
      const qrData = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Cap maximum size for fast processing & high contrast recognition
            const maxDim = 1200;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(null);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);

            const result = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth'
            });

            if (result && result.data) {
              resolve(result.data);
            } else {
              // Try unscaled image if scaling failed
              if (img.width !== width || img.height !== height) {
                const fullCanvas = document.createElement('canvas');
                fullCanvas.width = img.width;
                fullCanvas.height = img.height;
                const fullCtx = fullCanvas.getContext('2d');
                if (fullCtx) {
                  fullCtx.drawImage(img, 0, 0);
                  const fullImgData = fullCtx.getImageData(0, 0, img.width, img.height);
                  const fullResult = jsQR(fullImgData.data, fullImgData.width, fullImgData.height, {
                    inversionAttempts: 'attemptBoth'
                  });
                  if (fullResult && fullResult.data) {
                    resolve(fullResult.data);
                    return;
                  }
                }
              }
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });

      if (qrData) {
        setIsProcessingFile(false);
        handleScannedCode(qrData);
        return;
      }

      // 2. Secondary fallback: Html5Qrcode scanFile
      let instance = scannerInstance;
      if (!instance) {
        instance = new Html5Qrcode(qrId);
        setScannerInstance(instance);
      }
      const scanFileResult = await instance.scanFile(file, false);
      setIsProcessingFile(false);

      if (scanFileResult) {
        handleScannedCode(scanFileResult, instance);
      } else {
        setCameraState('error');
        setErrorMessage("QR Code tidak terdeteksi pada gambar foto ini. Pastikan gambar tidak buram dan posisi QR jelas.");
      }
    } catch (err: any) {
      setIsProcessingFile(false);
      setCameraState('error');
      setErrorMessage("Gagal membaca QR Code dari berkas foto. Pastikan posisi gambar tegak & QR Code terlihat jelas.");
    }
  };

  const handleManualSelect = (item: Barang) => {
    setScannedItem(item);
    setCameraState('success');
    playSuccessSound();

    stopScanner();

    setTimeout(() => {
      onScanSuccess(item.id);
      onClose();
    }, 700);
  };

  useEffect(() => {
    if (isOpen) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBarangList = barangList.filter(b => 
    String(b.nama || '').toLowerCase().includes(manualSearch.toLowerCase()) ||
    String(b.id || '').toLowerCase().includes(manualSearch.toLowerCase()) ||
    String(b.kategori || '').toLowerCase().includes(manualSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Camera className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Pemindai QR Code BMN</h3>
              <p className="text-[10px] text-slate-500 font-medium">Multi-Engine: Camera Live, Foto HP, Galeri & Catalog</p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* CAMERA SCANNER DISPLAY */}
          <div className="w-full aspect-square max-w-[260px] mx-auto bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-4 border-slate-200 shadow-inner">
            
            {/* The html5-qrcode element MUST always exist in DOM */}
            <div id={qrId} className={`w-full h-full ${cameraState !== 'scanning' ? 'hidden' : 'block'}`} />

            {cameraState === 'scanning' && (
              <>
                <div className="absolute inset-x-0 h-0.5 bg-red-500 opacity-90 shadow-[0_0_12px_rgba(239,68,68,1)] animate-bounce top-1/2 pointer-events-none" />
                <div className="absolute inset-6 border-2 border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-blue-400 absolute top-0 left-0" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-blue-400 absolute top-0 right-0" />
                  <div className="w-4 h-4 border-b-2 border-l-2 border-blue-400 absolute bottom-0 left-0" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-blue-400 absolute bottom-0 right-0" />
                </div>
              </>
            )}

            {isProcessingFile && (
              <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-4 text-center z-20">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                <p className="text-xs font-bold">Menganalisis Gambar QR Code...</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Dual-engine (jsQR + Html5Qrcode)</p>
              </div>
            )}

            {cameraState === 'success' && scannedItem && (
              <div className="absolute inset-0 bg-blue-600 text-white flex flex-col items-center justify-center p-4 text-center animate-fade-in z-20">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2 animate-scale-up">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <p className="text-[10px] uppercase font-extrabold tracking-widest text-blue-100">Barang Terdeteksi</p>
                <p className="text-sm font-extrabold mt-1 truncate max-w-full px-2">{scannedItem.nama}</p>
                <p className="text-[11px] font-mono mt-0.5 text-blue-200 font-bold">{scannedItem.id}</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="absolute inset-0 bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-4 text-center space-y-2 z-20">
                <AlertCircle className="w-9 h-9 text-amber-500" />
                <p className="text-xs font-bold text-white">Izin Kamera / QR Berada di Luar Jangkauan</p>
                <p className="text-[10px] text-slate-400 leading-snug px-2">
                  {errorMessage || "Sistem atau browser memblokir kamera. Silakan pilih foto QR dari galeri/kamera HP di bawah."}
                </p>
                <button
                  onClick={() => startScanner()}
                  className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Coba Ulang Kamera
                </button>
              </div>
            )}

            {cameraState === 'idle' && (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2 animate-pulse" />
                <button
                  onClick={() => startScanner()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Mulai Pindai Kamera
                </button>
              </div>
            )}
          </div>

          {/* CAMERA SELECTOR / TOGGLE */}
          {availableCameras.length > 1 && cameraState === 'scanning' && (
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <SwitchCamera className="w-3.5 h-3.5 text-blue-600" /> Pilih Perangkat Kamera:
              </span>
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  startScanner(e.target.value);
                }}
                className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
              >
                {availableCameras.map(cam => (
                  <option key={cam.id} value={cam.id}>{cam.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* FALLBACK 1: MOBILE CAMERA CAPTURE & GALLERY UPLOAD */}
          <div className="bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-200/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Pilihan Scan Berkas / Foto QR
              </span>
              <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                100% Works Mobile
              </span>
            </div>

            {/* Hidden inputs */}
            <input
              ref={captureInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files?.[0]) processImageFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) processImageFile(e.target.files[0]);
              }}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => captureInputRef.current?.click()}
                className="py-2.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" /> Ambil Foto HP
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-blue-600" /> Upload Galeri
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center leading-tight">
              Gunakan "Ambil Foto HP" untuk langsung membuka kamera bawaan smartphone Anda atau pilih file QR dari Galeri.
            </p>
          </div>

          {/* FALLBACK 2: MANUAL ITEM CATALOG PICK */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block text-center">
              Atau Pilih Manual dari Katalog Barang
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau kode barang (misal: BRG-001)..."
                value={manualSearch}
                onChange={e => setManualSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
              {filteredBarangList.length > 0 ? (
                filteredBarangList.slice(0, 5).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleManualSelect(item)}
                    className="w-full text-left p-2 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block text-xs group-hover:text-blue-600">{item.nama}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.id} • Rak: {item.lokasiRak}</span>
                    </div>
                    <PackageCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                  </button>
                ))
              ) : (
                <div className="text-center py-2 text-[11px] text-slate-400">
                  Tidak ada barang yang cocok dengan "{manualSearch}".
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup Pemindai
          </button>
        </div>
      </div>
    </div>
  );
}
