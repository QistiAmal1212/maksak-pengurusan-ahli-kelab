

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Registration } from './pages/Registration';
import { MemberManagement } from './pages/MemberManagement';
import { PartnerManagement } from './pages/PartnerManagement';
import { PartnerDetails } from './pages/PartnerDetails';
import { ClubManagement } from './pages/ClubManagement';
import { Verification } from './pages/Verification';
import { ClubRegistration } from './pages/ClubRegistration';
import { Home } from './pages/Home';
import { Role } from './types';
import { Sun, Moon, Laptop } from 'lucide-react';

function App() {
  const [currentRole, setCurrentRole] = useState<Role>(Role.PUBLIC);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Theme
  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper to switch roles and theme
  const DevTools = () => (
    <div className="fixed top-0 right-0 p-2 z-[100] flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
      {/* Role Switcher */}
      <div className="bg-black/80 backdrop-blur shadow-sm border border-white/10 p-1 rounded-md flex items-center gap-2">
        <span className="text-[10px] font-bold text-white uppercase px-1">Role:</span>
        <select 
          value={currentRole} 
          onChange={(e) => setCurrentRole(e.target.value as Role)}
          className="text-[10px] bg-white/10 border-none rounded px-1 py-0.5 outline-none cursor-pointer font-medium text-white hover:bg-white/20 transition-colors"
        >
          <option value={Role.PUBLIC}>Public</option>
          <option value={Role.AJK}>AJK Kelab</option>
          <option value={Role.ADMIN}>Admin</option>
          <option value={Role.PARTNER}>Partner</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <HashRouter>
        <DevTools />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            currentRole === Role.PUBLIC
            ? <Layout role={Role.PUBLIC} onLogout={() => {}}><Home toggleTheme={toggleTheme} isDarkMode={isDarkMode} /></Layout>
            : <Navigate to="/dashboard" replace />
          } />

          <Route path="/register" element={
            currentRole === Role.PUBLIC 
              ? <Layout role={Role.PUBLIC} onLogout={() => {}}><Registration /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

          <Route path="/register/:clubId" element={
            currentRole === Role.PUBLIC 
              ? <Layout role={Role.PUBLIC} onLogout={() => {}}><Registration /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

          {/* New Route for specific Program Registration */}
          <Route path="/register-program/:partnerId/:programId" element={
            <Layout role={Role.PUBLIC} onLogout={() => {}}><ClubRegistration /></Layout>
          } />
          
          {/* Verification accessible to all, but Partners get extra features */}
          <Route path="/verify" element={<Verification role={currentRole} />} />
          <Route path="/verify/:id" element={<Verification role={currentRole} />} />
          
          {/* System Routes (Admin/AJK/Partner) */}
          <Route path="/dashboard" element={
            currentRole !== Role.PUBLIC 
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><Dashboard role={currentRole} /></Layout>
              : <Navigate to="/" replace />
          } />
          
          {/* Admin & AJK Routes */}
          <Route path="/members" element={
            (currentRole === Role.ADMIN || currentRole === Role.AJK)
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><MemberManagement role={currentRole} /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

          {/* Admin Only Routes */}
          <Route path="/partners" element={
            (currentRole === Role.ADMIN)
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><PartnerManagement /></Layout>
              : <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/partners/:id" element={
            (currentRole === Role.ADMIN)
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><PartnerDetails /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

           <Route path="/clubs" element={
            (currentRole === Role.ADMIN)
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><ClubManagement /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

          {/* Reports Route Placeholder (Reusing Dashboard for now or similar) */}
          <Route path="/reports" element={
             (currentRole === Role.ADMIN || currentRole === Role.AJK)
              ? <Layout role={currentRole} onLogout={() => setCurrentRole(Role.PUBLIC)} toggleTheme={toggleTheme} isDarkMode={isDarkMode}><Dashboard role={currentRole} /></Layout>
              : <Navigate to="/dashboard" replace />
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={currentRole === Role.PUBLIC ? "/" : "/dashboard"} replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;