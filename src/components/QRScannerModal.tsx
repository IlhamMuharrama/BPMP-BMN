/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import { Camera, X, AlertCircle, Check, RefreshCw, Search, PackageCheck, Image as ImageIcon, SwitchCamera, Sparkles, ScanLine } from 'lucide-react';
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

  // Audio tone feedback on successful QR match
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignore audio policy limits
    }
  };

  /**
   * Comprehensive Multi-Format Parsing Engine
   * Accepts any decoded string format from 1D/2D QR/Barcodes
   */
  const parseScannedText = (rawCode: string): Barang | null => {
    if (!rawCode || typeof rawCode !== 'string') return null;
    const text = rawCode.trim();
    if (!text) return null;

    // 1. Direct match with b.qrCodeUrl
    let matched = barangList.find(b => b.qrCodeUrl && b.qrCodeUrl.trim() === text);
    if (matched) return matched;

    // 2. Direct ID match (case insensitive)
    matched = barangList.find(b => String(b.id || '').trim().toLowerCase() === text.toLowerCase());
    if (matched) return matched;

    // 3. Check JSON structure (e.g. {"id":"BRG-001"})
    try {
      if (text.startsWith('{') && text.endsWith('}')) {
        const parsed = JSON.parse(text);
        const jsonVal = parsed.id || parsed.code || parsed.barangId || parsed.item_id || parsed.kodeBarang || parsed.nama;
        if (jsonVal && typeof jsonVal === 'string') {
          const jsonMatch = parseScannedText(jsonVal);
          if (jsonMatch) return jsonMatch;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    // 4. Extract query parameters (data=..., id=..., code=..., qr=...) or URL paths
    if (text.includes('http://') || text.includes('https://') || text.includes('?')) {
      try {
        const urlObj = new URL(text);
        const dataParam = urlObj.searchParams.get('data') || urlObj.searchParams.get('id') || urlObj.searchParams.get('code') || urlObj.searchParams.get('qr');
        if (dataParam) {
          const paramMatch = parseScannedText(decodeURIComponent(dataParam));
          if (paramMatch) return paramMatch;
        }
        const segments = urlObj.pathname.split('/').filter(Boolean);
        for (const seg of segments) {
          const segMatch = parseScannedText(decodeURIComponent(seg));
          if (segMatch) return segMatch;
        }
      } catch (e) {
        // Fallthrough if not valid URL
      }
    }

    // 5. Regex "BRG-xxx" pattern (e.g., BRG-001, BRG001, BRG_001, BRG 001)
    const brgMatch = text.match(/BRG[-_\s]?(\d+)/i);
    if (brgMatch) {
      const numPart = brgMatch[1]; // e.g. "001" or "1"
      const formattedId = `BRG-${numPart.padStart(3, '0')}`;
      matched = barangList.find(b => String(b.id || '').toUpperCase() === formattedId.toUpperCase());
      if (matched) return matched;

      // Normalized ID match
      const cleanTarget = text.toLowerCase().replace(/[-_\s]/g, '');
      matched = barangList.find(b => String(b.id || '').toLowerCase().replace(/[-_\s]/g, '') === cleanTarget);
      if (matched) return matched;
    }

    // 6. Number-only match (e.g. "001" or "1" -> BRG-001)
    if (/^\d+$/.test(text)) {
      const numVal = parseInt(text, 10);
      matched = barangList.find(b => {
        const digits = String(b.id || '').match(/\d+/);
        return digits && parseInt(digits[0], 10) === numVal;
      });
      if (matched) return matched;
    }

    // 7. Normalized alphanumeric match (ignore dashes, spaces, slashes)
    const cleanRaw = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanRaw.length >= 2) {
      matched = barangList.find(b => {
        const cleanId = String(b.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanId === cleanRaw;
      });
      if (matched) return matched;
    }

    // 8. Item Name match (exact or substring)
    const lowerText = text.toLowerCase();
    matched = barangList.find(b => {
      const lowerName = String(b.nama || '').toLowerCase();
      return lowerName === lowerText || lowerText.includes(lowerName) || (lowerName.length >= 4 && lowerName.includes(lowerText));
    });
    if (matched) return matched;

    return null;
  };

  // Handle successful match
  const handleScannedCode = async (decodedText: string, activeScanner = scannerInstance) => {
    const matched = parseScannedText(decodedText);

    if (matched) {
      setScannedItem(matched);
      setCameraState('success');
      setErrorMessage('');
      playSuccessSound();

      await stopScanner(activeScanner);

      setTimeout(() => {
        onScanSuccess(matched.id);
        onClose();
      }, 1000);
    } else {
      const snippet = decodedText.length > 40 ? decodedText.substring(0, 40) + '...' : decodedText;
      setErrorMessage(`Kode "${snippet}" berhasil dibaca, namun tidak ditemukan di katalog barang BMN.`);
      setCameraState('error');
    }
  };

  // Stop camera stream safely
  const stopScanner = async (instanceToStop = scannerInstance) => {
    if (instanceToStop) {
      try {
        if (instanceToStop.isScanning) {
          await instanceToStop.stop();
        }
        await instanceToStop.clear();
      } catch (err) {
        // Ignore stop error
      }
    }
  };

  // Start continuous camera stream
  const startScanner = async (overrideCameraId = selectedCameraId) => {
    setCameraState('scanning');
    setErrorMessage('');
    setScannedItem(null);

    setTimeout(async () => {
      try {
        if (scannerInstance) {
          await stopScanner(scannerInstance);
        }

        // Pre-request stream permission to handle mobile/iframe prompts
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const tempStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: "environment" } }
            });
            tempStream.getTracks().forEach(t => t.stop());
          }
        } catch (e) {
          console.log("Pre-request permission notice:", e);
        }

        // List cameras
        try {
          const cameras = await Html5Qrcode.getCameras();
          if (cameras && cameras.length > 0) {
            const formatted = cameras.map(c => ({ id: c.id, label: c.label || `Kamera ${c.id.substring(0, 6)}` }));
            setAvailableCameras(formatted);
            if (!overrideCameraId) {
              const backCam = cameras.find(c => /back|rear|environment|belakang/i.test(c.label));
              overrideCameraId = backCam ? backCam.id : cameras[0].id;
              setSelectedCameraId(overrideCameraId);
            }
          }
        } catch (e) {
          console.log("Camera list failed:", e);
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
            (text) => handleScannedCode(text, html5QrCode),
            () => {}
          );
        } else {
          try {
            await html5QrCode.start(
              { facingMode: "environment" },
              config,
              (text) => handleScannedCode(text, html5QrCode),
              () => {}
            );
          } catch (envErr) {
            await html5QrCode.start(
              { facingMode: "user" },
              config,
              (text) => handleScannedCode(text, html5QrCode),
              () => {}
            );
          }
        }
      } catch (err: any) {
        console.error("Camera start failed:", err);
        setCameraState('error');
        setErrorMessage("Kamera live tidak dapat diakses atau diblokir. Silakan gunakan tombol Ambil Foto HP / Upload Galeri di bawah.");
      }
    }, 150);
  };

  /**
   * Multi-Engine Image File Decoder
   * Engine 1: Native BarcodeDetector (QR + 1D Barcodes: Code128, EAN13, etc.)
   * Engine 2: Multi-Pass jsQR (Normal, Contrast Binarization, Scaled)
   * Engine 3: Html5Qrcode scanFile
   */
  const processImageFile = async (file: File) => {
    if (!file) return;
    setIsProcessingFile(true);
    setErrorMessage('');

    try {
      // --- ENGINE 1: Native Web BarcodeDetector (if supported by browser/Android) ---
      if ('BarcodeDetector' in window) {
        try {
          const detector = new (window as any).BarcodeDetector({
            formats: ['qr_code', 'code_128', 'code_39', 'code_93', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'data_matrix', 'aztec', 'pdf417']
          });
          const imgBitmap = await createImageBitmap(file);
          const detected = await detector.detect(imgBitmap);
          if (detected && detected.length > 0 && detected[0].rawValue) {
            setIsProcessingFile(false);
            handleScannedCode(detected[0].rawValue);
            return;
          }
        } catch (nativeErr) {
          console.log("Native BarcodeDetector pass skipped:", nativeErr);
        }
      }

      // --- ENGINE 2: Multi-Pass jsQR Canvas Decoder ---
      const jsQrResult = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const processCanvas = (targetWidth: number, targetHeight: number, applyBinarize = false) => {
              const canvas = document.createElement('canvas');
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext('2d');
              if (!ctx) return null;

              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);

              // Apply contrast binarization filter if requested
              if (applyBinarize) {
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  const val = avg > 128 ? 255 : 0;
                  data[i] = val;
                  data[i + 1] = val;
                  data[i + 2] = val;
                }
              }

              const res = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: 'attemptBoth'
              });
              return res ? res.data : null;
            };

            // Pass 2A: Standard scaled image (max 1000px)
            const maxDim = 1000;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }

            let code = processCanvas(w, h, false);
            if (code) return resolve(code);

            // Pass 2B: High Contrast Binarize
            code = processCanvas(w, h, true);
            if (code) return resolve(code);

            // Pass 2C: Full Resolution original image
            if (img.width !== w || img.height !== h) {
              code = processCanvas(img.width, img.height, false);
              if (code) return resolve(code);
            }

            resolve(null);
          };
          img.onerror = () => resolve(null);
          img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });

      if (jsQrResult) {
        setIsProcessingFile(false);
        handleScannedCode(jsQrResult);
        return;
      }

      // --- ENGINE 3: Html5Qrcode.scanFile ---
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
        setErrorMessage("QR Code / Barcode tidak terdeteksi dari foto ini. Pastikan posisi gambar cukup terang & tidak buram.");
      }
    } catch (err: any) {
      setIsProcessingFile(false);
      setCameraState('error');
      setErrorMessage("Tidak dapat memproses berkas foto. Pastikan posisi gambar tegak & QR Code / Barcode terlihat jelas.");
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
    }, 600);
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
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ScanLine className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Pemindai QR & Barcode BMN</h3>
              <p className="text-[10px] text-slate-500 font-medium">Auto-Detect: Live Stream, Foto HP, Galeri & Catalog</p>
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
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5">

          {/* PRIMARY OPTION: MOBILE CAMERA CAPTURE & GALLERY UPLOAD */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-3.5 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider text-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Pilihan Utama: Foto HP / Galeri
              </span>
              <span className="text-[9px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full">
                Multi-Engine 100% Works
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

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => captureInputRef.current?.click()}
                className="py-2.5 px-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-blue-600" /> Ambil Foto HP
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-2 bg-blue-800/60 hover:bg-blue-800/90 text-white border border-blue-400/40 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-blue-200" /> Upload Galeri
              </button>
            </div>
            <p className="text-[9.5px] text-blue-100/90 text-center leading-tight pt-0.5">
              Klik "Ambil Foto HP" untuk langsung membuka kamera smartphone Anda tanpa batasan izin browser.
            </p>
          </div>

          {/* LIVE CAMERA DISPLAY */}
          <div className="w-full aspect-square max-w-[240px] mx-auto bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-4 border-slate-200 shadow-inner">
            
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
              <div className="absolute inset-0 bg-slate-900/95 text-white flex flex-col items-center justify-center p-4 text-center z-20">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                <p className="text-xs font-bold">Menganalisis QR / Barcode...</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Scanning via Multi-Engine AI</p>
              </div>
            )}

            {cameraState === 'success' && scannedItem && (
              <div className="absolute inset-0 bg-blue-600 text-white flex flex-col items-center justify-center p-4 text-center animate-fade-in z-20">
                <div className="w-13 h-13 bg-white/20 rounded-full flex items-center justify-center mb-1.5 animate-scale-up">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <p className="text-[10px] uppercase font-extrabold tracking-widest text-blue-100">Barang Terdeteksi</p>
                <p className="text-xs font-extrabold mt-1 truncate max-w-full px-2">{scannedItem.nama}</p>
                <p className="text-[10px] font-mono mt-0.5 text-blue-200 font-bold">{scannedItem.id}</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="absolute inset-0 bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-3 text-center space-y-1.5 z-20">
                <AlertCircle className="w-7 h-7 text-amber-500" />
                <p className="text-xs font-bold text-white">Kamera Stream Live Diblokir</p>
                <p className="text-[9.5px] text-slate-400 leading-snug px-2">
                  {errorMessage || "Kamera tidak dapat diakses. Silakan gunakan tombol Ambil Foto HP / Upload Galeri."}
                </p>
                <button
                  onClick={() => startScanner()}
                  className="mt-1 flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Coba Kamera Live
                </button>
              </div>
            )}

            {cameraState === 'idle' && (
              <div className="text-center p-4">
                <Camera className="w-9 h-9 text-slate-600 mx-auto mb-2 animate-pulse" />
                <button
                  onClick={() => startScanner()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Mulai Kamera Live
                </button>
              </div>
            )}
          </div>

          {/* CAMERA DEVICE SELECTOR */}
          {availableCameras.length > 1 && cameraState === 'scanning' && (
            <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <SwitchCamera className="w-3.5 h-3.5 text-blue-600" /> Kamera Live:
              </span>
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  startScanner(e.target.value);
                }}
                className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-slate-800 focus:outline-none"
              >
                {availableCameras.map(cam => (
                  <option key={cam.id} value={cam.id}>{cam.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* FALLBACK MANUAL SELECTION FROM KATALOG */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block text-center">
              Pilih Langsung dari Katalog Barang BMN
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

            <div className="max-h-32 overflow-y-auto space-y-1 pr-1 text-xs">
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
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50 flex justify-end">
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
