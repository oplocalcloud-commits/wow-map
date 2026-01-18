
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sword, Activity, Zap, Target, Ghost, Crown } from 'lucide-react';
import { Category } from '../types';

interface HomeProps {
  categories: Category[];
  onSelectCategory: (id: string) => void;
  onAdminAccess: () => void;
}

const ICONS: Record<string, any> = {
  Sword, Activity, Zap, Target, Ghost
};

const Home: React.FC<HomeProps> = ({ categories, onSelectCategory, onAdminAccess }) => {
  const [adminClicks, setAdminClicks] = useState(0);
  const clickTimerRef = useRef<any>(null);

  const handleAdminClick = (e: React.MouseEvent | React.TouchEvent) => {
    const newCount = adminClicks + 1;
    setAdminClicks(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    clickTimerRef.current = setTimeout(() => {
      setAdminClicks(0);
    }, 2000);

    if (newCount >= 5) {
      setAdminClicks(0);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      onAdminAccess();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full p-6 md:p-12 pb-40"
    >
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gaming-font text-[#1E3A8A] tracking-tight">
            WOW <span className="text-[#60A5FA]">MAPS</span>
          </h1>
          <p className="text-[10px] md:text-xs font-black text-[#60A5FA] tracking-[0.4em] uppercase">Tactical Global Network</p>
        </div>
        
        <div className="relative">
          <motion.button 
            onClick={handleAdminClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 md:w-16 md:h-16 soft-button rounded-2xl flex flex-col items-center justify-center text-[#60A5FA]"
            aria-label="Admin Access"
          >
            <Crown 
              size={28} 
              fill="currentColor" 
              fillOpacity={adminClicks > 0 ? 0.7 : 0.2} 
              className={adminClicks > 0 ? "animate-pulse" : ""}
            />
          </motion.button>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-[11px] md:text-sm font-black text-[#60A5FA] tracking-[0.3em] uppercase flex items-center gap-3">
          <Target size={16} /> Data Categories
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
        {categories && categories.length > 0 ? categories.map((cat, idx) => {
          const IconComp = ICONS[cat.icon] || Sword;
          return (
            <motion.button
              key={cat.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectCategory(cat.id)}
              className="soft-button rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center gap-4 text-center aspect-square"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 soft-in rounded-[1.5rem] flex items-center justify-center text-[#60A5FA]">
                <IconComp size={32} />
              </div>
              <div>
                <span className="block text-sm md:text-base font-bold text-[#1E3A8A] gaming-font uppercase tracking-wider">
                  {cat.title}
                </span>
                <span className="text-[8px] font-black text-[#60A5FA] uppercase tracking-widest mt-1 block">Initialize</span>
              </div>
            </motion.button>
          );
        }) : (
          <div className="col-span-full py-20 text-center opacity-40 italic text-[#60A5FA]">
            Syncing database...
          </div>
        )}
      </div>

      <div className="soft-out rounded-[3rem] p-10 flex flex-col items-center gap-6 text-center border-t-2 border-white/20">
        <h3 className="text-xl font-bold text-[#1E3A8A] gaming-font uppercase">Expand the Network</h3>
        <p className="text-xs md:text-sm text-[#60A5FA] font-medium max-w-md uppercase tracking-wide">
          Help the community grow by sharing this tactical coordinate database.
        </p>
        <button className="w-full max-w-xs py-5 soft-button rounded-2xl flex items-center justify-center gap-3 text-[#1E3A8A] font-black text-xs uppercase tracking-widest">
          <MessageCircle size={20} className="text-[#25D366]" />
          Share via WhatsApp
        </button>
      </div>
    </motion.div>
  );
};

export default Home;
