import React, { useEffect, useState } from 'react';
import { db } from '../services/mockData';
import { generateExecutiveSummary } from '../services/geminiService';
import { DashboardStats, Role, Club, Member } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, Loader2, Users, Building, Activity, AlertCircle, TrendingUp, Clock, MapPin } from 'lucide-react';

interface DashboardProps {
  role: Role;
}

export const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setStats(db.getDashboardStats());
    setClubs(db.getClubs());
    setMembers(db.getMembers());
  }, []);

  const handleAiAnalysis = async () => {
    if (!stats) return;
    setLoadingAi(true);
    const insight = await generateExecutiveSummary(stats, clubs, members);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  if (!stats) return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400 animate-pulse">
          <Loader2 className="animate-spin mr-2" /> Memuatkan data sistem...
      </div>
  );

  const statusData = [
    { name: 'Aktif', value: stats.activeMembers },
    { name: 'Pending', value: stats.pendingMembers },
  ];
  const COLORS = ['#f59e0b', '#1e293b']; // Gold & Slate-800

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Sistem Dashboard</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Selamat datang, <span className="text-amber-600 dark:text-amber-500 font-semibold">{role}</span>.</p>
        </div>
        {role === Role.ADMIN && (
          <button 
            onClick={handleAiAnalysis}
            disabled={loadingAi}
            className="group flex items-center gap-2 bg-slate-900 dark:bg-amber-500 text-amber-500 dark:text-slate-900 border border-slate-900 dark:border-amber-500 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-400 transition-all shadow-lg shadow-slate-900/20 dark:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAi ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="group-hover:animate-pulse" />}
            {loadingAi ? 'Menganalisa...' : 'Analisis AI'}
          </button>
        )}
      </div>

      {aiInsight && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-slow"></div>
          <div className="relative z-10 flex gap-4">
             <div className="p-3 bg-white/10 rounded-xl h-fit backdrop-blur-sm border border-white/5"><Sparkles className="text-amber-400" /></div>
             <div>
                <h3 className="font-bold text-lg text-amber-400 mb-2">Laporan Eksekutif AI</h3>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">{aiInsight}</div>
             </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Jumlah Ahli', value: stats.totalMembers, icon: <Users />, color: 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white', delay: '0ms' },
          { label: 'Ahli Aktif', value: stats.activeMembers, icon: <Activity />, color: 'bg-amber-500 text-slate-900 dark:bg-amber-500 dark:text-slate-950', delay: '100ms' },
          { label: 'Menunggu', value: stats.pendingMembers, icon: <AlertCircle />, color: 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800', delay: '200ms' },
          { label: 'Jumlah Kelab', value: stats.totalClubs, icon: <Building />, color: 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800', delay: '300ms' },
        ].map((stat, idx) => (
           <div 
             key={idx} 
             className={`p-6 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${stat.color} ${stat.label === 'Menunggu' || stat.label === 'Jumlah Kelab' ? 'shadow-sm dark:shadow-none' : 'shadow-xl shadow-slate-900/10 dark:shadow-none'}`}
             style={{ animationDelay: stat.delay }}
           >
              <div className={`p-3 rounded-xl ${stat.label === 'Ahli Aktif' ? 'bg-white/20' : stat.label === 'Jumlah Ahli' ? 'bg-slate-800 dark:bg-slate-950' : 'bg-slate-100 dark:bg-slate-800'}`}>
                 {stat.icon}
              </div>
              <div>
                 <p className={`text-sm font-medium ${stat.label.includes('Ahli') ? 'opacity-80' : 'text-slate-400 dark:text-slate-500'}`}>{stat.label}</p>
                 <p className="text-2xl font-bold">{stat.value}</p>
              </div>
           </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-1 animate-fade-in-up [animation-delay:400ms]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 dark:text-white">Status Keahlian</h3>
             <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <TrendingUp size={18} className="text-slate-400" />
             </div>
          </div>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} 
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <span className="block text-3xl font-bold text-slate-900 dark:text-white">{stats.totalMembers}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Total</span>
               </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span> Aktif
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 bg-slate-900 dark:bg-slate-700 rounded-full"></span> Pending
              </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 animate-fade-in-up [animation-delay:500ms]">
          <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Log Penggunaan Terkini</h3>
              <button className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline">LIHAT SEMUA</button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                        <th className="p-4">Lokasi</th>
                        <th className="p-4">Tarikh & Masa</th>
                        <th className="p-4">Jenis Manfaat</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {stats.recentLogs.length > 0 ? stats.recentLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors">
                                    <MapPin size={16} />
                                </div>
                                {log.location}
                            </td>
                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} />
                                    {new Date(log.timestamp).toLocaleDateString()} 
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                                {log.benefitType}
                              </span>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-400 italic">Tiada rekod aktiviti terkini.</td></tr>
                    )}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};