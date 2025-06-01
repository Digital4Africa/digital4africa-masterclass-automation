import React from 'react';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm z-20">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-[var(--d4a-blue)] focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:text-[var(--d4a-blue)] hover:bg-gray-100">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="relative">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://ui-avatars.com/api/?name=Admin&background=0060a1&color=fff"
              alt="Admin"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;