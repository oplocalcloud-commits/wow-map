
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, ChevronRight, Globe } from 'lucide-react';
import { MapEntry } from '../types';
import { fetchAllMaps } from '../services/firebaseService';

interface ExploreProps {
  onSelectMap: (id: string, map: MapEntry) => void;
}

const Explore: React.FC<ExploreProps> = ({ onSelectMap }) => {
  const [allMaps, setAllMaps] = useState<MapEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const maps = await fetchAllMaps();
      setAllMaps(maps);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredMaps = allMaps.filter(map => 
    map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full overflow-y-auto no-scrollbar p-8 bg-[#E6F0FF] flex flex-col pb-32"
    >
      <div className="mb-10 mt-4 text-center shrink-0">
        <h1 className="text-3xl font-bold gaming-font text-[#1E3A8A] tracking-tight uppercase">
          GLOBAL <span className="text-[#60A5FA]">FEED</span>
        </h1>
        <p className="text-[#60A5FA] text-[10px] uppercase font-black tracking-[0.3em] mt-2">
          Syncing all known coordinates
        </p>
      </div>

      <div className="relative mb-10 shrink-0">
        <div className="soft-in rounded-[1.8rem] flex items-center px-6">
          <Search className="text-[#60A5FA]" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Global Database..." 
            className="w-full bg-transparent py-5 px-4 text-sm focus:outline-none text-[#1E3A8A] placeholder:text-[#60A5FA] font-medium"
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <Loader2 className="animate-spin text-[#60A5FA]" size={40} />
            <p className="text-[10px] text-[#60A5FA] font-black uppercase tracking-[0.4em]">Establishing Uplink...</p>
          </div>
        ) : filteredMaps.length > 0 ? (
          filteredMaps.map((map, index) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelectMap(map.id, map)}
              className="soft-button rounded-[2.5rem] p-4 flex items-center gap-5 cursor-pointer"
            >
              <div className="w-16 h-16 soft-in rounded-3xl overflow-hidden shrink-0 border-4 border-[#E6F0FF]">
                <img src={map.thumbnail} className="w-full h-full object-cover grayscale-[0.2] opacity-80" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1E3A8A] gaming-font uppercase tracking-wider truncate">{map.title}</h3>
                <p className="text-[10px] text-[#60A5FA] font-medium truncate mt-0.5">{map.description}</p>
              </div>
              <ChevronRight className="text-[#60A5FA] mr-2" size={20} />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-40">
            <Globe size={64} className="text-[#60A5FA]" />
            <div className="space-y-2">
              <p className="text-[#1E3A8A] font-bold uppercase tracking-[0.2em] text-xs">No Signal Found</p>
              <p className="text-[9px] text-[#60A5FA] uppercase font-black tracking-widest">Database entry not identified</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Explore;
