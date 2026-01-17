import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Shield, ChevronRight, User, Loader2 } from 'lucide-react';

// --- CONFIG ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/recruit"; 

function App() {
  const [recruits, setRecruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruit, setSelectedRecruit] = useState(null);
  
  // Filters
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const fetchRecruits = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`); 
      setRecruits(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchRecruits();
  }, [isAuthenticated]);

  // Filter Logic
  const filteredRecruits = recruits.filter(r => {
    return (
      (filterLevel === 'All' || r.level === filterLevel) &&
      (filterGender === 'All' || r.gender === filterGender) &&
      (r.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // --- ANIMATION VARIANTS ---
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden p-4">
        {/* Background Animation - Now strictly contained */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute top-[-20%] left-[-50%] md:left-[-10%] w-[500px] h-[500px] bg-green-900 rounded-full blur-[120px]"
             />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm text-center shadow-2xl"
        >
          <motion.div 
            initial={{ y: -20 }} animate={{ y: 0 }}
            className="mx-auto mb-6 flex items-center justify-center"
          >
            <img 
              src="/msg-logo.png" 
              alt="MSG Logo" 
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" 
            />
          </motion.div>
          
          <h1 className="text-xl font-bold text-white mb-2 tracking-widest">MSG COMMAND</h1>
          <p className="text-gray-500 text-xs uppercase mb-8">Restricted Access</p>
          
          <input 
            type="password" 
            placeholder="Enter Access Code" 
            className="w-full bg-black/50 border border-green-900/30 text-white p-3 rounded-lg mb-4 text-center focus:border-green-500 outline-none transition-colors"
            onChange={(e) => setPassword(e.target.value)}
          />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { if(password === 'admin123') setIsAuthenticated(true) }}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition shadow-lg"
          >
            ACCESS DATABASE
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    // FIX: overflow-x-hidden ensures no horizontal scroll on mobile
    <div className="min-h-screen w-full bg-[#050505] text-gray-100 font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* Top Bar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-20"
      >
        {/* FIX: flex-wrap allows items to wrap nicely on tiny screens */}
        <div className="max-w-7xl mx-auto px-4 py-3 md:h-20 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/msg-logo.png" alt="MSG Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none text-white">Recruitment Portal</h1>
              <span className="text-green-500 text-[10px] font-mono">SECURE CONNECTION</span>
            </div>
          </div>
          
          {/* Stats & Logout - Auto scales */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
             <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <User size={14} className="text-green-400"/>
                <span className="text-xs">Applicants: <strong className="text-white">{recruits.length}</strong></span>
             </div>
             {/* Mobile only stat count */}
             <span className="md:hidden text-xs text-gray-400">NOA: ({recruits.length})</span>
             
            <button onClick={() => setIsAuthenticated(false)} className="text-red-400 hover:text-red-300 transition-colors text-xs border border-red-900/30 px-3 py-1 rounded bg-red-900/10">
                Logout
            </button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Controls - Stack vertically on mobile, row on desktop */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col md:grid md:grid-cols-4 gap-3 mb-6"
        >
          <div className="relative md:col-span-2 group w-full">
            <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 text-white focus:border-green-500/50 focus:bg-white/10 outline-none transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:contents">
            <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-gray-300 focus:border-green-500/50 outline-none text-sm"
                onChange={(e) => setFilterLevel(e.target.value)}
            >
                <option value="All">Level</option>
                {[100, 200, 300, 400, 500].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-gray-300 focus:border-green-500/50 outline-none text-sm"
                onChange={(e) => setFilterGender(e.target.value)}
            >
                <option value="All">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
          </div>
        </motion.div>

        {/* The Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-green-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="animate-pulse tracking-widest text-xs uppercase">Loading...</span>
          </div>
        ) : (
          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredRecruits.map((recruit) => (
                <motion.div 
                  key={recruit._id}
                  layout 
                  variants={cardVars}
                  initial="hidden" 
                  animate="show"
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => setSelectedRecruit(recruit)}
                  className="group relative bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer overflow-hidden shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-transparent opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  
                  <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 shrink-0">
                        <img src={recruit.passportUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base truncate">{recruit.fullName}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider truncate">{recruit.level} Lvl • {recruit.faculty}</p>
                      </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                     <span className={`text-[10px] px-2 py-0.5 rounded border ${recruit.gender === 'Male' ? 'border-blue-900/50 text-blue-400 bg-blue-900/10' : 'border-pink-900/50 text-pink-400 bg-pink-900/10'}`}>
                      {recruit.gender}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-600"/>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modal Detail View */}
      <AnimatePresence>
        {selectedRecruit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecruit(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedRecruit(null)}
                className="absolute top-3 right-3 z-20 bg-white/10 p-2 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-5 md:p-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left mb-6">
                  <img 
                    src={selectedRecruit.passportUrl} 
                    className="w-28 h-28 rounded-xl object-cover border-2 border-green-600 shadow-lg shrink-0" 
                    alt="Passport"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white leading-tight">{selectedRecruit.fullName}</h2>
                    <p className="text-green-500 text-sm font-medium mb-3">{selectedRecruit.course}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">{selectedRecruit.level} Level</span>
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5">{selectedRecruit.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Motivation</p>
                        <p className="text-gray-300 text-sm italic">"{selectedRecruit.reason}"</p>
                    </div>
                    
                    {/* Contact Info Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase mb-1">Email Address</p>
                            <p className="text-white font-mono text-xs break-all">{selectedRecruit.email}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase mb-1">WhatsApp</p>
                            <p className="text-green-400 font-mono text-xs">{selectedRecruit.whatsapp}</p>
                        </div>
                    </div>

                    {/* Signature Row */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                        <p className="text-[10px] text-gray-500 uppercase">Digital Signature</p>
                        <div className="bg-white/10 p-1 rounded">
                            <img src={selectedRecruit.signatureUrl} className="h-8 opacity-80 filter invert" alt="Sig" />
                        </div>
                    </div>
                </div>

                <a 
                   href={`https://wa.me/${selectedRecruit.whatsapp}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full bg-green-600 active:bg-green-700 text-black font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"
                >
                  CONTACT APPLICANT
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;