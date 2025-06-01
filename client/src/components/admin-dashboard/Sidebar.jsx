import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin-home' },
    { name: 'Masterclasses', icon: '🎓', path: '/admin-home/masterclasses' },
    { name: 'Students', icon: '👥', path: '/admin-home/students' },
    { name: 'Payments', icon: '💳', path: '/admin-home/payments' },
    { name: 'Communications', icon: '✉️', path: '/admin-home/communications' },
    { name: 'Settings', icon: '⚙️', path: '/admin-home/settings' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 bg-white shadow-lg z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-center h-16 bg-[var(--d4a-blue)] text-white">
        {isOpen ? (
          <h1 className="text-xl font-bold">D4A Admin</h1>
        ) : (
          <span className="text-xl">D4A</span>
        )}
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin-home'} // ✅ Fixes incorrect multi-active links
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors duration-200
              ${isActive ? 'bg-[var(--d4a-blue)] text-white' : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
