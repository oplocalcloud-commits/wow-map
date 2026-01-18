
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { MapEntry } from '../types';
import { fetchAllMaps } from '../services/firebaseService';

interface FavoriteProps {
  favoriteIds: Set<string>;
  onSelectMap: (id: string, map: MapEntry) => void;
}

const Favorite: React.FC<FavoriteProps> = ({ favoriteIds, onSelectMap }) => {
  const [favoriteMaps, setFavoriteMaps] = useState<MapEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      const allMaps = await fetchAllMaps();
      const filtered = allMaps.filter(map => favoriteIds.has(map.id));
      setFavoriteMaps(filtered);
      setIsLoading(false);
    };
    loadFavorites();
  }, [favoriteIds]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full overflow-y-auto no-scrollbar p-8 bg-[#E6F0FF] flex flex-col pb-32"
    >
      <div className="mb-10 mt-4 text-center shrink-0">
        <h1 className="text-3xl font-bold gaming-font text-[#1E3A8A] tracking-tight uppercase">
          SECURE <span className="text-[#60A5FA]">FAVORITES</span>
        </h1>
        <p className="text-[#60A5FA] text-[10px] uppercase font-black tracking-[0.3em] mt-2">
          Restricted access coordinates
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <Loader2 className="animate-spin text-[#60A5FA]" size={40} />
            <p className="text-[10px] text-[#60A5FA] font-black uppercase tracking-[0.4em]">Decrypting Data...</p>
          </div>
        ) : favoriteMaps.length > 0 ? (
          favoriteMaps.map((map, index) => (
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
                <div className="flex items-center gap-2 mt-0.5">
                  <ShieldCheck size={10} className="text-[#60A5FA]" />
                  <p className="text-[9px] text-[#60A5FA] font-black uppercase tracking-widest truncate">Authorized</p>
                </div>
              </div>
              <ChevronRight className="text-[#60A5FA] mr-2" size={20} />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-40">
            <div className="w-20 h-20 soft-in rounded-[2rem] flex items-center justify-center text-[#60A5FA]">
              <Heart size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-[#1E3A8A] font-bold uppercase tracking-[0.2em] text-xs">Favorites Isolated</p>
              <p className="text-[9px] text-[#60A5FA] uppercase font-black tracking-widest leading-relaxed">No tactical data stored in memory</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorite;
