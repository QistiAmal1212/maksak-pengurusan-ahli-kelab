import React from 'react';
import { Member } from '../types';

interface ECardProps {
  member: Member;
  clubName: string;
}

export const ECard: React.FC<ECardProps> = ({ member, clubName }) => {
  const qrData = encodeURIComponent(`https://spka-system.app/#/verify/${member.id}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  return (
    <div className="relative w-[340px] h-[210px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 text-white font-sans select-none transform transition-transform hover:scale-105 duration-300 border border-slate-700">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-20 blur-3xl rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-700 opacity-30 blur-2xl rounded-full -ml-10 -mb-10"></div>
      
      {/* Gold Strip */}
      <div className="absolute top-6 left-0 w-2 h-12 bg-amber-500 rounded-r-md shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>

      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-full p-0.5 shadow-lg border-2 border-amber-500 flex items-center justify-center">
                <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Logo" className="w-10 h-10 object-contain" />
             </div>
             <div>
                <h2 className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase">Ahli Berdaftar</h2>
                <h1 className="text-sm font-bold leading-tight w-40 text-white">{clubName}</h1>
             </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="flex justify-between items-end mt-2">
          <div className="space-y-3">
             <div>
               <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Nama Ahli</p>
               <p className="font-bold text-sm text-amber-50 truncate w-40">{member.fullName}</p>
             </div>
             
             <div className="flex gap-4">
               <div>
                 <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">No. ID</p>
                 <p className="font-mono text-xs text-amber-400 tracking-wide">{member.id.toUpperCase()}</p>
               </div>
               <div>
                 <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Tamat</p>
                 <p className="font-mono text-xs text-white">12/25</p>
               </div>
             </div>
          </div>

          {/* QR Code Area */}
          <div className="bg-white p-1.5 rounded-lg shadow-lg border-2 border-amber-500/50">
            <img src={qrUrl} alt="QR" className="w-16 h-16 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};