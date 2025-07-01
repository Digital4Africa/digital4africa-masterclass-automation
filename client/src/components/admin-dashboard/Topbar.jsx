import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, ChevronDown, LogOut } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  const { admin } = useSelector((state) => state.authorization);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative" ref={dropdownRef}>
            <button
              className={`flex items-center gap-2 text-gray-700 hover:text-[var(--d4a-blue)] transition-colors cursor-pointer ${
                dropdownOpen ? "text-[var(--d4a-blue)]" : ""
              }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {admin ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={`https://ui-avatars.com/api/?name=${admin.firstName.charAt(0)}+${admin.lastName.charAt(0)}&background=0060a1&color=fff`}
                  alt={`${admin.firstName} ${admin.lastName}`}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#0060a1] flex items-center justify-center text-white font-medium">
                  <span>AD</span>
                </div>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 transform origin-top-right transition-all duration-200 animate-fadeIn"
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                }}
              >
                <style jsx>{`
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(-10px) scale(0.95);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                `}</style>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {admin ? `${admin.firstName} ${admin.lastName}` : 'Admin Account'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {admin?.email || 'admin@example.com'}
                  </p>
                </div>
                <button
                  className="flex items-center w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="rounded-full bg-blue-50 p-1 mr-2">
                    <User className="w-4 h-4 text-blue-500" />
                  </span>
                  Account Settings
                </button>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;