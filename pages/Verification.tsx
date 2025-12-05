import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/mockData';
import { Member, MemberStatus, Club, Role } from '../types';
import { CheckCircle2, XCircle, Search, ShieldCheck, ArrowLeft, ChevronRight, Building2, User, Save, MapPin, Tag } from 'lucide-react';

interface VerificationProps {
    role?: Role; // Role passed from App routing
}

export const Verification: React.FC<VerificationProps> = ({ role }) => {
  const { id } = useParams<{ id: string }>();
  const [inputCode, setInputCode] = useState(id || '');
  
  // State: 'IDLE' means waiting for input, 'FOUND' means success, 'NOT_FOUND' means failed search
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'FOUND' | 'NOT_FOUND'>('IDLE');
  
  const [foundMembers, setFoundMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const [clubs, setClubs] = useState<Club[]>([]);

  // Log Usage State for Partners (URS06)
  const [showLogModal, setShowLogModal] = useState(false);
  const [usageData, setUsageData] = useState({ benefitType: '', location: '' });

  useEffect(() => {
    setClubs(db.getClubs());
    if (id) {
        handleSearch(id);
    }
  }, [id]);

  const handleSearch = (searchQuery: string) => {
    if(!searchQuery.trim()) return;
    
    const results = db.findAllMemberships(searchQuery);
    
    if (results.length > 0) {
        setFoundMembers(results);
        setSearchStatus('FOUND');
        setSelectedMember(null); // Reset selection to show list first
    } else {
        setFoundMembers([]);
        setSearchStatus('NOT_FOUND');
    }
  };

  const getClubName = (clubId: string) => {
      return clubs.find(c => c.id === clubId)?.name || 'Unknown Club';
  };

  const resetSearch = () => {
    setFoundMembers([]);
    setSelectedMember(null);
    setSearchStatus('IDLE'); 
    setInputCode('');
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
  };

  const handleLogUsage = () => {
      if(selectedMember) {
          db.logUsage(selectedMember.id, 'p_current', usageData.benefitType || 'General Visit', usageData.location || 'Partner Location');
          alert('Rekod penggunaan berjaya disimpan! (URS06)');
          setShowLogModal(false);
          setUsageData({ benefitType: '', location: '' });
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative font-sans text-slate-900 dark:text-white overflow-hidden transition-colors">
       
      {/* Portal Header */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <Link to="/" className="flex items-center gap-3 group" onClick={resetSearch}>
           <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Pahang" className="h-14 w-auto drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" />
           <div>
              <h1 className="font-bold text-sm leading-none text-slate-900 dark:text-white">SPKA PORTAL</h1>
              {role === Role.PARTNER && <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-bold uppercase">Partner Mode</span>}
           </div>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
         {/* Background Decor */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-slate-200 to-amber-100 dark:from-slate-800 dark:to-slate-900 rounded-full blur-[120px] pointer-events-none opacity-60 transition-all duration-700 ${searchStatus === 'FOUND' ? 'scale-150 opacity-40' : ''}`}></div>

         {/* SEARCH STATE CONTAINER */}
         {searchStatus !== 'FOUND' && (
            <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden relative z-20 transition-all duration-300 animate-fade-in-up">
                
                {/* Header Section */}
                <div className="bg-slate-900 dark:bg-slate-950 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg">
                        <ShieldCheck className="text-amber-500" size={32} />
                    </div>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-wide">Semakan Keahlian</h1>
                    <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Verifikasi Rasmi</p>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={inputCode} 
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="Masukkan No. IC / ID Ahli"
                                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 rounded-xl px-4 py-4 pr-12 outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-center font-mono placeholder:font-sans text-lg font-bold tracking-wide placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                            />
                            <button onClick={() => handleSearch(inputCode)} className="absolute right-2 top-2 p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/10">
                                <Search size={20} />
                            </button>
                        </div>
                        
                        {/* Error Message */}
                        {searchStatus === 'NOT_FOUND' && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in">
                                <XCircle size={20} className="shrink-0" />
                                <div className="text-xs text-left">
                                    <p className="font-bold">Tiada Rekod Ditemui</p>
                                    <p>Sila pastikan nombor IC atau ID dimasukkan dengan betul.</p>
                                </div>
                                </div>
                        )}
                        
                        <div className="pt-4 text-center">
                            <Link to="/register" className="text-sm text-slate-400 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-500 font-medium transition-colors">
                                Belum mendaftar? Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
         )}

         {/* FOUND STATE - LIST OF CLUBS */}
         {searchStatus === 'FOUND' && !selectedMember && (
             <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700 overflow-hidden relative z-20 transition-all duration-300 animate-fade-in-up">
                 <div className="bg-slate-900 dark:bg-slate-950 p-6 text-center border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white">Rekod Keahlian ({foundMembers.length})</h2>
                    <p className="text-slate-400 text-xs mt-1">Sila pilih kelab untuk paparan kad</p>
                 </div>
                 
                 <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                     {foundMembers.map((member) => (
                         <button 
                            key={member.id}
                            onClick={() => handleSelectMember(member)}
                            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all group shadow-sm text-left"
                         >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{getClubName(member.clubId)}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            member.status === MemberStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                         </button>
                     ))}
                 </div>
                 
                 <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                     <button onClick={resetSearch} className="w-full py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-medium transition-colors">
                        Buat Carian Lain
                     </button>
                 </div>
             </div>
         )}

         {/* FOUND STATE - DISPLAY SELECTED VERTICAL VIRTUAL CARD */}
         {selectedMember && (
            <div className="flex flex-col items-center animate-fade-in-up w-full max-w-[360px] mx-auto relative z-30">
                 
                 {/* The Vertical Card */}
                 <div className="w-full aspect-[9/19] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-slate-800 flex flex-col relative group select-none ring-1 ring-white/10">
                     
                     {/* Decorative Background */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
                     <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

                     {/* Content Layer */}
                     <div className="relative z-10 flex-1 flex flex-col items-center text-center p-8 pt-10">
                         
                         {/* Header Logo */}
                         <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-lg shadow-amber-500/10 mb-4 flex items-center justify-center ring-4 ring-amber-500/20">
                            <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" className="w-full h-full object-contain" alt="Logo" />
                         </div>
                         
                         <div className="mb-2">
                            <h3 className="text-amber-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Ahli Berdaftar</h3>
                            <h1 className="text-xl font-bold text-white leading-tight px-4">{getClubName(selectedMember.clubId)}</h1>
                         </div>

                         {/* Profile Picture Area */}
                         <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-800 shadow-2xl overflow-hidden relative z-10">
                                <img 
                                    src={selectedMember.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.fullName)}&background=f59e0b&color=fff`} 
                                    className="w-full h-full object-cover" 
                                    alt="Profile"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.fullName)}&background=1e293b&color=cbd5e1`;
                                    }}
                                />
                            </div>
                            {/* Status Badge */}
                            <div className={`absolute -bottom-2 -right-2 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-4 border-slate-900 shadow-lg ${
                                selectedMember.status === MemberStatus.ACTIVE ? 'bg-emerald-500 text-emerald-50' : 'bg-red-500 text-white'
                            }`}>
                                {selectedMember.status === MemberStatus.ACTIVE ? 'Aktif' : selectedMember.status}
                            </div>
                         </div>

                         {/* Name & ID */}
                         <div className="w-full space-y-3 mb-auto">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Nama Ahli</p>
                                <p className="text-lg font-bold text-white leading-tight line-clamp-2">{selectedMember.fullName}</p>
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">No. ID</p>
                                    <p className="text-sm font-mono font-bold text-amber-500 tracking-wider truncate">{selectedMember.id.toUpperCase()}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">No. KP</p>
                                    <p className="text-sm font-mono font-bold text-white tracking-wider">{selectedMember.icNo.replace(/-/g, '')}</p>
                                </div>
                             </div>
                         </div>

                         {/* Footer / QR */}
                         <div className="mt-8 bg-white p-4 rounded-2xl shadow-xl shadow-black/50">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`} className="w-32 h-32 object-contain mix-blend-multiply" alt="QR" />
                         </div>
                         <p className="text-[9px] text-slate-600 mt-2 mb-6 font-mono">Imbas untuk pengesahan</p>

                     </div>
                 </div>

                 {/* PARTNER ACTION (URS06) */}
                 {role === Role.PARTNER && selectedMember.status === MemberStatus.ACTIVE && (
                    <button 
                        onClick={() => setShowLogModal(true)}
                        className="mt-6 w-full py-4 bg-amber-500 text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-amber-400 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 animate-bounce-slow"
                    >
                        <Save size={20} /> Rekod Penggunaan / Lawatan
                    </button>
                 )}

                 {/* Simple Back Action */}
                 <div className="mt-4 flex gap-3">
                    {foundMembers.length > 1 && (
                        <button onClick={() => setSelectedMember(null)} className="px-6 py-3 bg-slate-800 text-white rounded-full font-bold text-sm shadow-xl hover:bg-slate-700 transition-all">
                            Kembali ke Senarai
                        </button>
                    )}
                    <button onClick={resetSearch} className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-sm shadow-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
                         Semak Carian Lain
                    </button>
                 </div>
            </div>
         )}

         {/* URS06 LOG USAGE MODAL FOR PARTNERS */}
         {showLogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Rekod Penggunaan Manfaat</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Jenis Manfaat</label>
                            <div className="relative mt-1">
                                <Tag className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Contoh: Diskaun Bilik" 
                                    value={usageData.benefitType}
                                    onChange={e => setUsageData({...usageData, benefitType: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Lokasi / Cawangan</label>
                            <div className="relative mt-1">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Nama premis anda"
                                    value={usageData.location}
                                    onChange={e => setUsageData({...usageData, location: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setShowLogModal(false)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Batal</button>
                            <button onClick={handleLogUsage} className="flex-1 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400">Sahkan</button>
                        </div>
                    </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};