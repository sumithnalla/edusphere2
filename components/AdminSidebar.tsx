import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block p-3 rounded-lg transition ${isActive ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-gray-800'}`;

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col fixed h-full z-20">
      <div className="p-6 text-white font-black text-2xl border-b border-gray-800">ADMIN</div>
      <nav className="p-4 flex-grow space-y-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard Overview
        </NavLink>
        <NavLink to="/admin/allot-batches" className={linkClass}>
          Allot Batches
        </NavLink>
        <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
          Content Management
        </div>
        <NavLink to="/admin/daily-classes" className={linkClass}>
          Daily Classes
        </NavLink>
        <NavLink to="/admin/recorded-classes" className={linkClass}>
          Recorded Classes
        </NavLink>
        <NavLink to="/admin/doubts-classes" className={linkClass}>
          Doubts Classes
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="w-full p-2 text-sm text-gray-500 hover:text-red-400">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
