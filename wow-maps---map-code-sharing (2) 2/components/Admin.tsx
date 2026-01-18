
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, ChevronLeft, 
  Database, Map as MapIcon, ShieldAlert, Settings, Lock,
  Sword, Activity, Zap, Target, Ghost, Loader2, Sparkles
} from 'lucide-react';
import { Category, MapEntry } from '../types';
import * as firebase from '../services/firebaseService';

const ICONS = [
  { name: 'Sword', icon: Sword },
  { name: 'Activity', icon: Activity },
  { name: 'Zap', icon: Zap },
  { name: 'Target', icon: Target },
  { name: 'Ghost', icon: Ghost },
];

interface AdminProps {
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'maps' | 'monetization'>('categories');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [maps, setMaps] = useState<MapEntry[]>([]);
  const [status, setStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState<Omit<Category, 'id'>>({ title: '', icon: 'Sword', image: '' });
  const [mapForm, setMapForm] = useState<Omit<MapEntry, 'id'>>({ 
    categoryId: '', title: '', description: '', thumbnail: '', code: '' 
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, mps] = await Promise.all([
        firebase.fetchCategories(),
        firebase.fetchAllMaps()
      ]);
      setCategories(cats);
      setMaps(mps);
    } catch (e) {
      showStatus("Sync Failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === 'Agnish7870@') setIsAuthenticated(true);
    else showStatus("Invalid Key", "error");
  };

  const showStatus = (msg: string, type: 'success' | 'error') => {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const resetForms = () => {
    setEditingId(null);
    setCatForm({ title: '', icon: 'Sword', image: '' });
    setMapForm({ categoryId: '', title: '', description: '', thumbnail: '', code: '' });
  };

  const saveCategory = async () => {
    if (!catForm.title) return showStatus("Title required", "error");
    setIsLoading(true);
    try {
      if (editingId) await firebase.updateCategory(editingId, catForm);
      else await firebase.addCategory(catForm);
      showStatus("Database Updated", "success");
      resetForms();
      await loadData();
    } catch (e) { showStatus("Operation Failed", "error"); setIsLoading(false); }
  };

  const handleAiIntel = async () => {
    if (!mapForm.title) return showStatus("Enter Title First", "error");
    setIsAiLoading(true);
    try {
      const intel = await firebase.generateMapIntel(mapForm.title, mapForm.description);
      setMapForm(prev => ({ ...prev, description: intel }));
      showStatus("AI Intel Generated", "success");
    } catch (e) {
      showStatus("AI Downlink Failed", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveMap = async () => {
    if (!mapForm.title || !mapForm.categoryId || !mapForm.code) return showStatus("Required fields missing", "error");
    setIsLoading(true);
    try {
      if (editingId) await firebase.updateMap(editingId, mapForm);
      else await firebase.addMap(mapForm);
      showStatus("Map Deployed", "success");
      resetForms();
      await loadData();
    } catch (e) { showStatus("Operation Failed", "error"); setIsLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#E6F0FF]">
        <div className="w-full max-w-xs space-y-10 text-center">
          <div className="w-24 h-24 soft-out rounded-[2.5rem] flex items-center justify-center mx-auto text-[#60A5FA]">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold gaming-font text-[#1E3A8A] uppercase tracking-widest">Admin Uplink</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="soft-in rounded-2xl p-1">
              <input 
                type="password" 
                value={accessKey} 
                onChange={e => setAccessKey(e.target.value)}
                placeholder="Access Key..." 
                className="w-full bg-transparent p-4 text-center text-[#1E3A8A] focus:outline-none font-bold"
              />
            </div>
            <button className="w-full py-5 soft-button rounded-2xl text-[#1E3A8A] font-black uppercase text-xs tracking-widest">Establish Link</button>
            <button type="button" onClick={onBack} className="text-[#60A5FA] text-[10px] uppercase font-black tracking-widest">Return to Base</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-[#E6F0FF] overflow-hidden">
      <header className="p-8 bg-[#E6F0FF]/80 backdrop-blur-xl shrink-0 space-y-8 z-50 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 soft-button rounded-xl flex items-center justify-center text-[#60A5FA]"><ChevronLeft size={20}/></button>
            <h1 className="text-xl font-bold gaming-font text-[#1E3A8A] uppercase">Console</h1>
          </div>
          {isLoading && <Loader2 className="animate-spin text-[#60A5FA]" size={20} />}
        </div>
        
        <div className="flex gap-2 p-1.5 soft-in rounded-[1.2rem]">
          {['categories', 'maps', 'monetization'].map((tab) => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab as any); resetForms(); }}
              className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'soft-button text-[#1E3A8A]' : 'text-[#60A5FA]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-scroll no-scrollbar p-8">
        <div className="space-y-12 pb-40">
          {activeTab === 'categories' ? (
            <div className="space-y-8">
              <div className="soft-out p-8 rounded-[3rem] space-y-5">
                <h2 className="text-[10px] font-black text-[#60A5FA] uppercase tracking-[0.4em]">{editingId ? 'Edit' : 'New'} Category</h2>
                <div className="space-y-4">
                  <div className="soft-in rounded-2xl p-1"><input placeholder="Title..." value={catForm.title} onChange={e => setCatForm({...catForm, title: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none" /></div>
                  <div className="soft-in rounded-2xl p-1"><input placeholder="Image URL..." value={catForm.image} onChange={e => setCatForm({...catForm, image: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none" /></div>
                </div>
                <button onClick={saveCategory} className="w-full py-4 soft-button rounded-2xl text-[#1E3A8A] font-black uppercase text-[10px] tracking-widest">{editingId ? 'Update' : 'Initialize'}</button>
              </div>

              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="soft-out p-4 rounded-[2rem] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E3A8A] uppercase ml-2">{cat.title}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(cat.id); setCatForm({title: cat.title, icon: cat.icon, image: cat.image}); }} className="p-3 soft-button rounded-xl text-[#60A5FA]"><Edit2 size={16}/></button>
                      <button onClick={async () => { await firebase.deleteCategory(cat.id); loadData(); }} className="p-3 soft-button rounded-xl text-rose-400"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'maps' ? (
            <div className="space-y-8">
              <div className="soft-out p-8 rounded-[3rem] space-y-5">
                <h2 className="text-[10px] font-black text-[#60A5FA] uppercase tracking-[0.4em]">Map Deployment</h2>
                <div className="space-y-4">
                  <div className="soft-in rounded-2xl p-1">
                    <select value={mapForm.categoryId} onChange={e => setMapForm({...mapForm, categoryId: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none">
                      <option value="">Select Category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="soft-in rounded-2xl p-1"><input placeholder="Title..." value={mapForm.title} onChange={e => setMapForm({...mapForm, title: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none" /></div>
                  <div className="soft-in rounded-2xl p-1"><input placeholder="Map Code..." value={mapForm.code} onChange={e => setMapForm({...mapForm, code: e.target.value})} className="w-full bg-transparent p-4 text-xs font-mono text-[#1E3A8A] focus:outline-none" /></div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[8px] font-black text-[#60A5FA] uppercase tracking-widest">Tactical Description</span>
                       <button 
                        onClick={handleAiIntel}
                        disabled={isAiLoading}
                        className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-[#60A5FA] hover:text-[#1E3A8A] transition-colors"
                       >
                         {isAiLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                         AI Intel Briefing
                       </button>
                    </div>
                    <div className="soft-in rounded-2xl p-1"><textarea placeholder="Tactical description..." rows={3} value={mapForm.description} onChange={e => setMapForm({...mapForm, description: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none resize-none" /></div>
                  </div>
                  <div className="soft-in rounded-2xl p-1"><input placeholder="Thumbnail URL..." value={mapForm.thumbnail} onChange={e => setMapForm({...mapForm, thumbnail: e.target.value})} className="w-full bg-transparent p-4 text-xs text-[#1E3A8A] focus:outline-none" /></div>
                </div>
                <button onClick={saveMap} className="w-full py-4 soft-button rounded-2xl text-[#1E3A8A] font-black uppercase text-[10px] tracking-widest">{editingId ? 'Push Update' : 'Broadcast Map'}</button>
              </div>

              <div className="space-y-4">
                {maps.map(m => (
                  <div key={m.id} className="soft-out p-4 rounded-[2rem] flex items-center justify-between">
                    <div className="ml-2 max-w-[60%]">
                      <p className="text-xs font-bold text-[#1E3A8A] uppercase truncate">{m.title}</p>
                      <p className="text-[9px] font-mono text-[#60A5FA] tracking-widest">{m.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(m.id); setMapForm({categoryId: m.categoryId, title: m.title, description: m.description, thumbnail: m.thumbnail, code: m.code}); }} className="p-3 soft-button rounded-xl text-[#60A5FA]"><Edit2 size={16}/></button>
                      <button onClick={async () => { await firebase.deleteMap(m.id); loadData(); }} className="p-3 soft-button rounded-xl text-rose-400"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
               <div className="soft-out p-10 rounded-[3rem] text-center space-y-6">
                 <ShieldAlert size={48} className="mx-auto text-[#60A5FA]" />
                 <h2 className="text-lg font-bold gaming-font text-[#1E3A8A] uppercase">Monetization Active</h2>
                 <p className="text-xs text-[#60A5FA] leading-relaxed">AdMob Reward protocols are initialized for all coordinates. Native bridging required for APK deployment. Reward IDs are mapped in constants.tsx.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} exit={{y:50, opacity:0}} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 soft-button text-[#1E3A8A] rounded-full font-black text-[10px] uppercase z-[100] shadow-xl border border-white/50">
            {status.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
