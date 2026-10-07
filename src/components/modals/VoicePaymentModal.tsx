import React, { useState } from 'react';
import { X, Mic, Volume2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface VoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string) => void;
}

export const VoicePaymentModal: React.FC<VoicePaymentModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  if (!isOpen) return null;

  const sampleCommands = [
    'Pay ₹500 to Rahul Sharma',
    'What is my savings account balance?',
    'Open a 2-year Fixed Deposit of ₹50,000',
    'Pay Adani Electricity bill',
  ];

  const handleSimulateVoice = (cmd: string) => {
    setListening(true);
    setTranscript('Listening...');

    setTimeout(() => {
      setTranscript(`"${cmd}"`);
    }, 700);

    setTimeout(() => {
      setListening(false);
      onExecuteCommand(cmd);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-[#FF6B00] to-[#FF4D00] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h3 className="font-extrabold text-sm text-white">
              AI Voice Payments
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Visualizer */}
        <div className="p-6">
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            {/* Animated Waves */}
            <div
              className={`absolute inset-0 rounded-full bg-orange-400/20 ${
                listening ? 'animate-ping' : ''
              }`}
            />
            <div
              className={`absolute inset-2 rounded-full bg-orange-500/30 ${
                listening ? 'animate-pulse' : ''
              }`}
            />
            <button
              onClick={() => handleSimulateVoice('Pay ₹500 to Rahul Sharma')}
              className="relative w-16 h-16 rounded-full bg-linear-to-tr from-[#FF6B00] to-[#FF4D00] text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition-transform"
            >
              <Mic className="w-8 h-8" />
            </button>
          </div>

          <h4 className="text-base font-extrabold text-[#0A2E65]">
            {listening ? 'Listening to your voice...' : 'Speak or Tap a Command'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 min-h-[1.5rem]">
            {transcript || 'Supports English, Hindi, Gujarati, Marathi'}
          </p>

          {/* Quick Voice Suggestions */}
          <div className="mt-5 space-y-2 text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Try saying:
            </p>
            {sampleCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => handleSimulateVoice(cmd)}
                className="w-full p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs text-slate-700 font-medium transition-colors flex items-center justify-between group"
              >
                <span>"{cmd}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
