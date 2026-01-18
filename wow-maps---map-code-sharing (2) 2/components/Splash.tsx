
import React from 'react';
import { motion } from 'framer-motion';
import { Map, ShieldCheck, Zap } from 'lucide-react';

const Splash: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#E6F0FF] overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-[100px] opacity-50" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative flex flex-col items-center z-10"
      >
        {/* Logo Container */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-40 h-40 soft-out rounded-[3rem] flex items-center justify-center mb-12 relative"
        >
          <Map size={64} className="text-[#60A5FA]" />
          
          {/* Subtle glow effect around the logo */}
          <div className="absolute inset-0 rounded-[3rem] shadow-[0_0_30px_rgba(96,165,250,0.3)] animate-pulse" />
        </motion.div>

        {/* Title Section */}
        <div className="text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-bold tracking-[0.25em] gaming-font text-[#1E3A8A] uppercase"
          >
            WOW <span className="text-[#60A5FA]">MAPS</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex items-center justify-center gap-3 mt-4"
          >
            <Zap size={14} className="text-[#60A5FA]" />
            <p className="text-[#60A5FA] tracking-[0.6em] text-[10px] uppercase font-black">
              SECURE UPLINK
            </p>
            <Zap size={14} className="text-[#60A5FA]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Bar Section */}
      <div className="absolute bottom-32 flex flex-col items-center gap-6 w-full px-12">
        <div className="w-full max-w-[240px]">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[9px] font-black text-[#60A5FA] uppercase tracking-widest animate-pulse">Syncing...</span>
            <span className="text-[9px] font-black text-[#1E3A8A] uppercase tracking-widest">v1.0.4</span>
          </div>
          <div className="w-full h-3 soft-in rounded-full overflow-hidden p-0.5 border border-white/40">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="h-full bg-[#60A5FA] rounded-full shadow-[0_0_15px_rgba(96,165,250,0.6)]"
            />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2 text-[#60A5FA]"
        >
          <ShieldCheck size={14} />
          <p className="text-[8px] font-black uppercase tracking-[0.2em]">Authorized Access Protocol</p>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-10">
        <p className="text-[#60A5FA]/40 text-[7px] font-black uppercase tracking-[0.8em]">
          POWERED BY FIREBASE NEURAL NETWORK
        </p>
      </div>
    </motion.div>
  );
};

export default Splash;
