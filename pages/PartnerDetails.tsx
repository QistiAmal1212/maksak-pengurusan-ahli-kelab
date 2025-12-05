



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/mockData';
import { BenefitPartner, Program } from '../types';
import { 
  ArrowLeft, MapPin, Tag, Crown, 
  CheckCircle2, Plus, Search, Trash2, Edit2, Save, 
  X, MinusCircle, FileText, Check, ChevronRight,
  Ban, RefreshCw, AlertCircle, AlertTriangle, Eye,
  User, Phone, Mail, Calendar, Home, Link as LinkIcon
} from 'lucide-react';

// Local Mock Interface for Members specific to a Partner Program
interface PartnerMember {
  id: string;
  name: string;
  ic: string;
  program: string; // Matches Program.name
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Rejected';
  // Extended details for "View Form"
  email: string;
  phone: string;
  address: string;
  age: number;
}

export const PartnerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<BenefitPartner | null>(null);
  
  // Local state for management features
  const [activeTab, setActiveTab] = useState<'programs' | 'members' | 'settings'>('programs');
  const [members, setMembers] = useState<PartnerMember[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  
  // Unified Program Modal State (Create & Edit)
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programForm, setProgramForm] = useState<Program>({ id: '', name: '', benefits: [], terms: [] });
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // null = creating mode
  const [tempBenefit, setTempBenefit] = useState('');
  const [tempTerm, setTempTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Member Modal
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', ic: '', program: '', email: '', phone: '', address: '', age: '' });
  
  // View Member Modal
  const [viewMember, setViewMember] = useState<PartnerMember | null>(null);

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
  
  // General State
  const [searchTerm, setSearchTerm] = useState('');
  const [editForm, setEditForm] = useState<Partial<BenefitPartner>>({});
  const [tempOffer, setTempOffer] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (id) {
      const found = db.getPartners().find(p => p.id === id);
      if (found) {
        setPartner(found);
        setPrograms(found.programs || []);
        setEditForm({ ...found }); // Clone to avoid direct mutation
        
        // Generate mock members with full details
        const mockMembers: PartnerMember[] = [
           { 
             id: 'pm1', name: 'Ahmad Albab', ic: '850101-10-5555', program: found.programs?.[0]?.name || 'General', joinDate: '2023-10-01', status: 'Active',
             email: 'ahmad@gmail.com', phone: '012-3456789', address: 'No 15, Jalan Beserah, 25300 Kuantan, Pahang', age: 39
           },
           { 
             id: 'pm2', name: 'Siti Nurhaliza', ic: '900101-14-1234', program: found.programs?.[0]?.name || 'General', joinDate: '2023-11-15', status: 'Active',
             email: 'siti@ctdk.com', phone: '019-8887777', address: 'Lot 5, Taman Melawati, Kuala Lumpur', age: 34
           },
           { 
             id: 'pm3', name: 'David Teoh', ic: '881212-05-9876', program: found.programs?.[1]?.name || 'General', joinDate: '2024-01-20', status: 'Inactive',
             email: 'david@metrowealth.com', phone: '016-1122334', address: 'A-10-2, Pavilion Suites, Bukit Bintang', age: 36
           },
           { 
             id: 'pm4', name: 'Mutusamy Pillai', ic: '910202-08-3333', program: found.programs?.[0]?.name || 'General', joinDate: '2024-02-10', status: 'Pending',
             email: 'mutu@yahoo.com', phone: '012-9988776', address: '77, Lorong India, Pekan, Pahang', age: 33
           },
           { 
             id: 'pm5', name: 'Chong Wei Lee', ic: '950505-10-4444', program: found.programs?.[0]?.name || 'General', joinDate: '2024-02-12', status: 'Pending',
             email: 'chongwl@gmail.com', phone: '011-22334455', address: '12, Jalan Badminton, Taman Sukan, 25200 Kuantan', age: 29
           },
        ];
        setMembers(mockMembers);
      } else {
        navigate('/partners');
      }
    }
  }, [id, navigate]);

  // --- Confirmation Helper ---
  const requestConfirmation = (
      title: string, 
      message: string, 
      actionLabel: string, 
      type: 'danger' | 'success' | 'warning' | 'primary',
      onConfirm: () => void
  ) => {
      setConfirmModal({
          isOpen: true,
          title,
          message,
          actionLabel,
          type,
          onConfirm: () => {
              onConfirm();
              setConfirmModal(prev => ({ ...prev, isOpen: false }));
          }
      });
  };

  // --- Program Modal Handlers ---

  const openCreateModal = () => {
      // Generate a new temporary ID for creation
      const newId = `prog-${Date.now()}`;
      setProgramForm({ id: newId, name: '', benefits: [], terms: [] });
      setEditingIndex(null);
      setTempBenefit('');
      setTempTerm('');
      setIsProgramModalOpen(true);
  };

  const openEditModal = (idx: number) => {
      const prog = programs[idx];
      // Deep clone to avoid mutating state directly before save
      setProgramForm({ 
          id: prog.id,
          name: prog.name, 
          benefits: [...prog.benefits], 
          terms: [...prog.terms] 
      });
      setEditingIndex(idx);
      setTempBenefit('');
      setTempTerm('');
      setIsProgramModalOpen(true);
  };

  const handleSaveProgram = () => {
      if (!programForm.name.trim()) return;

      const updatedPrograms = [...programs];
      if (editingIndex !== null) {
          updatedPrograms[editingIndex] = programForm;
      } else {
          updatedPrograms.push(programForm);
      }

      setPrograms(updatedPrograms);
      if (partner) partner.programs = updatedPrograms; // Persist to mock
      setIsProgramModalOpen(false);
  };

  const copyRegistrationLink = (programId: string) => {
    if (!partner) return;
    const link = `${window.location.origin}/#/register-program/${partner.id}/${programId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(programId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addBenefit = () => {
      if (tempBenefit.trim()) {
          setProgramForm(prev => ({ ...prev, benefits: [...prev.benefits, tempBenefit.trim()] }));
          setTempBenefit('');
      }
  };

  const removeBenefit = (idx: number) => {
      setProgramForm(prev => ({ 
          ...prev, 
          benefits: prev.benefits.filter((_, i) => i !== idx) 
      }));
  };

  const addTerm = () => {
      if (tempTerm.trim()) {
          setProgramForm(prev => ({ ...prev, terms: [...prev.terms, tempTerm.trim()] }));
          setTempTerm('');
      }
  };

  const removeTerm = (idx: number) => {
      setProgramForm(prev => ({ 
          ...prev, 
          terms: prev.terms.filter((_, i) => i !== idx) 
      }));
  };

  const handleDeleteProgram = (idx: number) => {
    requestConfirmation(
        "Padam Kelab",
        `Adakah anda pasti mahu memadam kelab "${programs[idx].name}"? Tindakan ini tidak boleh dikembalikan.`,
        "Padam Kelab",
        "danger",
        () => {
            const updatedPrograms = programs.filter((_, i) => i !== idx);
            setPrograms(updatedPrograms);
            if (partner) partner.programs = updatedPrograms;
        }
    );
  };

  // --- Member Handlers ---

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.program) {
       const newMem: PartnerMember = {
           id: `pm${Date.now()}`,
           name: newMember.name,
           ic: newMember.ic,
           program: newMember.program,
           email: newMember.email || 'user@example.com',
           phone: newMember.phone || '012-3456789',
           address: newMember.address || 'Alamat tidak dinyatakan',
           age: Number(newMember.age) || 30,
           joinDate: new Date().toISOString().split('T')[0],
           status: 'Active' // Admins adding members directly are usually active immediately
       };
       setMembers([newMem, ...members]);
       setNewMember({ name: '', ic: '', program: '', email: '', phone: '', address: '', age: '' });
       setIsAddMemberOpen(false);
    }
  };

  const handleUpdateStatus = (memberId: string, newStatus: PartnerMember['status']) => {
      let title = "Kemaskini Status";
      let message = "Adakah anda pasti?";
      let type: 'danger' | 'primary' | 'success' | 'warning' = 'primary';
      let actionLabel = "Ya, Teruskan";

      if (newStatus === 'Active') {
          title = "Luluskan Keahlian";
          message = "Adakah anda pasti mahu meluluskan dan mengaktifkan akaun ahli ini?";
          type = 'success';
          actionLabel = "Luluskan & Aktifkan";
      } else if (newStatus === 'Rejected') {
          title = "Tolak Permohonan";
          message = "Adakah anda pasti mahu menolak permohonan ini? Ahli perlu memohon semula.";
          type = 'danger';
          actionLabel = "Tolak Permohonan";
      } else if (newStatus === 'Inactive') {
          title = "Nyahaktifkan Ahli";
          message = "Ahli ini tidak akan dapat mengakses sebarang manfaat lagi. Teruskan?";
          type = 'danger';
          actionLabel = "Nyahaktifkan";
      }

      requestConfirmation(title, message, actionLabel, type, () => {
          setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: newStatus } : m));
      });
  };

  // --- Settings Handlers ---

  const handleAddOffer = () => {
      if (tempOffer.trim()) {
          setEditForm(prev => ({ ...prev, offers: [...(prev.offers || []), tempOffer.trim()] }));
          setTempOffer('');
          setIsDirty(true);
      }
  };

  const handleRemoveOffer = (index: number) => {
      setEditForm(prev => ({ ...prev, offers: prev.offers?.filter((_, i) => i !== index) }));
      setIsDirty(true);
  };

  const handleSaveSettings = () => {
     if (partner && editForm) {
        Object.assign(partner, editForm);
        setPartner({...partner}); // Force re-render
        setIsDirty(false);
        alert('Maklumat syarikat berjaya dikemaskini.');
     }
  };

  if (!partner) return null;

  const filteredMembers = members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.ic.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-6xl mx-auto">
       {/* Minimal Header */}
       <div>
          <button onClick={() => navigate('/partners')} className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors font-medium">
             <ArrowLeft size={16} /> Kembali ke Senarai
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {partner.companyName}
                    </h1>
                    {partner.offers.length > 0 && (
                        <div className="flex gap-1">
                            {partner.offers.slice(0, 3).map((offer, i) => (
                                <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 rounded text-[10px] font-bold uppercase tracking-wide">
                                    {offer}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16}/> {partner.location}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span>{programs.length} Kelab</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                    <span>{members.length} Ahli</span>
                </div>
             </div>
          </div>
       </div>

       {/* Clean Tabs */}
       <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8">
          {['programs', 'members', 'settings'].map((tab) => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-1 text-sm font-bold transition-all relative capitalize ${
                    activeTab === tab 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
            >
                {tab === 'programs' && 'Pengurusan Kelab'}
                {tab === 'members' && 'Senarai Ahli'}
                {tab === 'settings' && 'Tetapan'}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 dark:bg-amber-500"></span>}
            </button>
          ))}
       </div>

       {/* TAB CONTENT: PROGRAMS */}
       {activeTab === 'programs' && (
          <div className="animate-fade-in space-y-8">
             <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pakej & Kelab</h2>
                 <button 
                   onClick={openCreateModal}
                   className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-slate-900/10"
                >
                   <Plus size={16} className="group-hover:scale-110 transition-transform"/> Tambah Kelab
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.length > 0 ? programs.map((prog, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative">
                      
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{prog.name}</h3>
                            <p className="text-sm text-slate-400 font-medium">{members.filter(m => m.program === prog.name).length} Ahli Berdaftar</p>
                         </div>
                         
                         <div className="flex gap-1 absolute top-4 right-4 bg-white dark:bg-slate-900 p-1 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 z-10">
                             <button 
                                onClick={() => copyRegistrationLink(prog.id)} 
                                className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 relative" 
                                title="Salin Pautan Pendaftaran"
                             >
                                <LinkIcon size={14} />
                                {copiedId === prog.id && (
                                    <span className="absolute -top-8 -right-4 bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow animate-fade-in whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                             </button>
                             <button onClick={() => openEditModal(idx)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" title="Edit">
                                <Edit2 size={14} />
                             </button>
                             <button onClick={() => handleDeleteProgram(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-slate-800" title="Delete">
                                <Trash2 size={14} />
                             </button>
                         </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                         <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                             <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-500 shrink-0">
                                 <CheckCircle2 size={14} />
                             </div>
                             <span>{prog.benefits.length} Manfaat Tersedia</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                             <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0">
                                 <FileText size={14} />
                             </div>
                             <span>{prog.terms.length} Terma & Syarat</span>
                         </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors" onClick={() => { setSearchTerm(prog.name); setActiveTab('members'); }}>
                          Lihat Senarai Ahli <ChevronRight size={14} />
                      </div>
                   </div>
                )) : (
                   <div className="col-span-full py-16 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                          <Crown size={32} />
                      </div>
                      <p className="text-slate-500 font-medium mb-1">Belum ada kelab didaftarkan.</p>
                      <p className="text-xs text-slate-400 mb-4">Cipta kelab atau pakej pertama untuk syarikat ini.</p>
                      <button onClick={openCreateModal} className="text-slate-900 dark:text-white text-sm font-bold hover:underline">Tambah Kelab Sekarang</button>
                   </div>
                )}
             </div>
          </div>
       )}

       {/* TAB CONTENT: MEMBERS */}
       {activeTab === 'members' && (
          <div className="animate-fade-in space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rekod Keahlian</h2>
                <div className="flex gap-3 w-full md:w-auto">
                   <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input 
                         type="text" 
                         placeholder="Cari ahli..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm w-full md:w-64 outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all shadow-sm" 
                      />
                   </div>
                   <button 
                      onClick={() => setIsAddMemberOpen(true)}
                      className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shrink-0"
                   >
                      <Plus size={16} /> Ahli Baru
                   </button>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold uppercase text-xs border-b border-slate-200 dark:border-slate-800">
                      <tr>
                         <th className="p-5 pl-6">Nama / No. KP</th>
                         <th className="p-5">Program</th>
                         <th className="p-5">Tarikh</th>
                         <th className="p-5">Status</th>
                         <th className="p-5 text-right pr-6">Tindakan</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-5 dark:divide-slate-800">
                      {filteredMembers.length > 0 ? filteredMembers.map((mem) => (
                         <tr key={mem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="p-5 pl-6">
                               <div className="font-bold text-slate-900 dark:text-white">{mem.name}</div>
                               <div className="text-xs text-slate-400 font-mono mt-0.5">{mem.ic}</div>
                            </td>
                            <td className="p-5">
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                                  {mem.program}
                               </span>
                            </td>
                            <td className="p-5 text-slate-500">{mem.joinDate}</td>
                            <td className="p-5">
                               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                  ${mem.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                                    mem.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                                    'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full 
                                     ${mem.status === 'Active' ? 'bg-emerald-500' : 
                                       mem.status === 'Pending' ? 'bg-amber-500' :
                                       'bg-red-500'}`}></span>
                                  {mem.status}
                               </span>
                            </td>
                            <td className="p-5 text-right pr-6">
                               <div className="flex justify-end gap-1 opacity-80 hover:opacity-100 transition-opacity">
                                  {/* View Button - Always visible */}
                                  <button 
                                     onClick={() => setViewMember(mem)}
                                     className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors rounded-lg mr-1"
                                     title="Lihat Maklumat"
                                  >
                                     <Eye size={16} />
                                  </button>

                                  {/* Pending Actions */}
                                  {mem.status === 'Pending' && (
                                     <>
                                        <button 
                                           onClick={() => handleUpdateStatus(mem.id, 'Active')}
                                           className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                           title="Luluskan"
                                        >
                                           <Check size={16} />
                                        </button>
                                        <button 
                                           onClick={() => handleUpdateStatus(mem.id, 'Rejected')}
                                           className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                           title="Tolak"
                                        >
                                           <X size={16} />
                                        </button>
                                     </>
                                  )}
                                  
                                  {/* Active Actions */}
                                  {mem.status === 'Active' && (
                                     <button 
                                        onClick={() => handleUpdateStatus(mem.id, 'Inactive')}
                                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors rounded-lg"
                                        title="Nyahaktifkan"
                                     >
                                        <Ban size={16} />
                                     </button>
                                  )}

                                  {/* Inactive/Rejected Actions */}
                                  {(mem.status === 'Inactive' || mem.status === 'Rejected') && (
                                     <button 
                                        onClick={() => handleUpdateStatus(mem.id, 'Active')}
                                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors rounded-lg"
                                        title="Aktifkan Semula"
                                     >
                                        <RefreshCw size={16} />
                                     </button>
                                  )}
                               </div>
                            </td>
                         </tr>
                      )) : (
                         <tr>
                            <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                               Tiada rekod ahli ditemui.
                            </td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
       )}

       {/* TAB CONTENT: SETTINGS */}
       {activeTab === 'settings' && (
          <div className="animate-fade-in max-w-2xl">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tetapan Syarikat</h2>
                    {isDirty && <span className="text-xs text-amber-500 font-bold animate-pulse">Perubahan belum disimpan</span>}
                 </div>

                 <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama Syarikat</label>
                            <input 
                                type="text" 
                                value={editForm.companyName} 
                                onChange={(e) => { setEditForm({...editForm, companyName: e.target.value}); setIsDirty(true); }}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none font-bold text-slate-900 dark:text-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Lokasi</label>
                            <input 
                                type="text" 
                                value={editForm.location} 
                                onChange={(e) => { setEditForm({...editForm, location: e.target.value}); setIsDirty(true); }}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none font-medium text-slate-900 dark:text-white transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Deskripsi</label>
                       <textarea 
                          rows={3}
                          value={editForm.description} 
                          onChange={(e) => { setEditForm({...editForm, description: e.target.value}); setIsDirty(true); }}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white resize-none transition-all"
                       />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                       <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tag Tawaran (Offers)</label>
                       <div className="flex gap-2">
                           <input 
                              type="text" 
                              value={tempOffer}
                              onChange={(e) => setTempOffer(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddOffer()}
                              placeholder="Tambah tag baru..."
                              className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none font-medium text-slate-900 dark:text-white text-sm"
                           />
                           <button onClick={handleAddOffer} className="p-3 bg-slate-900 dark:bg-white hover:opacity-90 rounded-xl text-white dark:text-slate-900 transition-colors shadow-lg">
                              <Plus size={20} />
                           </button>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {editForm.offers?.map((offer, idx) => (
                             <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{offer}</span>
                                <button onClick={() => handleRemoveOffer(idx)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                       onClick={handleSaveSettings}
                       disabled={!isDirty}
                       className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10"
                    >
                       <Save size={18} /> Simpan
                    </button>
                 </div>
              </div>
          </div>
       )}

       {/* UNIFIED ADD/EDIT PROGRAM MODAL */}
       {isProgramModalOpen && (
          <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                
                {/* Clean Modal Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                   <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                          {editingIndex !== null ? 'Kemaskini Program' : 'Pendaftaran Baru'}
                      </span>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {editingIndex !== null ? 'Urus Kelab' : 'Tambah Kelab'}
                      </h2>
                   </div>
                   <button 
                      onClick={() => setIsProgramModalOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                   >
                      <X size={24} />
                   </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                   
                   {/* Name Input - Large */}
                   <div className="space-y-3">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama Kelab / Pakej</label>
                      <input 
                         className="w-full text-2xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-300"
                         placeholder="Contoh: Platinum Rewards"
                         value={programForm.name}
                         onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
                         autoFocus
                      />
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                      {/* Left: Benefits */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                              <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600 dark:text-green-500">
                                  <CheckCircle2 size={20} />
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Senarai Manfaat</h3>
                          </div>
                          
                          <div className="flex gap-3">
                              <input 
                                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:text-white shadow-sm"
                                  placeholder="Tambah manfaat..."
                                  value={tempBenefit}
                                  onChange={(e) => setTempBenefit(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && addBenefit()}
                              />
                              <button 
                                  onClick={addBenefit}
                                  disabled={!tempBenefit.trim()}
                                  className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 transition-all"
                              >
                                  <Plus size={20} />
                              </button>
                          </div>

                          <div className="space-y-3">
                             {programForm.benefits.map((benefit, idx) => (
                                 <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors group">
                                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{benefit}</span>
                                     <button 
                                       onClick={() => removeBenefit(idx)}
                                       className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                     >
                                         <MinusCircle size={18} />
                                     </button>
                                 </div>
                             ))}
                             {programForm.benefits.length === 0 && (
                                 <div className="py-8 text-center">
                                     <p className="text-sm text-slate-400">Tiada manfaat ditambah.</p>
                                 </div>
                             )}
                          </div>
                      </div>

                      {/* Right: Terms */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
                                  <FileText size={20} />
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Terma & Syarat</h3>
                          </div>
                          
                          <div className="flex gap-3">
                              <input 
                                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white shadow-sm"
                                  placeholder="Tambah syarat..."
                                  value={tempTerm}
                                  onChange={(e) => setTempTerm(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && addTerm()}
                              />
                              <button 
                                  onClick={addTerm}
                                  disabled={!tempTerm.trim()}
                                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 transition-all"
                              >
                                  <Plus size={20} />
                              </button>
                          </div>

                          <div className="space-y-3">
                             {programForm.terms.map((term, idx) => (
                                 <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors group">
                                     <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{term}</span>
                                     <button 
                                       onClick={() => removeTerm(idx)}
                                       className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                     >
                                         <MinusCircle size={18} />
                                     </button>
                                 </div>
                             ))}
                             {programForm.terms.length === 0 && (
                                 <div className="py-8 text-center">
                                     <p className="text-sm text-slate-400">Tiada syarat ditetapkan.</p>
                                 </div>
                             )}
                          </div>
                      </div>
                   </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-4 shrink-0">
                    <button 
                        onClick={() => setIsProgramModalOpen(false)}
                        className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSaveProgram}
                        disabled={!programForm.name.trim()}
                        className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Check size={18} /> {editingIndex !== null ? 'Simpan Perubahan' : 'Cipta Kelab'}
                    </button>
                </div>
             </div>
          </div>
       )}

       {/* ADD MEMBER MODAL */}
       {isAddMemberOpen && (
          <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
             <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                   <div>
                       <h3 className="font-bold text-2xl text-slate-900 dark:text-white">Daftar Ahli</h3>
                       <p className="text-slate-400 text-sm font-medium">Tambah ahli baru ke dalam sistem.</p>
                   </div>
                   <button onClick={() => setIsAddMemberOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 transition-colors"><X className="text-slate-400" size={20}/></button>
                </div>
                <form onSubmit={handleAddMember} className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nama Penuh</label>
                      <input 
                         required
                         className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all"
                         placeholder="Nama Ahli"
                         value={newMember.name}
                         onChange={e => setNewMember({...newMember, name: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">No. KP</label>
                          <input 
                             required
                             className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all"
                             placeholder="000000-00-0000"
                             value={newMember.ic}
                             onChange={e => setNewMember({...newMember, ic: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Umur</label>
                          <input 
                             type="number"
                             className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all"
                             placeholder="30"
                             value={newMember.age}
                             onChange={e => setNewMember({...newMember, age: e.target.value})}
                          />
                       </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email</label>
                      <input 
                         type="email"
                         className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all"
                         placeholder="user@example.com"
                         value={newMember.email}
                         onChange={e => setNewMember({...newMember, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Telefon</label>
                      <input 
                         type="tel"
                         className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all"
                         placeholder="012-3456789"
                         value={newMember.phone}
                         onChange={e => setNewMember({...newMember, phone: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Alamat</label>
                      <textarea 
                         rows={2}
                         className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold placeholder:font-normal transition-all resize-none"
                         placeholder="Alamat lengkap..."
                         value={newMember.address}
                         onChange={e => setNewMember({...newMember, address: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Kelab / Program</label>
                      <div className="relative">
                        <select 
                            required
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none text-slate-900 dark:text-white font-bold appearance-none cursor-pointer transition-all"
                            value={newMember.program}
                            onChange={e => setNewMember({...newMember, program: e.target.value})}
                        >
                            <option value="">Sila Pilih Program</option>
                            {programs.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-4 pointer-events-none text-slate-400"><ChevronRight className="rotate-90" /></div>
                      </div>
                   </div>
                   
                   <div className="pt-4">
                       <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-xl transition-all text-lg">
                          Simpan Ahli
                       </button>
                   </div>
                </form>
             </div>
          </div>
       )}

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
                             <h3 className="font-bold text-2xl text-slate-900 dark:text-white">{viewMember.name}</h3>
                             <p className="text-slate-500 text-sm font-mono">{viewMember.ic}</p>
                         </div>
                     </div>
                     <button onClick={() => setViewMember(null)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"><X size={24}/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      {/* Status Banner */}
                      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                          viewMember.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' :
                          viewMember.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400' :
                          'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'
                      }`}>
                          {viewMember.status === 'Active' ? <CheckCircle2 size={24} /> : 
                           viewMember.status === 'Pending' ? <AlertCircle size={24} /> : <Ban size={24} />}
                          <div>
                              <p className="font-bold text-sm uppercase tracking-wider">Status Permohonan: {viewMember.status}</p>
                              {viewMember.status === 'Pending' && <p className="text-xs mt-0.5 opacity-80">Permohonan sedang menunggu kelulusan admin.</p>}
                              {viewMember.status === 'Active' && <p className="text-xs mt-0.5 opacity-80">Ahli berdaftar dan layak menerima manfaat.</p>}
                          </div>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Maklumat Peribadi</h4>
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Umur</label>
                                      <p className="font-medium text-slate-900 dark:text-white">{viewMember.age} Tahun</p>
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
                                      <label className="text-xs text-slate-500 block mb-1">Program / Pakej</label>
                                      <div className="flex items-center gap-2">
                                          <Crown size={16} className="text-amber-500" />
                                          <span className="font-bold text-slate-900 dark:text-white">{viewMember.program}</span>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 block mb-1">Tarikh Daftar</label>
                                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                          <Calendar size={16} className="text-slate-400" /> {viewMember.joinDate}
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