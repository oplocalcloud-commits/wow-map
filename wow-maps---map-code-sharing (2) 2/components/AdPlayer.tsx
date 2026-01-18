
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Gift, ShieldCheck, Loader2, Play, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AD_CONFIG } from '../constants';
import { showRewardedAd } from '../services/adService';

interface AdPlayerProps {
  onComplete: () => void;
  onClose: () => void;
}

const AdPlayer: React.FC<AdPlayerProps> = ({ onComplete, onClose }) => {
  const [mode, setMode] = useState<'loading' | 'active' | 'error' | 'finishing'>('loading');
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(AD_CONFIG.AD_REWARD_DURATION);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const handleAdFlow = async () => {
      // Small delay to feel like it's fetching from server
      await new Promise(r => setTimeout(r, 1500));
      
      const result = await showRewardedAd(
        () => { onComplete(); }, 
        () => { setMode('error'); }
      );

      if (result === 'simulation') {
        setMode('active');
        startTimer();
      } else if (result === 'success') {
        // Native ad handled it, it already called onComplete via callback
        onClose();
      } else {
        setMode('error');
      }
    };

    handleAdFlow();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    const interval = 100;
    const totalMs = AD_CONFIG.AD_REWARD_DURATION * 1000;
    const step = (interval / totalMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleAutoFinish();
          return 100;
        }
        return prev + step;
      });
      setSecondsLeft(prev => Math.max(0, prev - (interval / 1000)));
    }, interval);
  };

  const handleAutoFinish = async () => {
    setMode('finishing');
    // Give a brief moment for the user to see 100% and a success icon
    await new Promise(r => setTimeout(r, 800));
    onComplete(); // This triggers onUnlock and sets showAd to false in parent
  };

  if (mode === 'loading') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#E6F0FF] flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 soft-out rounded-[2.5rem] flex items-center justify-center text-[#60A5FA] mb-8"
        >
          <Loader2 size={40} />
        </motion.div>
        <h2 className="text-xl font-bold gaming-font text-[#1E3A8A] uppercase tracking-widest">Initialising Ad</h2>
        <p className="text-[#60A5FA] text-[9px] font-black uppercase tracking-[0.4em] mt-2">Connecting to Secure Stream...</p>
      </div>
    );
  }

  if (mode === 'error') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#E6F0FF] flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle size={48} className="text-rose-400 mb-6" />
        <h2 className="text-xl font-bold gaming-font text-[#1E3A8A] uppercase">Link Interrupted</h2>
        <button onClick={onClose} className="mt-8 px-10 py-4 soft-button rounded-2xl text-[#1E3A8A] font-black uppercase text-xs">Close Console</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-[#E6F0FF] flex flex-col"
    >
      <div className="p-8 flex justify-between items-center bg-[#E6F0FF]/80 backdrop-blur-xl border-b border-white/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 soft-in rounded-2xl flex items-center justify-center text-[#60A5FA]">
            {mode === 'finishing' ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Gift size={22} />}
          </div>
          <div>
            <span className="block text-[#1E3A8A] text-[10px] font-black uppercase tracking-wider">
              {mode === 'finishing' ? 'Reward Activated' : (secondsLeft > 0 ? `Reward in ${Math.ceil(secondsLeft)}s` : 'Processing...')}
            </span>
            <span className="text-[8px] text-[#60A5FA] font-bold uppercase tracking-[0.2em]">Data Transmission</span>
          </div>
        </div>
        {secondsLeft <= 0 && mode !== 'finishing' && (
          <button onClick={onClose} className="w-10 h-10 soft-button rounded-xl flex items-center justify-center text-[#60A5FA]">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="soft-out w-full max-w-sm rounded-[3rem] overflow-hidden border-4 border-white/50"
        >
          <div className="h-72 relative bg-[#D1E3F8]">
            <img 
              src={`https://picsum.photos/seed/ad-banner/800/600`} 
              className="w-full h-full object-cover" 
              alt="Ad Content" 
            />
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
               <div className="w-16 h-16 soft-button rounded-full flex items-center justify-center text-[#1E3A8A] shadow-xl">
                  <Play size={28} fill="currentColor" className="ml-1" />
               </div>
            </div>
          </div>
          <div className="p-8 text-center space-y-4">
            <h3 className="text-[#1E3A8A] font-bold text-lg gaming-font uppercase">Sponsor Transmission</h3>
            <p className="text-[10px] text-[#60A5FA] font-medium leading-relaxed px-4">
              Uplink in progress. Please maintain connection to receive tactical data coordinates.
            </p>
            <a 
              href={AD_CONFIG.WEB_SPONSOR_URL} 
              target="_blank" 
              className="w-full py-4 soft-button text-[#1E3A8A] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Learn More <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="p-10 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-[#60A5FA] uppercase tracking-widest">Uplink Status</span>
            <span className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-widest">{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-4 soft-in rounded-full p-1 overflow-hidden">
            <motion.div 
              className={`h-full rounded-full transition-colors duration-500 ${mode === 'finishing' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-[#60A5FA] shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center h-12">
          {mode === 'finishing' ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-500"
            >
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Coordinates Unlocked</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-[#60A5FA]">
              <ShieldCheck size={16} />
              <span className="text-[8px] font-black uppercase tracking-widest">Securing Tactical Protocol...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdPlayer;
