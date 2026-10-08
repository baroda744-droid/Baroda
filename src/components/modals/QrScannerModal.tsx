import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Flashlight,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Camera,
  Sparkles,
  Lock,
  Delete,
  ShieldAlert,
} from 'lucide-react';
import jsQR from 'jsqr';
import { TransactionFailedModal } from './TransactionFailedModal';
import { db, auth, recordFailedTransaction } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (merchant: string, amount: number) => void;
}

interface ScannedPayee {
  merchant: string;
  upiId: string;
  amount: number;
  rawText: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  // Video & Stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Camera state
  const [cameraState, setCameraState] = useState<'requesting' | 'active' | 'denied' | 'error' | 'unsupported'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);

  // Scanned QR result
  const [scannedPayee, setScannedPayee] = useState<ScannedPayee | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [payStep, setPayStep] = useState<'scan' | 'pin' | 'processing' | 'failed'>('scan');
  const [qrPin, setQrPin] = useState<string>('');
  const [qrPinError, setQrPinError] = useState<string | null>(null);

  // Play audio beep sound effect via Web Audio API
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz (A5 high clean chime)

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // AudioContext policy blocked or unsupported
    }
  };

  // Vibrate phone
  const triggerVibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([120, 40, 120]);
      } catch (e) {
        // ignore
      }
    }
  };

  // Parse UPI string (e.g. upi://pay?pa=starbucks@axisbank&pn=Starbucks%20Coffee&am=380)
  const parseUpiQr = (qrData: string): ScannedPayee => {
    try {
      if (qrData.startsWith('upi://') || qrData.includes('pa=')) {
        const urlParams = new URLSearchParams(qrData.split('?')[1] || qrData);
        const pa = urlParams.get('pa') || 'merchant@upi';
        const pn = urlParams.get('pn') ? decodeURIComponent(urlParams.get('pn')!) : pa.split('@')[0];
        const amStr = urlParams.get('am');
        const parsedAmount = amStr ? parseFloat(amStr) : 250;

        return {
          merchant: pn.replace(/\+/g, ' '),
          upiId: pa,
          amount: isNaN(parsedAmount) || parsedAmount <= 0 ? 250 : parsedAmount,
          rawText: qrData,
        };
      }
    } catch (e) {
      // fallback
    }

    // Generic fallback for plain text or merchant URL
    const clean = qrData.trim();
    let merchantName = clean;
    if (clean.includes('/')) {
      const parts = clean.split('/').filter(Boolean);
      merchantName = parts[parts.length - 1] || 'Verified Merchant';
    }
    if (merchantName.length > 28) {
      merchantName = merchantName.substring(0, 25) + '...';
    }

    return {
      merchant: merchantName || 'Verified Merchant',
      upiId: 'merchant.pay@bobworld',
      amount: 350,
      rawText: qrData,
    };
  };

  // Triggered when a QR code is detected
  const handleQrDetected = (qrData: string) => {
    if (scannedPayee) return; // already detected

    playBeepSound();
    triggerVibrate();

    const parsed = parseUpiQr(qrData);
    setScannedPayee(parsed);
    setCustomAmount(parsed.amount.toString());

    // Stop camera frames
    stopScanning();
  };

  // Stop scanning loop
  const stopScanning = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  // Stop camera stream tracks
  const stopCamera = () => {
    stopScanning();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start scanning frames on canvas with jsQR
  const startScanningLoop = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const scanFrame = () => {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data && code.data.trim()) {
            handleQrDetected(code.data);
            return;
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Open Real Camera using getUserMedia
  const startCamera = async () => {
    setCameraState('requesting');
    setErrorMessage('');
    setScannedPayee(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Camera access is not supported in this browser.');
      return;
    }

    try {
      // 1. Try back camera (facingMode: environment)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err) {
        // Fallback for laptops / desktop webcams without environment facingMode
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Check if torch is supported on this track
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? videoTrack.getCapabilities() as any : null;
        if (capabilities?.torch) {
          setTorchSupported(true);
        }
      }

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // essential for iOS
        videoRef.current.muted = true;
        await videoRef.current.play();
        setCameraState('active');
        startScanningLoop();
      }
    } catch (err: any) {
      console.warn('Camera getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera permission needed - Please allow camera in settings');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to start camera. Please verify device camera.');
      }
    }
  };

  // Toggle torch / flashlight
  const handleToggleTorch = async () => {
    const stream = streamRef.current;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !torchOn;
      if (track.applyConstraints) {
        await track.applyConstraints({
          advanced: [{ torch: nextState } as any],
        });
      }
      setTorchOn(nextState);
    } catch (e) {
      // Flashlight hardware not available
      setTorchOn(!torchOn);
    }
  };

  // Handle image upload from Gallery
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleQrDetected(code.data);
          } else {
            alert('No valid QR code detected in this image. Please try another photo.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  // Sample merchants for rapid one-tap testing (GPay / PhonePe / BoB)
  const sampleQrs = [
    { name: 'Starbucks Coffee', upi: 'starbucks@axisbank', amount: 380 },
    { name: 'Reliance Supermarket', upi: 'reliancesmart@hdfc', amount: 1250 },
    { name: 'Indian Oil Petrol', upi: 'ioclsales@sbi', amount: 1500 },
  ];

  // Lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedPayee(null);
      setCameraState('requesting');
      setTorchOn(false);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Hidden File Input for Gallery QR scanning */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleGalleryUpload}
        className="hidden"
      />

      {/* Main Scanner Container: 100% Google Pay / PhonePe authentic styling */}
      <div className="w-full max-w-[430px] h-full sm:h-[92vh] sm:rounded-3xl bg-black text-white relative flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
        
        {/* REAL CAMERA LIVE VIDEO ELEMENT */}
        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              cameraState === 'active' ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Dark Overlay with Center Cutout Frame (Google Pay aesthetic) */}
          {cameraState === 'active' && !scannedPayee && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              {/* Top Dark Tint */}
              <div className="w-full flex-1 bg-black/60" />

              {/* Middle Row with Center Clear Viewfinder */}
              <div className="w-full flex items-center justify-center">
                {/* Left Tint */}
                <div className="flex-1 h-64 bg-black/60" />

                {/* Viewfinder Box (256x256) */}
                <div className="relative w-64 h-64 shrink-0">
                  {/* Four Crisp White Corner Borders (Google Pay / PhonePe style) */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-white rounded-tl-xl shadow-xs" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-white rounded-tr-xl shadow-xs" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-white rounded-bl-xl shadow-xs" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-white rounded-br-xl shadow-xs" />

                  {/* Scanning Laser Line Moving Up-Down Inside Box */}
                  <div className="absolute left-2 right-2 h-1 bg-linear-to-r from-transparent via-[#FF6B00] to-transparent shadow-[0_0_12px_#FF6B00] animate-scan-laser rounded-full" />
                </div>

                {/* Right Tint */}
                <div className="flex-1 h-64 bg-black/60" />
              </div>

              {/* Bottom Dark Tint */}
              <div className="w-full flex-1 bg-black/60" />
            </div>
          )}
        </div>

        {/* TOP BAR: "Scan QR Code" title with close X button */}
        <div className="relative z-30 pt-4 pb-3 px-4 flex items-center justify-between bg-linear-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FF6B00]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Scan QR Code
              </h2>
              <p className="text-[10px] text-slate-300">
                Google Pay • PhonePe • BHIM UPI
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close QR Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CENTER CONTENT: Camera Loading / Permission Denied / Viewfinder Subtitle */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pointer-events-none">
          {/* 1. Requesting Permission State */}
          {cameraState === 'requesting' && (
            <div className="text-center p-6 bg-slate-900/90 rounded-3xl border border-slate-700/80 backdrop-blur-md shadow-2xl pointer-events-auto max-w-xs animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="font-extrabold text-sm text-white">
                Starting Camera...
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Requesting camera permission to scan UPI QR codes.
              </p>
            </div>
          )}

          {/* 2. Permission Denied State (Exact prompt requirement 7) */}
          {(cameraState === 'denied' || cameraState === 'error' || cameraState === 'unsupported') && (
            <div className="text-center p-6 bg-slate-900/95 rounded-3xl border border-red-500/30 backdrop-blur-md shadow-2xl pointer-events-auto max-w-xs animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-white">
                Camera Permission Needed
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {errorMessage || 'Please allow camera in settings to scan QR codes.'}
              </p>

              <div className="space-y-2 mt-4">
                <button
                  onClick={startCamera}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#e65c00] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Camera Again</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload QR from Gallery</span>
                </button>
              </div>
            </div>
          )}

          {/* Subtitle below Viewfinder when active */}
          {cameraState === 'active' && !scannedPayee && (
            <div className="mt-72 text-center pointer-events-none">
              <p className="text-xs font-semibold text-white/90 drop-shadow-md">
                Align any QR Code inside the frame
              </p>
              <p className="text-[10px] text-white/60 drop-shadow-md mt-0.5">
                Scanning automatically in real time
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS: Flashlight toggle & Gallery button (Prompt requirement 4) */}
        {!scannedPayee && (
          <div className="relative z-30 pb-6 pt-3 px-4 bg-linear-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center gap-4">
            {/* Flashlight & Gallery Buttons */}
            <div className="flex items-center gap-6">
              {/* Flashlight button */}
              <button
                onClick={handleToggleTorch}
                className={`p-3.5 rounded-full transition-all cursor-pointer flex flex-col items-center shadow-lg active:scale-95 ${
                  torchOn
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/40 ring-4 ring-amber-400/20'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-md'
                }`}
                title={torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
              >
                <Flashlight className="w-5 h-5" />
              </button>

              {/* Gallery button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Scan QR from Gallery Photo"
              >
                <ImageIcon className="w-5 h-5 text-orange-400" />
              </button>
            </div>

            {/* Quick Demo QR Test Chips */}
            <div className="w-full pt-2 border-t border-white/10">
              <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider mb-2">
                Or Tap to Test Verified Merchant QR:
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {sampleQrs.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleQrDetected(`upi://pay?pa=${item.upi}&pn=${encodeURIComponent(item.name)}&am=${item.amount}`);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-[#FF6B00]/25 border border-white/10 hover:border-[#FF6B00] text-center transition-all cursor-pointer group active:scale-95"
                  >
                    <p className="font-bold text-[11px] text-white truncate">
                      {item.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] font-mono text-[#FF6B00] font-bold">
                      ₹{item.amount}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULT CONFIRMATION CARD (When QR Detected) */}
        {scannedPayee && (
          <div className="absolute inset-x-0 bottom-0 z-40 bg-slate-900 border-t border-slate-700/80 rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header: Verified UPI Payee */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">QR Code Verified</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                      UPI
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">NPCI / Bharat QR Network</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setScannedPayee(null);
                  startCamera();
                }}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
              >
                Scan Again
              </button>
            </div>

            {/* Merchant Details */}
            <div className="py-3">
              <h3 className="text-lg font-black text-white tracking-tight">
                {scannedPayee.merchant}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {scannedPayee.upiId}
              </p>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Payment Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-lg font-bold text-slate-400 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                />
              </div>
            </div>

            {/* Primary Account Info */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span>Paying from: Aarya Bank - 1234</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">Active</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={() => {
                const amt = parseFloat(customAmount);
                if (isNaN(amt) || amt <= 0) {
                  alert('Please enter a valid payment amount.');
                  return;
                }
                setQrPin('');
                setPayStep('pin');
              }}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-[#FF6B00] to-[#E65800] hover:from-[#ff791a] hover:to-[#ff5000] text-white font-extrabold text-sm shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>Proceed to Pay ₹{parseFloat(customAmount || '0').toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* QR UPI PIN OVERLAY */}
        {payStep === 'pin' && scannedPayee && (
          <div className="absolute inset-0 z-50 bg-white text-slate-900 flex flex-col items-center justify-center p-5 text-center animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF6B00] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-black text-base text-[#0A2E65]">
              Enter 4-Digit UPI PIN / Transaction Password
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Authorizing transfer of <span className="font-bold text-slate-900 font-mono">₹{parseFloat(customAmount || '0').toLocaleString('en-IN')}</span> to <span className="font-bold text-slate-900">{scannedPayee.merchant}</span>
            </p>

            {/* 4 dots */}
            <div className="flex items-center justify-center gap-4 my-6">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = qrPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-150 ${
                      isFilled
                        ? 'bg-[#FF6B00] scale-125 shadow-md shadow-orange-500/40 ring-4 ring-orange-100'
                        : 'border-2 border-slate-300 bg-slate-100'
                    }`}
                  />
                );
              })}
            </div>

            {qrPinError && (
              <p className="text-xs text-red-500 font-bold mb-3 animate-in fade-in duration-150">
                {qrPinError}
              </p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => {
                    if (qrPin.length < 4) {
                      const next = qrPin + digit;
                      setQrPin(next);
                      setQrPinError(null);
                      if (next.length === 4) {
                        if (next !== '1999') {
                          setQrPinError('Incorrect UPI PIN / Transaction Password. Please enter 1999.');
                          setTimeout(() => {
                            setQrPin('');
                          }, 600);
                          return;
                        }
                        setPayStep('processing');
                        const amt = parseFloat(customAmount || '0');
                        setTimeout(async () => {
                          try {
                            const currentUserId = auth.currentUser?.uid || localStorage.getItem('bob_user_uid') || 'user_bob_1234';
                            await addDoc(collection(db, 'transactions'), {
                              userId: currentUserId,
                              type: 'qr_pay',
                              amount: amt,
                              toAccount: scannedPayee?.upiId || scannedPayee?.merchant || 'Merchant QR',
                              status: 'failed',
                              reason: 'Account Freezed - Suspicious Activity',
                              date: new Date(),
                              timestamp: serverTimestamp(),
                              narration: `UPI/DR/QR to ${scannedPayee?.merchant || 'Merchant'}/FAILED-FRZ`,
                              mode: 'UPI',
                            });
                          } catch (e) {
                            await recordFailedTransaction({
                              amount: amt,
                              toAccount: scannedPayee?.upiId || scannedPayee?.merchant || 'Merchant QR',
                              reason: 'Account Freezed - Suspicious Activity',
                              type: 'qr_pay',
                              mode: 'UPI',
                              narration: `UPI/DR/QR to ${scannedPayee?.merchant || 'Merchant'}/FAILED-FRZ`,
                            });
                          }
                          setPayStep('failed');
                        }, 2000);
                      }
                    }
                  }}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 font-bold text-lg border border-slate-200/80 transition-colors cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPayStep('scan');
                  setQrPin('');
                  setQrPinError(null);
                }}
                className="h-12 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (qrPin.length < 4) {
                    const next = qrPin + '0';
                    setQrPin(next);
                    setQrPinError(null);
                    if (next.length === 4) {
                      if (next !== '1999') {
                        setQrPinError('Incorrect UPI PIN / Transaction Password. Please enter 1999.');
                        setTimeout(() => {
                          setQrPin('');
                        }, 600);
                        return;
                      }
                      setPayStep('processing');
                      const amt = parseFloat(customAmount || '0');
                      setTimeout(async () => {
                        try {
                          const currentUserId = auth.currentUser?.uid || localStorage.getItem('bob_user_uid') || 'user_bob_1234';
                          await addDoc(collection(db, 'transactions'), {
                            userId: currentUserId,
                            type: 'qr_pay',
                            amount: amt,
                            toAccount: scannedPayee?.upiId || scannedPayee?.merchant || 'Merchant QR',
                            status: 'failed',
                            reason: 'Account Freezed - Suspicious Activity',
                            date: new Date(),
                            timestamp: serverTimestamp(),
                            narration: `UPI/DR/QR to ${scannedPayee?.merchant || 'Merchant'}/FAILED-FRZ`,
                            mode: 'UPI',
                          });
                        } catch (e) {
                          await recordFailedTransaction({
                            amount: amt,
                            toAccount: scannedPayee?.upiId || scannedPayee?.merchant || 'Merchant QR',
                            reason: 'Account Freezed - Suspicious Activity',
                            type: 'qr_pay',
                            mode: 'UPI',
                            narration: `UPI/DR/QR to ${scannedPayee?.merchant || 'Merchant'}/FAILED-FRZ`,
                          });
                        }
                        setPayStep('failed');
                      }, 2000);
                    }
                  }
                }}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-orange-50 active:bg-orange-100 text-slate-800 font-bold text-lg border border-slate-200/80 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => {
                  setQrPin((p) => p.slice(0, -1));
                  setQrPinError(null);
                }}
                className="h-12 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                title="Delete"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 2-SECOND PROCESSING OVERLAY */}
        {payStep === 'processing' && (
          <div className="absolute inset-0 z-50 bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative">
              <span className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin absolute" />
              <ShieldAlert className="w-8 h-8 text-[#FF6B00]" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#0A2E65] mb-1">
              Processing your transaction... Please wait
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs">
              Communicating with UPI Bharat QR Gateway & Core Banking Server...
            </p>
          </div>
        )}

        {/* FAILED MODAL */}
        <TransactionFailedModal
          isOpen={payStep === 'failed'}
          onClose={() => {
            setPayStep('scan');
            setScannedPayee(null);
            stopCamera();
            onClose();
          }}
          onGoHome={() => {
            setPayStep('scan');
            setScannedPayee(null);
            stopCamera();
            onClose();
          }}
          amount={parseFloat(customAmount || '0')}
          recipient={scannedPayee?.merchant || 'Merchant'}
          mode="Bharat QR / UPI Payment"
        />
      </div>
    </div>
  );
};
