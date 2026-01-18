
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Filter, Search, Sword, Loader2 } from 'lucide-react';
import { Category, MapEntry } from '../types';
import { fetchMapsByCategory } from '../services/firebaseService';
import { PRACTICE_MAPS } from '../constants';

interface MapListProps {
  categoryId: string;
  categories: Category[];
  onBack: () => void;
  onSelectMap: (id: string, map: MapEntry) => void;
}

const MapList: React.FC<MapListProps> = ({ categoryId, categories, onBack, onSelectMap }) => {
  const [maps, setMaps] = useState<MapEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    const loadMaps = async () => {
      setIsLoading(true);
      if (categoryId === 'practice_cat') {
        setMaps(PRACTICE_MAPS);
      } else {
        const fetchedMaps = await fetchMapsByCategory(categoryId);
        setMaps(fetchedMaps);
      }
      setIsLoading(false);
    };
    loadMaps();
  }, [categoryId]);

  const filteredMaps = maps.filter(map => 
    map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    map.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full p-6 md:p-12"
    >
      <div className="flex flex-col pb-32 max-w-6xl mx-auto">
        <header className="flex items-center gap-6 mb-12">
          <button onClick={onBack} className="w-14 h-14 soft-button rounded-2xl flex items-center justify-center text-[#60A5FA]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gaming-font text-[#1E3A8A] uppercase tracking-tight">
              {category?.title || 'Data Sector'}
            </h1>
            <p className="text-[#60A5FA] text-[10px] md:text-xs uppercase font-black tracking-[0.3em] mt-1">
              {isLoading ? 'Scanning...' : `${filteredMaps.length} Units Identified`}
            </p>
          </div>
        </header>

        <div className="relative mb-12 max-w-md">
          <div className="absolute inset-0 soft-in rounded-2xl"></div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#60A5FA]" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search localized database..." 
            className="relative w-full bg-transparent rounded-2xl py-5 pl-14 pr-4 text-sm focus:outline-none text-[#1E3A8A] placeholder:text-[#60A5FA] font-medium"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#60A5FA]" size={40} />
            <p className="text-[10px] text-[#60A5FA] font-black uppercase tracking-widest">Establishing Uplink...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaps.length > 0 ? (
              filteredMaps.map((map, index) => (
                <motion.div
                  key={map.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectMap(map.id, map)}
                  className="soft-button rounded-[2.5rem] overflow-hidden p-6 cursor-pointer flex flex-col gap-5"
                >
                  <div className="w-full h-48 soft-in rounded-3xl overflow-hidden border-4 border-[#E6F0FF]">
                    <img src={map.thumbnail} alt={map.title} className="w-full h-full object-cover grayscale-[0.2]" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-[#1E3A8A] gaming-font uppercase tracking-wide truncate">
                      {map.title}
                    </h3>
                    <p className="text-xs text-[#60A5FA] line-clamp-2 mt-2 font-medium italic leading-relaxed">
                      {map.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[9px] soft-in px-4 py-1.5 rounded-full text-[#60A5FA] font-black tracking-widest uppercase">
                        Tactical
                      </span>
                      <div className="flex items-center gap-2 text-[#1E3A8A] text-[10px] font-black tracking-widest uppercase">
                        View Code
                        <ChevronLeft size={14} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 opacity-30">
                <Sword size={80} className="mx-auto mb-6 text-[#60A5FA]" />
                <p className="text-[#60A5FA] font-black uppercase tracking-[0.5em] text-sm">Signal Lost: No Data</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MapList;
