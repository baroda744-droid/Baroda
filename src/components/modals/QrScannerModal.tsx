import React, { useState } from 'react';
import { X, QrCode, Flashlight, Image, CheckCircle2, ArrowRight } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (merchant: string, amount: number) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  if (!isOpen) return null;

  const sampleMerchants = [
    { name: 'Starbucks Coffee', upi: 'starbucks@axisbank', amount: 380 },
    { name: 'Reliance Smart Supermarket', upi: 'reliancesmart@hdfc', amount: 1250 },
    { name: 'Indian Oil Fuel Station', upi: 'ioclsales@sbi', amount: 1500 },
    { name: 'Sharma General Kirana', upi: 'sharmakirana@paytm', amount: 140 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="font-bold text-sm">Scan any UPI QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-56 h-56 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Viewfinder corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#FF6B00]" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#FF6B00]" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#FF6B00]" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#FF6B00]" />

            {/* Scanning line animation */}
            <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#FF6B00] to-transparent animate-pulse shadow-md shadow-orange-500" />

            <div className="text-center p-4">
              <QrCode className="w-20 h-20 text-slate-700 mx-auto opacity-50" />
              <p className="text-[11px] text-slate-400 mt-2">
                Align QR Code within the frame
              </p>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`p-3 rounded-full transition-colors ${
                torchOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Flashlight className="w-5 h-5" />
            </button>
            <button
              onClick={() => alert('Photo gallery selector opened')}
              className="p-3 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset test QRs for instant interactive demonstration */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Simulate Scanning a Merchant QR:
          </p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {sampleMerchants.map((m, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onScanSuccess(m.name, m.amount);
                  onClose();
                }}
                className="w-full p-2 rounded-xl bg-slate-900 hover:bg-[#FF6B00]/20 border border-slate-800 hover:border-[#FF6B00] text-left flex items-center justify-between text-xs transition-colors group"
              >
                <div>
                  <p className="font-semibold text-slate-200 group-hover:text-white">
                    {m.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{m.upi}</p>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#FF6B00]">
                  <span>₹{m.amount}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
