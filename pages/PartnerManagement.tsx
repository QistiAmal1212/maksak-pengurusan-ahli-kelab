

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockData';
import { BenefitPartner, Program } from '../types';
import { Search, Plus, MapPin, Tag, Building2, Crown, Briefcase, ChevronRight, X } from 'lucide-react';

export const PartnerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<BenefitPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newPartner, setNewPartner] = useState<{
    companyName: string;
    description: string;
    offers: string[];
    location: string;
    programsString: string;
  }>({
    companyName: '',
    description: '',
    offers: [],
    location: '',
    programsString: ''
  });

  const [tempOffer, setTempOffer] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPartners([...db.getPartners()]);
  };

  const handleAddOffer = () => {
    if (tempOffer.trim()) {
      setNewPartner(prev => ({ ...prev, offers: [...prev.offers, tempOffer.trim()] }));
      setTempOffer('');
    }
  };

  const handleRemoveOffer = (index: number) => {
    setNewPartner(prev => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index)
    }));
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const programs: Program[] = newPartner.programsString 
        ? newPartner.programsString.split(',').map(s => ({
            name: s.trim(),
            benefits: [],
            terms: []
          })).filter(p => p.name.length > 0)
        : [];

    db.addPartner({
        companyName: newPartner.companyName,
        description: newPartner.description,
        offers: newPartner.offers,
        location: newPartner.location,
        programs: programs
    });
    
    setIsModalOpen(false);
    refreshData();
    setNewPartner({ companyName: '', description: '', offers: [], location: '', programsString: '' });
  };

  const filteredPartners = partners.filter(p => 
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.offers.some(o => o.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">Syarikat Luar</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Rakan Strategik (Syarikat)</h1>
            <p className="text-slate-500 dark:text-slate-400">Uruskan syarikat luar, hotel dan penyedia manfaat (External Partners).</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari syarikat..." 
                    className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-500/20"
            >
                <Plus size={18} /> <span className="hidden md:inline">Tambah Rakan</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map(partner => (
            <div 
                key={partner.id} 
                onClick={() => navigate(`/partners/${partner.id}`)}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer relative overflow-hidden"
            >
                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 text-amber-500">
                    <ChevronRight size={24} />
                </div>

                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                        <Building2 size={24} />
                    </div>
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                        {partner.id.toUpperCase()}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{partner.companyName}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{partner.description}</p>
                
                <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                        {partner.offers && partner.offers.length > 0 ? (
                            partner.offers.slice(0, 2).map((offer, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 text-[10px] font-bold border border-amber-100 dark:border-amber-500/20">
                                    <Tag size={10} /> {offer}
                                </span>
                            ))
                        ) : <span className="text-[10px] text-slate-400">Tiada tawaran aktif</span>}
                        {partner.offers && partner.offers.length > 2 && (
                            <span className="text-[10px] text-slate-400 flex items-center">+{partner.offers.length - 2} lagi</span>
                        )}
                    </div>
                </div>

                {/* Programs / Sub-Clubs Section */}
                {partner.programs && partner.programs.length > 0 ? (
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Kelab / Program Tersedia</p>
                        <div className="flex flex-wrap gap-2">
                            {partner.programs.slice(0, 2).map((prog, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Crown size={10} className="text-amber-500" />
                                    {prog.name}
                                </div>
                            ))}
                            {partner.programs.length > 2 && (
                                <span className="text-xs text-slate-400 self-center">+{partner.programs.length - 2}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                         <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <MapPin size={16} className="text-slate-400" />
                            <span>{partner.location}</span>
                        </div>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50 dark:bg-amber-900/20">
                 <div className="flex items-center gap-3 mb-1">
                    <Briefcase className="text-amber-600 dark:text-amber-400" size={20} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Rakan Strategik</h2>
                 </div>
                 <p className="text-xs text-slate-500 ml-8">Borang untuk syarikat luar & penyedia manfaat.</p>
              </div>
              <form onSubmit={handleAddPartner} className="p-6 space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Syarikat</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" value={newPartner.companyName} onChange={e => setNewPartner({...newPartner, companyName: e.target.value})} placeholder="Contoh: Hotel Seri Malaysia" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" value={newPartner.description} onChange={e => setNewPartner({...newPartner, description: e.target.value})} placeholder="Hotel & Penginapan" />
                 </div>
                 
                 {/* Multiple Offers Section */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tawaran (Offers)</label>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" 
                            value={tempOffer} 
                            onChange={e => setTempOffer(e.target.value)} 
                            placeholder="Contoh: 20% off rooms" 
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddOffer())}
                        />
                        <button type="button" onClick={handleAddOffer} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold p-3 rounded-lg transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {newPartner.offers.map((offer, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-500/20">
                                <span>{offer}</span>
                                <button type="button" onClick={() => handleRemoveOffer(idx)} className="hover:text-red-500"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi</label>
                    <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" value={newPartner.location} onChange={e => setNewPartner({...newPartner, location: e.target.value})} />
                 </div>
                 
                 <div className="space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Program / Kelab Luaran (Optional)</label>
                     <input className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" value={newPartner.programsString} onChange={e => setNewPartner({...newPartner, programsString: e.target.value})} placeholder="Asingkan dengan koma (Contoh: Platinum Club, Gold Stay)" />
                     <p className="text-[10px] text-slate-400">Senaraikan jika syarikat ini mempunyai sub-kelab atau tier keahlian sendiri.</p>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium">Batal</button>
                    <button type="submit" className="px-5 py-2.5 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-600 transition-colors">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};