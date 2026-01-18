
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Heart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Explore' },
    { id: 'favorite', icon: Heart, label: 'Favorites' },
  ];

  return (
    <div className="soft-out rounded-[2.5rem] p-2 flex items-center justify-between">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative overflow-hidden"
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-1.5 soft-in rounded-2xl z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[#1E3A8A]' : 'text-[#60A5FA]'}`}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span className={`text-[8px] font-black uppercase tracking-[0.1em] relative z-10 ${isActive ? 'text-[#1E3A8A]' : 'text-[#60A5FA]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
