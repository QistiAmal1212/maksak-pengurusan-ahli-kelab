import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Store, 
  ScanLine,
  FileText,
  LogOut,
  UserPlus,
  Home,
  Sun,
  Moon,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentRole: Role;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

interface NavItem {
  to?: string;
  label: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, onLogout, isOpen, onClose, toggleTheme, isDarkMode }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Rakan Strategik']);

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const getLinks = (): NavItem[] => {
    switch (currentRole) {
      case Role.ADMIN:
        // Admin: Nested Rakan Strategik (URS03 & URS08)
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
          { to: '/members', label: 'Pengurusan Keahlian', icon: <Users size={20} /> },
          { 
            label: 'Rakan Strategik', 
            icon: <Building2 size={20} />,
            children: [
              { to: '/clubs', label: 'Kelab (Internal)', icon: <Users size={18} /> },
              { to: '/partners', label: 'Syarikat (External)', icon: <Store size={18} /> }
            ]
          },
          { to: '/reports', label: 'Laporan & Statistik', icon: <FileText size={20} /> },
        ];
      case Role.AJK:
        return [
          { to: '/dashboard', label: 'Dashboard Kelab', icon: <LayoutDashboard size={20} /> },
          { to: '/members', label: 'Ahli Kelab', icon: <Users size={20} /> },
          { to: '/reports', label: 'Laporan Kelab', icon: <FileText size={20} /> },
        ];
      case Role.PARTNER:
        return [
          { to: '/verify', label: 'Semakan Keahlian', icon: <ScanLine size={20} /> },
          { to: '/dashboard', label: 'Laporan Penggunaan', icon: <BarChart3 size={20} /> },
        ];
      default: // PUBLIC
        return [
          { to: '/', label: 'Utama', icon: <Home size={20} /> },
          { to: '/register', label: 'Daftar Ahli', icon: <UserPlus size={20} /> },
          { to: '/verify', label: 'Semak Status', icon: <ScanLine size={20} /> },
        ];
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isExpanded = expandedMenus.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;
    // Check if any child is active
    const isChildActive = hasChildren && item.children?.some(child => child.to === location.pathname);

    if (hasChildren) {
      return (
        <div key={item.label} className="space-y-1">
           <button 
             onClick={() => toggleMenu(item.label)}
             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isChildActive || isExpanded
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
             }`}
           >
              <div className="flex items-center space-x-3">
                 <span className={isChildActive ? 'text-amber-500' : 'group-hover:text-amber-500 transition-colors'}>
                   {item.icon}
                 </span>
                 <span className="font-medium">{item.label}</span>
              </div>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
           </button>
           
           {isExpanded && (
             <div className="pl-4 space-y-1 animate-fade-in">
               {item.children?.map(child => (
                 <NavLink
                   key={child.to}
                   to={child.to!}
                   onClick={onClose}
                   className={({ isActive }) =>
                     `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ml-4 border-l-2 ${
                       isActive 
                         ? 'border-amber-500 bg-slate-800/50 text-white' 
                         : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                     }`
                   }
                 >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? 'text-amber-500' : 'group-hover:text-amber-500 transition-colors'}>
                          {child.icon}
                        </span>
                        <span className="font-medium text-sm">{child.label}</span>
                      </>
                    )}
                 </NavLink>
               ))}
             </div>
           )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to!}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive 
              ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className={isActive ? 'text-slate-900' : 'group-hover:text-amber-500 transition-colors'}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-white flex flex-col z-50 transition-transform duration-300 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 ring-4 ring-amber-500 overflow-hidden shadow-lg shadow-amber-500/20">
             <img 
               src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" 
               alt="Logo" 
               className="w-14 h-14 object-contain"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=LOGO'; 
               }}
             />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
            SPKA <span className="text-amber-500">PAHANG</span>
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{currentRole}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          {getLinks().map(renderNavItem)}
        </nav>

        {/* Footer / Logout */}
        {currentRole !== Role.PUBLIC && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 dark:bg-slate-900/50 space-y-2">
            {toggleTheme && (
               <button 
                onClick={toggleTheme}
                className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-colors"
               >
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 <span className="font-medium">{isDarkMode ? 'Mod Terang' : 'Mod Gelap'}</span>
               </button>
            )}
            <button 
              onClick={onLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-slate-900 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Log Keluar</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};