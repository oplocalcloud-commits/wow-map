
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppState, ViewType, Category, MapEntry } from './types';
import Splash from './components/Splash';
import Home from './components/Home';
import MapList from './components/MapList';
import MapDetail from './components/MapDetail';
import Explore from './components/Explore';
import Favorite from './components/Favorite';
import Admin from './components/Admin';
import BottomNav from './components/BottomNav';
import { fetchCategories, fetchAllMaps } from './services/firebaseService';
import { initAds } from './services/adService';
import { CATEGORIES as LOCAL_CATEGORIES, PRACTICE_MAPS } from './constants';

export default function App() {
  const [state, setState] = useState<AppState>({
    currentView: 'splash',
    selectedCategoryId: null,
    selectedMapId: null,
    unlockedCodes: new Set<string>(),
    favoriteMapIds: new Set<string>(),
  });

  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState<Category[]>(LOCAL_CATEGORIES);
  const [allMaps, setAllMaps] = useState<MapEntry[]>(PRACTICE_MAPS);

  useEffect(() => {
    const initApp = async () => {
      // Start AdMob and Data Sync simultaneously
      initAds();
      
      try {
        const [fetchedCats, fetchedMaps] = await Promise.all([
          fetchCategories(),
          fetchAllMaps()
        ]);
        
        setCategories([...LOCAL_CATEGORIES, ...fetchedCats]);
        setAllMaps([...PRACTICE_MAPS, ...fetchedMaps]);
        
      } catch (err) {
        console.warn("Using local cache due to connection:", err);
      }

      setTimeout(() => {
        setState(prev => ({ ...prev, currentView: 'home' }));
      }, 2500);
    };
    initApp();
  }, []);

  const navigateTo = (view: ViewType, categoryId: string | null = null, mapId: string | null = null) => {
    setState(prev => ({
      ...prev,
      currentView: view,
      selectedCategoryId: categoryId || prev.selectedCategoryId,
      selectedMapId: mapId || prev.selectedMapId
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (['home', 'search', 'favorite'].includes(view)) {
      setActiveTab(view);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setState(prev => {
      const newFavs = new Set(prev.favoriteMapIds);
      if (newFavs.has(id)) newFavs.delete(id);
      else newFavs.add(id);
      return { ...prev, favoriteMapIds: newFavs };
    });
  };

  const renderView = () => {
    switch (state.currentView) {
      case 'splash': return <Splash key="splash" />;
      case 'home': return <Home key="home" categories={categories} onSelectCategory={(id) => navigateTo('list', id)} onAdminAccess={() => navigateTo('admin')} />;
      case 'search': return <Explore key="search" onSelectMap={(id) => navigateTo('detail', null, id)} />;
      case 'list': 
        return <MapList 
          key="list" 
          categoryId={state.selectedCategoryId!} 
          categories={categories} 
          onBack={() => navigateTo('home')} 
          onSelectMap={(id) => navigateTo('detail', null, id)} 
        />;
      case 'detail':
        const currentMap = allMaps.find(m => m.id === state.selectedMapId);
        return <MapDetail 
          key="detail" 
          mapData={currentMap} 
          isUnlocked={state.unlockedCodes.has(state.selectedMapId!)} 
          isFavorited={state.favoriteMapIds.has(state.selectedMapId!)} 
          onBack={() => navigateTo('home')} 
          onUnlock={() => setState(prev => ({ ...prev, unlockedCodes: new Set(prev.unlockedCodes).add(state.selectedMapId!) }))} 
          onToggleFavorite={() => handleToggleFavorite(state.selectedMapId!)} 
        />;
      case 'favorite': return <Favorite key="favorite" favoriteIds={state.favoriteMapIds} onSelectMap={(id) => navigateTo('detail', null, id)} />;
      case 'admin': return <Admin key="admin" onBack={() => navigateTo('home')} />;
      default: return <Home categories={categories} onSelectCategory={(id) => navigateTo('list', id)} onAdminAccess={() => navigateTo('admin')} />;
    }
  };

  const showNav = !['splash', 'detail', 'admin'].includes(state.currentView);

  return (
    <div className="relative w-full min-h-screen bg-[#E6F0FF] flex flex-col items-center">
      <div className="w-full max-w-screen-xl min-h-screen flex flex-col relative shadow-2xl bg-[#E6F0FF]">
        <main className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </main>
        
        {showNav && (
          <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6">
            <div className="w-full max-w-md">
              <BottomNav activeTab={activeTab} onTabChange={(tab) => navigateTo(tab as ViewType)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
