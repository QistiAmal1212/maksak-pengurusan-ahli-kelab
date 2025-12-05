import React, { useEffect, useState } from 'react';
import { db } from '../services/mockData';
import { Member, MemberStatus, Club, Role } from '../types';
import { ECard } from '../components/ECard';
import { 
  Check, X, Eye, Download, Search, Filter, ShieldAlert,
  AlertCircle, AlertTriangle, CheckCircle2, Ban, Mail, Phone, Calendar, Home, User, Share2
} from 'lucide-react';
import html2canvas from 'html2canvas';

interface MemberManagementProps {
    role?: Role;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ role = Role.ADMIN }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null); // For eCard
  const [viewMember, setViewMember] = useState<Member | null>(null); // For Detail View
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
    type: 'danger' | 'success' | 'warning' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionLabel: '',
    onConfirm: () => {},
    type: 'primary'
  });

  // Simulation: If Role is AJK, assume they belong to 'c1' (Kelab Sukan JKR)
  const currentAJKClubId = db.ajkClubId; 

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    let allMembers = db.getMembers();
    
    // URS10: AJK Kelab only sees members of their own club
    if (role === Role.AJK) {
        allMembers = allMembers.filter(m => m.clubId === currentAJKClubId);
    }

    setMembers([...allMembers]); 
    setClubs(db.getClubs());
  };

  const handleStatusChange = (id: string, status: MemberStatus) => {
    let title = "Kemaskini Status";
    let message = "Adakah anda pasti?";
    let type: 'danger' | 'primary' | 'success' | 'warning' = 'primary';
    let actionLabel = "Ya, Teruskan";

    if (status === MemberStatus.ACTIVE) {
        title = "Luluskan Keahlian";
        message = "Adakah anda pasti mahu meluluskan dan mengaktifkan akaun ahli ini? Emel notifikasi akan dihantar.";
        type = 'success';
        actionLabel = "Luluskan & Aktifkan";
    } else if (status === MemberStatus.REJECTED) {
        title = "Tolak Permohonan";
        message = "Adakah anda pasti mahu menolak permohonan ini? Ahli perlu memohon semula.";
        type = 'danger';
        actionLabel = "Tolak Permohonan";
    }

    setConfirmModal({
        isOpen: true,
        title,
        message,
        actionLabel,
        type,
        onConfirm: () => {
            db.updateMemberStatus(id, status);
            refreshData();
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
    });
  };

  const getClubName = (id: string) => clubs.find(c => c.id === id)?.name || 'Unknown Club';

  const downloadECard = async () => {
    const element = document.getElementById('ecard-preview');
    if (element) {
      const canvas = await html2canvas(element, { backgroundColor: null, scale: 2 });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = data;
      link.download = `ecard-${selectedMember?.id}.png`;
      link.click();
    }
  };

  const shareECard = async (type: 'whatsapp' | 'email') => {
    const element = document.getElementById('ecard-preview');
    if (element && selectedMember) {
        try {
            // 1. Generate Image High Res
            const canvas = await html2canvas(element, { backgroundColor: null, scale: 3 });
            const imgData = canvas.toDataURL('image/png');
            
            // 2. Import jsPDF Dynamically
            const { jsPDF } = await import('jspdf');
            
            // 3. Create PDF (Card Size ratio is approx 1.6, standard ID-1 is 85.6mm x 53.98mm)
            // We use a slightly larger landscape format or match exact
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [90, 55] 
            });
            
            pdf.addImage(imgData, 'PNG', 2, 2, 86, 51); // Add with small margin
            pdf.save(`eCard-${selectedMember.id}.pdf`);

            // 4. Construct Message
            const message = `Salam ${selectedMember.fullName}, berikut adalah Kad Keahlian Digital SPKA anda (PDF).`;
            
            if (type === 'whatsapp') {
                const phone = selectedMember.phone.replace(/[^0-9]/g, '');
                // Basic validation for phone number
                const targetPhone = phone.startsWith('60') ? phone : phone.startsWith('0') ? '6' + phone : phone;
                
                const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
                alert('PDF kad telah dimuat turun. Sila lampirkan fail tersebut di WhatsApp.');
            } else {
                const subject = `Kad Keahlian Digital SPKA - ${selectedMember.id}`;
                const mailtoUrl = `mailto:${selectedMember.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
                window.open(mailtoUrl, '_blank');
                alert('PDF kad telah dimuat turun. Sila lampirkan fail tersebut di Email.');
            }
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Gagal menjana PDF. Sila cuba lagi.");
        }
    }
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.icNo.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengurusan Keahlian</h1>
            <p className="text-slate-500 dark:text-slate-400">
                {role === Role.AJK 
                    ? `Senarai ahli bagi ${getClubName(currentAJKClubId)}`
                    : 'Senarai keseluruhan ahli berdaftar (Admin View)'
                }
            </p>
        </div>
        <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Cari nama atau IC..." 
                className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {role === Role.AJK && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-400 text-sm">
             <ShieldAlert size={18} />
             <span>Anda log masuk sebagai <strong>AJK Kelab</strong>. Anda hanya dibenarkan menguruskan keahlian kelab anda sendiri.</span>
          </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                <th className="p-5">Nama / IC</th>
                <th className="p-5">Kelab</th>
                <th className="p-5">Tarikh Mohon</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Tindakan</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800 transition-colors group">
                    <td className="p-5">
                        <div className="font-bold text-slate-900 dark:text-white">{member.fullName}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-0.5">{member.icNo}</div>
                    </td>
                    <td className="p-5 text-slate-600 dark:text-slate-400 font-medium">{getClubName(member.clubId)}</td>
                    <td className="p-5 text-slate-500 dark:text-slate-400">{member.appliedDate}</td>
                    <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${member.status === MemberStatus.ACTIVE ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 
                        member.status === MemberStatus.PENDING ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                             ${member.status === MemberStatus.ACTIVE ? 'bg-emerald-500' : 
                               member.status === MemberStatus.PENDING ? 'bg-amber-500' :
                               'bg-red-500'}`}></span>
                        {member.status}
                    </span>
                    </td>
                    <td className="p-5">
                    <div className="flex justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                         {/* View Button - Always visible */}
                         <button 
                            onClick={() => setViewMember(member)} 
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors rounded-lg mr-1"
                            title="Lihat Maklumat"
                        >
                            <Eye size={16} />
                        </button>

                        {member.status === MemberStatus.PENDING && (
                        <>
                            <button onClick={() => handleStatusChange(member.id, MemberStatus.ACTIVE)} className="p-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 shadow-sm" title="Lulus">
                            <Check size={16} />
                            </button>
                            <button onClick={() => handleStatusChange(member.id, MemberStatus.REJECTED)} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Tolak">
                            <X size={16} />
                            </button>
                        </>
                        )}
                        {member.status === MemberStatus.ACTIVE && (
                        <button onClick={() => setSelectedMember(member)} className="p-2 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20" title="Lihat eKad">
                            <Download size={16} />
                        </button>
                        )}
                    </div>
                    </td>
                </tr>
                ))}
                {filteredMembers.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 dark:text-slate-500">Tiada rekod ditemui.</td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* VIEW MEMBER DETAILS MODAL */}
      {viewMember && (
          <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                     <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                             <User size={24} />
                         </div>
                         <div>
                             <h3 className="font-bold text-2xl text-slate-900 dark:text-white">{viewMember.fullName}</h3>
                             <p className="text-slate-500 text-sm font-mono">{viewMember.icNo}</p>
                         </div>
                     </div>
                     <button onClick={() => setViewMember(null)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"><X size={24}/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      {/* Status Banner */}
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                          viewMember.status === MemberStatus.ACTIVE ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' :
                          viewMember.status === MemberStatus.PENDING ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400' :
                          'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'
                      }`}>
                          {viewMember.status === MemberStatus.ACTIVE ? <CheckCircle2 size={24} /> : 
                           viewMember.status === MemberStatus.PENDING ? <AlertCircle size={24} /> : <Ban size={24} />}
                          <div>
                              <p className="font-bold text-sm uppercase tracking-wider">Status: {viewMember.status}</p>
                              {viewMember.status === MemberStatus.PENDING && <p className="text-xs mt-0.5 opacity-80">Permohonan sedang menunggu kelulusan.</p>}
                          </div>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Maklumat Peribadi</h4>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Umur</label>
                                      <p className="font-medium text-slate-900 dark:text-white">{viewMember.age || '-'} Tahun</p>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Email</label>
                                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                          <Mail size={16} className="text-slate-400" /> {viewMember.email}
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Telefon</label>
                                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                          <Phone size={16} className="text-slate-400" /> {viewMember.phone}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-6">
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Maklumat Keahlian</h4>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Kelab</label>
                                      <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-900 dark:text-white">{getClubName(viewMember.clubId)}</span>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Tarikh Mohon</label>
                                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                          <Calendar size={16} className="text-slate-400" /> {viewMember.appliedDate}
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Alamat</label>
                                      <div className="flex items-start gap-2 text-slate-900 dark:text-white">
                                          <Home size={16} className="text-slate-400 mt-1 shrink-0" /> 
                                          <span className="leading-relaxed">{viewMember.address}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button 
                          onClick={() => setViewMember(null)}
                          className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                          Tutup
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* eCard Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Digital Membership Card</h3>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            
            <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-300" id="ecard-preview">
              <ECard member={selectedMember} clubName={getClubName(selectedMember.clubId)} />
            </div>

            <div className="space-y-3">
                <p className="text-xs text-center text-slate-400 mb-2">Hantar kad keahlian kepada ahli:</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => shareECard('whatsapp')} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold text-sm shadow-lg shadow-green-500/20">
                        <Share2 size={18} /> WhatsApp (PDF)
                    </button>
                    <button onClick={() => shareECard('email')} className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-sm shadow-lg shadow-blue-500/20">
                        <Mail size={18} /> Email (PDF)
                    </button>
                </div>
                <button onClick={downloadECard} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
                  <Download size={18} /> Simpan sebagai PNG
               </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
               <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-100 transition-all">
                   <div className="flex flex-col items-center text-center space-y-4">
                       <div className={`p-4 rounded-full mb-2 ${
                           confirmModal.type === 'danger' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' :
                           confirmModal.type === 'success' ? 'bg-green-50 text-green-500 dark:bg-green-500/10' :
                           'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                       }`}>
                           {confirmModal.type === 'danger' ? <AlertCircle size={32} /> : 
                            confirmModal.type === 'success' ? <CheckCircle2 size={32} /> :
                            <AlertTriangle size={32} />}
                       </div>
                       
                       <div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{confirmModal.title}</h3>
                           <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{confirmModal.message}</p>
                       </div>

                       <div className="grid grid-cols-2 gap-3 w-full pt-4">
                           <button 
                               onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                               className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                           >
                               Batal
                           </button>
                           <button 
                               onClick={confirmModal.onConfirm}
                               className={`py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 ${
                                   confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' :
                                   confirmModal.type === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' :
                                   'bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90'
                               }`}
                           >
                               {confirmModal.actionLabel}
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};