import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Star, Activity, ArrowRight, Smartphone, Building, Users, Zap, 
  Menu, Bell, QrCode, Search, Home as HomeIcon, CreditCard, CheckCircle2, Sun, Moon 
} from 'lucide-react';

interface HomeProps {
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

export const Home: React.FC<HomeProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative font-sans text-slate-900 dark:text-white selection:bg-amber-500/30 overflow-hidden transition-colors duration-500">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-200/20 dark:bg-amber-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-100/50 dark:bg-slate-800/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full p-6 md:px-12 z-50 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-4">
           <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Pahang" className="h-12 md:h-14 w-auto drop-shadow-lg" />
           <div className="hidden md:block">
              <h1 className="font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white">SPKA <span className="text-amber-600 dark:text-amber-500">PAHANG</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mt-1">Portal Keahlian Rasmi</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
            {toggleTheme && (
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 md:px-12 min-h-screen flex flex-col lg:flex-row items-center justify-between relative z-10 pt-32 pb-40 lg:py-0 gap-16 lg:gap-0">
         
         {/* Left Text Content */}
         <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 animate-fade-in-up w-fit mx-auto lg:mx-0">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
               </span>
               <span>Sistem Baharu 2.0</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight animate-fade-in-up [animation-delay:200ms]">
               Keahlian Eksklusif <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-300 dark:via-amber-500 dark:to-amber-600">
                 Warga Pahang.
               </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up [animation-delay:400ms]">
               Transformasi digital pengurusan keahlian. Nikmati akses fasiliti, diskaun rakan strategik, dan kemudahan dalam satu aplikasi bersepadu.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up [animation-delay:600ms]">
               <Link to="/register" className="w-full sm:w-auto relative group px-8 py-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 rounded-full font-bold text-lg hover:bg-slate-800 dark:hover:bg-amber-400 transition-all shadow-xl shadow-slate-900/20 dark:shadow-amber-500/20 flex items-center justify-center gap-2 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Daftar Sekarang <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
               </Link>
               
               <Link to="/verify" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800 backdrop-blur rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2">
                  <Search size={20} className="text-amber-500" />
                  Semak
               </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 opacity-80 animate-fade-in-up [animation-delay:800ms] mb-12 md:mb-0">
                <div className="text-left">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12+</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Kelab Berdaftar</p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="text-left">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">50+</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Rakan Strategik</p>
                </div>
            </div>
         </div>

         {/* Right Illustration (Mockup) */}
         <div className="flex-1 w-full max-w-[500px] h-[600px] relative hidden lg:flex items-center justify-center animate-fade-in-up [animation-delay:600ms]">
             
             {/* Floating Elements - Orbiting */}
             <div className="absolute top-20 -left-12 z-30 animate-float [animation-delay:1s]">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Status</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Keahlian Aktif</p>
                    </div>
                </div>
             </div>

             <div className="absolute bottom-32 -right-8 z-30 animate-float [animation-delay:2s]">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Manfaat</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Diskaun Hotel</p>
                    </div>
                </div>
             </div>

             {/* Phone Mockup */}
             <div className="relative w-[300px] h-[580px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl animate-float overflow-hidden z-20 ring-1 ring-slate-700/50">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-950 rounded-b-xl z-30"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 relative flex flex-col">
                    
                    {/* App Header */}
                    <div className="bg-slate-900 text-white p-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-lg relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <Menu size={20} className="text-slate-400" />
                            <span className="font-bold tracking-widest text-xs uppercase text-amber-500">SPKA Mobile</span>
                            <Bell size={20} className="text-slate-400" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-amber-500 p-0.5">
                                <img src="https://picsum.photos/100" className="w-full h-full rounded-full object-cover" alt="User" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Selamat Kembali,</p>
                                <p className="font-bold text-lg leading-none">Ali Bin Abu</p>
                            </div>
                        </div>
                    </div>

                    {/* App Body */}
                    <div className="flex-1 p-5 space-y-4 overflow-hidden relative">
                        {/* E-Card Mini */}
                        <div className="bg-gradient-to-br from-slate-800 to-black text-white p-5 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="flex justify-between items-start mb-8">
                                <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" className="w-8 h-8 opacity-80" alt="Logo"/>
                                <QrCode className="text-white opacity-80" size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-amber-500 uppercase tracking-widest mb-1">Ahli Berdaftar</p>
                                <p className="font-bold text-lg tracking-wide">ALI BIN ABU</p>
                                <p className="text-[10px] font-mono text-slate-400 mt-1">850101-10-5555</p>
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-4 gap-3 py-2">
                             {[
                                {icon: <CreditCard size={18}/>, label: 'eKad'},
                                {icon: <Search size={18}/>, label: 'Semak'},
                                {icon: <Building size={18}/>, label: 'Kelab'},
                                {icon: <Users size={18}/>, label: 'Profil'},
                             ].map((item, i) => (
                                 <div key={i} className="flex flex-col items-center gap-2">
                                     <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-300">
                                         {item.icon}
                                     </div>
                                     <span className="text-[10px] font-medium text-slate-500">{item.label}</span>
                                 </div>
                             ))}
                        </div>

                        {/* Recent Activity List */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terkini</p>
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                        <Activity size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">Diskaun Hotel Seri Malaysia</p>
                                        <p className="text-[10px] text-slate-400">2 minit yang lalu</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Bottom Nav Mockup */}
                    <div className="h-16 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-around items-center px-6">
                        <HomeIcon size={24} className="text-amber-500" />
                        <Search size={24} className="text-slate-300 dark:text-slate-600" />
                        <Users size={24} className="text-slate-300 dark:text-slate-600" />
                    </div>

                </div>
             </div>
         </div>
      </div>

      {/* Bento Grid Features - Positioned Below */}
      <div className="container mx-auto px-6 md:px-12 pb-24 pt-32 md:pt-48 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:800ms]">
                {/* Card 1 */}
                <div className="md:col-span-2 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-left relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-colors"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                        <Smartphone size={32} className="text-slate-900 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Kad Keahlian Digital</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Akses e-Kad anda bila-bila masa melalui telefon pintar. Imbas QR untuk pengesahan segera di mana-mana premis berdaftar.</p>
                      </div>
                   </div>
                </div>

                {/* Card 2 */}
                <div className="p-8 rounded-3xl bg-slate-900 dark:bg-amber-500 border border-slate-800 dark:border-amber-400 text-white dark:text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 group text-left relative overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-5 -mb-5"></div>
                   <div className="relative z-10">
                      <Users size={32} className="mb-4 text-amber-400 dark:text-slate-900" />
                      <h3 className="font-bold text-xl mb-2">Komuniti Aktif</h3>
                      <p className="text-slate-400 dark:text-slate-800 text-sm leading-relaxed">Sertai rangkaian sosial dan sukan yang menghubungkan ribuan penjawat awam.</p>
                   </div>
                </div>

                 {/* Card 3 */}
                 <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group text-left">
                   <div className="p-3 w-fit bg-amber-50 dark:bg-amber-500/10 rounded-xl mb-4 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                      <Building size={24} className="text-amber-600 dark:text-amber-400" />
                   </div>
                   <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Fasiliti Kelab</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Tempahan mudah untuk dewan, gimnasium, dan kemudahan sukan di seluruh daerah.</p>
                </div>

                {/* Card 4 */}
                <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border border-amber-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group text-left relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 dark:opacity-5"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Activity size={20} className="text-green-500" />
                           <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Rakan Strategik</span>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Diskaun & Rebat Eksklusif</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md leading-relaxed">Nikmati potongan harga istimewa di hotel, restoran, dan kedai sukan terpilih yang berdaftar dengan SPKA Pahang.</p>
                      </div>
                      <div className="flex -space-x-4">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-600 shadow-sm overflow-hidden">
                              <img src={`https://picsum.photos/seed/${i+10}/100`} className="w-full h-full object-cover" alt="Partner"/>
                           </div>
                         ))}
                         <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-700 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">+50</div>
                      </div>
                   </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-20 pb-10 text-center text-slate-400 dark:text-slate-600 text-xs animate-fade-in-up [animation-delay:1000ms]">
               &copy; 2024 Majlis Kebajikan dan Sukan Anggota-Anggota Kerajaan (MAKSAK) Pahang. Hak Cipta Terpelihara.
            </div>
      </div>
    </div>
  );
}