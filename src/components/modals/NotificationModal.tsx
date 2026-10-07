import React from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, Sparkles, CreditCard, ChevronRight } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      title: 'Salary Credited',
      desc: '₹95,000 credited to bob World Salary A/C •••• 2190 from TechCorp India Pvt Ltd.',
      time: 'Yesterday, 10:00 AM',
      unread: true,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      title: 'Special FD Rate Alert',
      desc: 'Lock in 7.85% p.a. on 2 to 3 years tenure. Valid till 31st October 2026.',
      time: '04 Oct, 03:20 PM',
      unread: true,
      icon: Sparkles,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      title: 'Monthly Statement Generated',
      desc: 'Your e-Statement for September 2026 is available for download.',
      time: '01 Oct, 08:30 AM',
      unread: false,
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Security Advisory',
      desc: 'Bank of Baroda (bob World) never asks for OTP or MPIN over call or SMS. Stay vigilant.',
      time: '28 Sep, 11:15 AM',
      unread: false,
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <div className="p-4 bg-linear-to-r from-[#0A2E65] to-[#1c4786] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Notifications & Alerts</h3>
              <p className="text-[10px] text-slate-300">2 New Messages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {notifications.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-colors flex items-start gap-3 ${
                  item.unread
                    ? 'bg-orange-50/50 border-orange-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800">{item.title}</h4>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#0A2E65] hover:text-[#FF6B00]"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};
