import React from 'react';
import { X, Bell, BellOff, ShieldCheck } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1c4786] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Notifications & Alerts</h3>
              <p className="text-[10px] text-slate-300">0 New Messages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty Notifications Screen */}
        <div className="p-8 flex flex-col items-center justify-center text-center flex-1 my-6 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <BellOff className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No new notifications</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              You're all caught up! Account updates and transaction alerts will appear here.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account Security: Protected</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#0A2E65] hover:text-[#FF6B00] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
