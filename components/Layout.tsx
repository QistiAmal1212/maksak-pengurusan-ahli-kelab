import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Role } from '../types';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
  onLogout: () => void;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, toggleTheme, isDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPublic = role === Role.PUBLIC;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300">
      {/* Mobile Header for Admin/Internal only */}
      {!isPublic && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 dark:bg-slate-950 text-white p-4 flex items-center justify-between z-30 shadow-md border-b border-slate-800">
           <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-1 text-slate-200 hover:text-white">
                 <Menu />
              </button>
              <img src="https://pub-93cfc1b750a247a2b9b1c3feb2df24f7.r2.dev/maksak.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-amber-500">SPKA PAHANG</span>
           </div>
           <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-slate-700">
              {role.charAt(0)}
           </div>
        </div>
      )}

      {/* Sidebar - Only for Internal Roles */}
      {!isPublic && (
        <Sidebar 
          currentRole={role} 
          onLogout={onLogout} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode} 
        />
      )}
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${!isPublic ? 'md:ml-64 mt-16 md:mt-0' : ''}`}>
        {/* Conditional container: Public gets full control, Internal gets padded dashboard layout */}
        <div className={`${!isPublic ? 'p-4 md:p-8 max-w-7xl mx-auto min-h-screen' : 'min-h-screen w-full'}`}>
            {children}
        </div>
      </main>
    </div>
  );
};