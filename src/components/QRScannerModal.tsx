/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, Sparkles, Check, Play, RefreshCw } from 'lucide-react';
import { Barang } from '../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (barangId: string) => void;
  barangList: Barang[];
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  barangList
}: QRScannerModalProps) {
  const [cameraState, setCameraState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedItem, setScannedItem] = useState<Barang | null>(null);
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(null);

  const qrReaderRef = useRef<HTMLDivElement>(null);
  const qrId = "qr-reader-element";

  // Start real camera scanner
  const startScanner = async () => {
    setCameraState('scanning');
    setErrorMessage('');
    setScannedItem(null);

    // Give the DOM a moment to mount the element
    setTimeout(async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const html5QrCode = new Html5Qrcode(qrId);
          setScannerInstance(html5QrCode);

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * 0.8);
                return { width: qrboxSize, height: qrboxSize };
              }
            },
            (decodedText) => {
              // On QR code scanned successfully
              handleScannedCode(decodedText, html5QrCode);
            },
            () => {
              // Silent on scan failure (seeking)
            }
          );
        } else {
          throw new Error("Kamera tidak ditemukan pada perangkat Anda.");
        }
      } catch (err: any) {
        console.error("Camera scanner error:", err);
        setCameraState('error');
        setErrorMessage(
          err?.message || "Izin kamera diblokir atau browser tidak mendukung akses kamera dalam frame ini."
        );
      }
    }, 150);
  };

  const stopScanner = async (instanceToStop = scannerInstance) => {
    if (instanceToStop && instanceToStop.isScanning) {
      try {
        await instanceToStop.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  const handleScannedCode = async (code: string, activeScanner = scannerInstance) => {
    // Format could be BRG-001 or url with BRG-001
    let cleanCode = code.trim();
    if (cleanCode.includes('data=')) {
      const parts = cleanCode.split('data=');
      cleanCode = parts[1] || cleanCode;
    }

    const matched = barangList.find(b => String(b.id || '').toLowerCase() === cleanCode.toLowerCase() || String(b.nama || '').toLowerCase().includes(cleanCode.toLowerCase()));

    if (matched) {
      setScannedItem(matched);
      setCameraState('success');
      
      // Play a satisfying high-pitched success sound (simulated beep)
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // beep pitch
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        // AudioContext blocked or unsupported
      }

      // Stop camera before closing
      await stopScanner(activeScanner);

      // Trigger success callback after 1.5s visual feedback
      setTimeout(() => {
        onScanSuccess(matched.id);
        onClose();
      }, 1500);
    } else {
      // Unrecognized code
      setErrorMessage(`Format QR Code "${cleanCode}" tidak dikenali sebagai kode barang BMN.`);
      setCameraState('error');
    }
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#2563EB]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pindai QR Code Barang BMN</h3>
              <p className="text-[10px] text-slate-500 font-medium">Dekatkan QR barang ke kamera</p>
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
        <div className="p-5 flex-1 flex flex-col items-center justify-center space-y-4">
          
          {/* Scanner Viewport */}
          <div className="w-full aspect-square max-w-[280px] bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border-4 border-slate-200 shadow-inner">
            
            {cameraState === 'scanning' && (
              <>
                {/* Scanner container for html5-qrcode */}
                <div id={qrId} ref={qrReaderRef} className="w-full h-full" />
                
                {/* Laser scan animation overlay */}
                <div className="absolute inset-x-0 h-0.5 bg-red-500 opacity-70 shadow-[0_0_8px_rgba(239,68,68,1)] animate-bounce top-1/2 pointer-events-none" />
                
                {/* Crosshair guidelines */}
                <div className="absolute inset-8 border border-white/20 rounded pointer-events-none" />
              </>
            )}

            {cameraState === 'success' && scannedItem && (
              <div className="absolute inset-0 bg-[#2563EB] text-white flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 animate-scale-up">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/80">Scan Berhasil</p>
                <p className="text-sm font-extrabold mt-1 truncate max-w-full">{scannedItem.nama}</p>
                <p className="text-[11px] font-mono mt-0.5 text-blue-100">{scannedItem.id}</p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="absolute inset-0 bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-5 text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mb-2" />
                <p className="text-xs font-bold text-white mb-1">Akses Kamera Terkendala</p>
                <p className="text-[10px] leading-relaxed text-slate-400">
                  {errorMessage || "Izin kamera diblokir atau tidak didukung dalam iframe ini."}
                </p>
                <button
                  onClick={startScanner}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Coba Lagi
                </button>
              </div>
            )}

            {cameraState === 'idle' && (
              <div className="text-center p-4">
                <Camera className="w-10 h-10 text-slate-600 mx-auto mb-2 animate-pulse" />
                <button
                  onClick={startScanner}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Mulai Kamera
                </button>
              </div>
            )}
          </div>

          {/* FALLBACK IMAGE UPLOAD */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Gagal Membuka Kamera?
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Gunakan galeri atau aplikasi kamera bawaan HP Anda dengan memilih gambar QR Code.
            </p>
            <div className="relative inline-block w-full mt-2">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    let instance = scannerInstance;
                    if (!instance) {
                      instance = new Html5Qrcode(qrId);
                      setScannerInstance(instance);
                    }
                    const decodedText = await instance.scanFile(file, true);
                    if (decodedText) {
                      handleScannedCode(decodedText, instance);
                    }
                  } catch (err) {
                    alert("Gagal membaca QR Code dari gambar yang dipilih. Pastikan gambar jelas.");
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                <Camera className="w-4 h-4" /> Buka Kamera HP / Galeri
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
