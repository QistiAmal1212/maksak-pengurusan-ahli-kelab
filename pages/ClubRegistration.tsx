import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../services/mockData';
import { BenefitPartner, Program } from '../types';
import { 
  CheckCircle2, ArrowRight, User, CreditCard, Mail, Phone, MapPin, 
  Calendar, ShieldCheck, Crown, Building2
} from 'lucide-react';

export const ClubRegistration: React.FC = () => {
  const { partnerId, programId } = useParams<{ partnerId: string; programId: string }>();
  
  const [partner, setPartner] = useState<BenefitPartner | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    icNo: '',
    email: '',
    phone: '',
    address: '',
    age: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (partnerId && programId) {
      const foundPartner = db.getPartners().find(p => p.id === partnerId);
      if (foundPartner) {
        setPartner(foundPartner);
        const foundProgram = foundPartner.programs?.find(prog => prog.id === programId);
        if (foundProgram) {
            setProgram(foundProgram);
        } else {
            setError('Pakej/Kelab tidak ditemui.');
        }
      } else {
        setError('Pautan tidak sah atau telah luput.');
      }
      setLoading(false);
    }
  }, [partnerId, programId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission to partner system
    setSubmitted(true);
  };

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Memuatkan...</div>;
  }

  if (error || !partner || !program) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                <Building2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pautan Tidak Sah</h2>
            <p className="text-slate-500 mb-6">{error || 'Sila pastikan anda menggunakan pautan yang betul.'}</p>
            <Link to="/" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Kembali ke Utama</Link>
        </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center border border-amber-100 dark:border-slate-800 relative z-10 animate-fade-in">
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow ring-8 ring-emerald-50/50 dark:ring-emerald-900/10">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Permohonan Berjaya!</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Terima kasih, <strong>{formData.fullName}</strong>. Permohonan anda untuk menyertai <strong className="text-amber-600 dark:text-amber-400">{program.name}</strong> di {partner.companyName} telah diterima.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl mb-8 border border-slate-100 dark:border-slate-800">
             <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Status Permohonan</p>
             <p className="font-bold text-emerald-500 uppercase tracking-widest text-sm">Sedang Diproses</p>
          </div>
          
          <div className="flex flex-col gap-3">
             <Link to="/" className="w-full bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 font-medium py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 transition-all shadow-lg shadow-slate-900/10 dark:shadow-amber-500/10">
               Kembali ke Utama
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors">
      
      {/* Left Panel - Specific Context */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
         {/* Premium Background Effects */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="relative z-10">
            <div className="space-y-8 mt-20">
              <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-2xl flex items-center justify-center">
                 <Crown size={40} className="text-amber-500" />
              </div>
              
              <div>
                <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Permohonan Keahlian</h3>
                <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white">
                  {program.name}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Disediakan oleh <span className="text-white font-bold">{partner.companyName}</span>
                </p>
              </div>

              {/* Benefits Summary */}
              <div className="space-y-4 pt-6">
                 <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">Manfaat Utama</p>
                 <ul className="space-y-3">
                    {program.benefits.slice(0, 4).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{benefit}</span>
                        </li>
                    ))}
                 </ul>
              </div>
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
               <div className="flex items-center gap-3 mb-2">
                  <Crown size={24} className="text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Permohonan Keahlian</span>
               </div>
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{program.name}</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{partner.companyName}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in-up">
               
               {/* Section 1 */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                     <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">1</div>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Maklumat Pemohon</h3>
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
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Email</label>
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
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Maklumat Hubungan</h3>
                  </div>

                  <div className="grid md:grid-cols-1 gap-6">
                      <div className="space-y-2 group">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">No. Telefon (WhatsApp)</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                           <input required type="tel" name="phone" onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-transparent rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium" placeholder="01X-XXXXXXX" />
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
                     Dengan menekan butang hantar, anda bersetuju dengan terma dan syarat {partner.companyName} serta polisi privasi SPKA.
                  </p>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};