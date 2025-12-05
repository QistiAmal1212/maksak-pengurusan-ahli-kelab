

import React, { useEffect, useState } from 'react';
import { db } from '../services/mockData';
import { Club } from '../types';
import { 
    Search, Plus, MapPin, Building2, User, Phone, Mail, Shield, 
    Link as LinkIcon, CheckCircle2, FileText, X, MinusCircle 
} from 'lucide-react';

export const ClubManagement: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newClub, setNewClub] = useState<{
      name: string;
      code: string;
      picName: string;
      picPhone: string;
      email: string;
      state: string;
      benefits: string[];
      terms: string[];
  }>({
    name: '',
    code: '',
    picName: '',
    picPhone: '',
    email: '',
    state: '',
    benefits: [],
    terms: []
  });

  const [tempBenefit, setTempBenefit] = useState('');
  const [tempTerm, setTempTerm] = useState('');

  useEffect(() => {
    setClubs(db.getClubs());
  }, []);

  const handleAddClub = (e: React.FormEvent) => {
    e.preventDefault();
    db.addClub(newClub);
    setClubs(db.getClubs());
    setIsModalOpen(false);
    setNewClub({ name: '', code: '', picName: '', picPhone: '', email: '', state: '', benefits: [], terms: [] });
  };

  const filteredClubs = clubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyRegistrationLink = (clubId: string) => {
    const link = `${window.location.origin}/#/register/${clubId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(clubId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addBenefit = () => {
      if (tempBenefit.trim()) {
          setNewClub(prev => ({ ...prev, benefits: [...prev.benefits, tempBenefit.trim()] }));
          setTempBenefit('');
      }
  };

  const removeBenefit = (index: number) => {
      setNewClub(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const addTerm = () => {
      if (tempTerm.trim()) {
          setNewClub(prev => ({ ...prev, terms: [...prev.terms, tempTerm.trim()] }));
          setTempTerm('');
      }
  };

  const removeTerm = (index: number) => {
      setNewClub(prev => ({ ...prev, terms: prev.terms.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">Kelab Dalaman</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengurusan Kelab</h1>
            <p className="text-slate-500 dark:text-slate-400">Pendaftaran kelab jabatan dan agensi kerajaan (Internal MAKSAK).</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari kelab..." 
                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Plus size={18} /> <span className="hidden md:inline">Daftar Kelab</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => (
            <div key={club.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <Building2 size={24} />
                    </div>
                     <button 
                        onClick={() => copyRegistrationLink(club.id)} 
                        className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 relative" 
                        title="Salin Pautan Pendaftaran"
                     >
                        <LinkIcon size={18} />
                        {copiedId === club.id && (
                            <span className="absolute -top-8 -right-4 bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow animate-fade-in whitespace-nowrap z-20">
                                Link Copied!
                            </span>
                        )}
                     </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight">{club.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md font-mono">{club.code}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {club.state}</span>
                </div>
                
                {/* Benefits & Terms Summary */}
                <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span>{club.benefits?.length || 0} Manfaat</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <FileText size={12} className="text-blue-500" />
                        <span>{club.terms?.length || 0} Syarat</span>
                    </div>
                </div>

                <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <User size={14} />
                        </div>
                        <div className="text-xs">
                            <p className="text-slate-400 uppercase tracking-wide font-bold text-[10px]">PIC / Wakil</p>
                            <p className="font-medium text-slate-900 dark:text-white">{club.picName}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg">
                            <Phone size={12} /> {club.picPhone}
                        </div>
                         <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg truncate">
                            <Mail size={12} /> <span className="truncate">{club.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Add Club Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-900/20">
                 <div className="flex items-center gap-3 mb-1">
                    <Shield className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pendaftaran Kelab Baharu</h2>
                 </div>
                 <p className="text-xs text-slate-500 ml-8">Borang untuk kelab dalaman jabatan kerajaan sahaja.</p>
              </div>
              
              <div className="p-8">
                <form onSubmit={handleAddClub} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Kelab</label>
                            <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} placeholder="Contoh: Kelab Sukan JKR" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Kod Kelab</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.code} onChange={e => setNewClub({...newClub, code: e.target.value})} placeholder="JKR-001" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Negeri/Daerah</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.state} onChange={e => setNewClub({...newClub, state: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Benefits & Terms */}
                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                        {/* Benefits */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-2"><CheckCircle2 size={14} /> Manfaat Kelab</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                                    value={tempBenefit}
                                    onChange={e => setTempBenefit(e.target.value)}
                                    placeholder="Tambah manfaat..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                                />
                                <button type="button" onClick={addBenefit} className="bg-green-500 text-white p-2.5 rounded-lg hover:bg-green-600 transition-colors"><Plus size={16}/></button>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {newClub.benefits.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded text-xs font-medium text-slate-700 dark:text-slate-300">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeBenefit(i)} className="text-slate-400 hover:text-red-500"><MinusCircle size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2"><FileText size={14} /> Syarat Kelab</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                                    value={tempTerm}
                                    onChange={e => setTempTerm(e.target.value)}
                                    placeholder="Tambah syarat..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTerm())}
                                />
                                <button type="button" onClick={addTerm} className="bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors"><Plus size={16}/></button>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {newClub.terms.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded text-xs font-medium text-slate-700 dark:text-slate-300">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeTerm(i)} className="text-slate-400 hover:text-red-500"><MinusCircle size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Maklumat Wakil (AJK)</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Wakil</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.picName} onChange={e => setNewClub({...newClub, picName: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">No. Telefon</label>
                                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.picPhone} onChange={e => setNewClub({...newClub, picPhone: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Emel Rasmi</label>
                                    <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white" value={newClub.email} onChange={e => setNewClub({...newClub, email: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium">Batal</button>
                        <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Simpan Kelab</button>
                    </div>
                </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};