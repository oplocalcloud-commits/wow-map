
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Lock, Copy, Check, Share2, Info, ShieldCheck, Heart, FileText } from 'lucide-react';
import { MapEntry } from '../types';
import AdPlayer from './AdPlayer';

interface MapDetailProps {
  mapData: MapEntry | undefined;
  isUnlocked: boolean;
  isFavorited: boolean;
  onBack: () => void;
  onUnlock: () => void;
  onToggleFavorite: () => void;
}

const MapDetail: React.FC<MapDetailProps> = ({ mapData: map, isUnlocked, isFavorited, onBack, onUnlock, onToggleFavorite }) => {
  const [showAd, setShowAd] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!map) return (
    <div className="h-full w-full flex items-center justify-center bg-[#E6F0FF]">
      <p className="text-[#60A5FA] uppercase tracking-[0.3em] font-black animate-pulse text-[10px]">Coordinate Retrieval Failed</p>
    </div>
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(map.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full overflow-y-scroll no-scrollbar bg-[#E6F0FF] flex flex-col"
    >
      <div className="relative h-80 w-full overflow-hidden shrink-0">
        <img 
          src={map.thumbnail} 
          alt={map.title} 
          className="w-full h-full object-cover scale-105 grayscale-[0.3] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#E6F0FF] via-[#E6F0FF]/20 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 w-12 h-12 soft-button rounded-2xl flex items-center justify-center text-[#1E3A8A] z-10"
        >
          <ChevronLeft size={22} />
        </button>

        <button 
          onClick={onToggleFavorite}
          className="absolute top-8 right-8 w-12 h-12 soft-button rounded-2xl z-10 flex items-center justify-center"
        >
          <Heart size={22} fill={isFavorited ? "#60A5FA" : "transparent"} className={isFavorited ? "text-[#60A5FA]" : "text-[#1E3A8A]"} />
        </button>
        
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex gap-2 mb-3">
            <span className="text-[8px] soft-out px-3 py-1 rounded-full text-[#60A5FA] font-black tracking-widest uppercase">TACTICAL DATA</span>
          </div>
          <h1 className="text-3xl font-bold gaming-font text-[#1E3A8A] leading-tight uppercase tracking-tight">{map.title}</h1>
        </div>
      </div>

      <div className="p-8 space-y-10 flex-1 pb-32">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black text-[#60A5FA] uppercase tracking-[0.4em] flex items-center gap-2">
              <FileText size={14} /> Description
            </h2>
          </div>
          <div className="soft-in p-8 rounded-[2.5rem]">
            <p className="text-[#1E3A8A] text-sm leading-relaxed font-medium">
              {map.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-[#60A5FA] uppercase tracking-[0.4em]">
              Access Matrix
            </h2>
            {isUnlocked && <ShieldCheck size={18} className="text-[#60A5FA] animate-pulse" />}
          </div>
          
          <div className={`soft-out rounded-[3rem] p-4 transition-all duration-700`}>
            {!isUnlocked ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-8">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 soft-in rounded-[2rem] flex items-center justify-center text-[#60A5FA]"
                >
                  <Lock size={32} />
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-[#1E3A8A] font-black gaming-font text-lg tracking-widest mb-2 uppercase">HERE IS CODE</h3>
                  <p className="text-[#60A5FA] text-[10px] uppercase font-black tracking-widest max-w-[200px] leading-relaxed mx-auto">CLICK HERE TO WATCH CODE</p>
                </div>
                
                <button 
                  onClick={() => setShowAd(true)}
                  className="soft-button w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-4 text-[#1E3A8A] font-black text-xs tracking-widest uppercase transition-all"
                >
                   <Play size={18} fill="#1E3A8A" />
                   WATCH CODE
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 p-4"
              >
                <div className="soft-in p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <p className="text-[8px] text-[#60A5FA] font-black tracking-[0.5em] mb-4 uppercase">Downlink Secured</p>
                  <p className="text-3xl font-mono tracking-[0.2em] text-[#1E3A8A] font-black select-all">
                    {map.code}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={handleCopy}
                    className="flex-[3] flex items-center justify-center gap-4 py-5 soft-button rounded-2xl text-[#1E3A8A] font-black text-[10px] tracking-[0.2em] uppercase"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'TRANSFERRED' : 'COPY CODE'}
                  </button>
                  <button className="flex-1 flex items-center justify-center soft-button rounded-2xl text-[#60A5FA]">
                    <Share2 size={22} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['Battle Royale', 'Practice', 'Competitive', 'Creative'].map(tag => (
            <div key={tag} className="soft-in p-5 rounded-[1.5rem] flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shadow-lg"></div>
              <span className="text-[9px] text-[#60A5FA] font-black uppercase tracking-widest">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAd && (
          <AdPlayer 
            onComplete={() => { setShowAd(false); onUnlock(); }} 
            onClose={() => setShowAd(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MapDetail;
