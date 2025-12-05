

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/mockData';
import { Club } from '../types';
import { 
  ChevronRight, CheckCircle2, ArrowRight, ArrowLeft, 
  User, CreditCard, Mail, Phone, MapPin, Building2, Calendar,
  ShieldCheck, Crown
} from 'lucide-react';

export const Registration: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    icNo: '',
    email: '',
    phone: '',
    address: '',
    clubId: '',
    age: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const allClubs = db.getClubs();
    setClubs(allClubs);
    
    if (clubId) {
        const found = allClubs.find(c => c.id === clubId);
        if (found) {
            setSelectedClub(found);
            setFormData(prev => ({ ...prev, clubId: found.id }));
        }
    }
  }, [clubId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Update selected context if dropdown changes
    if (e.target.name === 'clubId') {
        const found = clubs.find(c => c.id === e.target.value);
        setSelectedClub(found || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addMember({
      ...formData,
      profilePicUrl: 'https://picsum.photos/200',
      staffIdUrl: 'https://picsum.photos/200',
      age: Number(formData.age),
      appliedDate: new Date().toISOString().split('T')[0]
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center border border-amber-100 dark:border-slate-800 relative z-10 animate-fade-in">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Permohonan Berjaya!</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Terima kasih, <strong>{formData.fullName}</strong>. Permohonan anda {selectedClub ? `untuk menyertai ${selectedClub.name}` : ''} telah dihantar kepada AJK Kelab untuk semakan lanjut.
          </p>
          
          <div className="flex flex-col gap-3">
             <Link to="/" className="w-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-medium py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 transition-all shadow-lg shadow-slate-900/10 dark:shadow-amber-500/10">
               Kembali ke Utama
             </Link>
             <button onClick={() => window.location.reload()} className="w-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               Daftar Ahli Lain
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-amber-100 dark:selection:bg-amber-900 transition-colors">
      
      {/* Left Panel - Context (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
         {/* Premium Background Effects */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
         
         {/* Content */}
         <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group text-sm font-medium">
               <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                 <ArrowLeft size={16} /> 
               </div>
               Kembali ke Utama
            </Link>

            <div className="space-y-8">
              <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 transform hover:rotate-3 transition-transform duration-500">
                 <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Pahang" className="w-full h-full object-contain" />
              </div>
              
              <div>
                <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                  Pendaftaran <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                      {selectedClub ? selectedClub.name : 'Keahlian SPKA.'}
                  </span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  {selectedClub 
                    ? `Sertai ${selectedClub.name} dan nikmati manfaat eksklusif ahli kelab.` 
                    : 'Sertai komuniti eksklusif kami dan nikmati pelbagai manfaat serta kemudahan di seluruh negeri Pahang.'}
                </p>
              </div>

              {selectedClub && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                     {selectedClub.benefits && selectedClub.benefits.length > 0 && (
                         <div className="space-y-2">
                             <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Manfaat Kelab</p>
                             <ul className="space-y-2">
                                {selectedClub.benefits.slice(0, 3).map((b, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        {b}
                                    </li>
                                ))}
                             </ul>
                         </div>
                     )}
                     <div className="flex items-center gap-4 pt-2">
                         <div className="flex -space-x-3">
                            {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs overflow-hidden">
                                <img src={`https://picsum.photos/seed/${i+50}/100`} className="w-full h-full object-cover" />
                            </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-white">Ahli Berdaftar</p>
                            <p className="text-slate-500 text-xs">Sertai komuniti kami hari ini</p>
                        </div>
                    </div>
                  </div>
              )}
            </div>
         </div>

         <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide uppercase opacity-60">
            <ShieldCheck size={14} />
            Data dilindungi di bawah akta perlindungan data peribadi
         </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950">
         <div className="max-w-2xl mx-auto p-6 md:p-12 lg:p-16 w-full">
            
            {/* Mobile Header */}
            <div className="lg:hidden mb-10">
               <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 font-medium text-sm">
                   <ArrowLeft size={16} /> Kembali
               </Link>
               <div className="flex items-center gap-4 mb-4">
                  <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Logo" className="w-12 h-12 object-contain" />
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Pendaftaran<br/>{selectedClub ? selectedClub.name : 'Ahli Baru'}</h1>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in-up">
               
               {/* Section 1 */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                     <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">1</div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Maklumat Peribadi</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Nama Penuh</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                          <input required type="text" name="fullName" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium" placeholder="Seperti dalam MyKad" />
                        </div>
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">No. Kad Pengenalan</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                          <input required type="text" name="icNo" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium" placeholder="000000-00-0000" />
                        </div>
                      </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Umur</label>
                        <div className="relative">
                           <Calendar className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                           <input required type="number" name="age" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium" placeholder="Contoh: 35" />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Email Rasmi</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                           <input required type="email" name="email" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium" placeholder="email@contoh.com" />
                        </div>
                      </div>
                  </div>
               </div>

               {/* Section 2 */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                     <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">2</div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Maklumat Hubungan & Kelab</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">No. Telefon (WhatsApp)</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                           <input required type="tel" name="phone" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium" placeholder="01X-XXXXXXX" />
                        </div>
                      </div>
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Pilihan Kelab</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                            <select 
                                required 
                                name="clubId" 
                                value={formData.clubId}
                                onChange={handleChange} 
                                className={`w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-10 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none appearance-none cursor-pointer font-medium transition-all ${clubId ? 'opacity-70 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}`}
                                disabled={!!clubId}
                            >
                              <option value="">Sila Pilih Kelab</option>
                              {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {!clubId && (
                                <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                                <ChevronRight size={20} className="rotate-90" />
                                </div>
                            )}
                        </div>
                      </div>
                  </div>
                  <div className="space-y-2 group">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Alamat Lengkap</label>
                      <div className="relative">
                         <MapPin className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                         <textarea required name="address" rows={3} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium resize-none"></textarea>
                      </div>
                  </div>
               </div>

               <div className="pt-4">
                  <button type="submit" className="group w-full bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-amber-500/10 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0 text-lg">
                    <span>Hantar Permohonan</span>
                    <div className="bg-white/10 dark:bg-slate-900/10 rounded-full p-1 group-hover:bg-amber-500 dark:group-hover:bg-slate-900 group-hover:text-slate-900 dark:group-hover:text-amber-500 transition-colors">
                        <ArrowRight size={20} />
                    </div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed max-w-sm mx-auto">
                     Dengan menekan butang hantar, anda mengesahkan bahawa maklumat yang diberikan adalah benar dan bersetuju dengan terma dan syarat SPKA.
                  </p>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};