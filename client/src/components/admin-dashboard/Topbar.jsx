import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, ChevronDown, LogOut, Eye, EyeOff, X, Lock } from 'lucide-react';
import axios from 'axios';
import Toast from '../Toast';

// Moved outside of Topbar to prevent recreation on each render
const InputField = ({ label, field, type = "password", placeholder, value, onChange, showPassword, togglePasswordVisibility, error }) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-700">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type={showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field pl-10 pr-10 ${error ? 'border-red-300' : 'border-gray-300'}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1">{error}</p>
    )}
  </div>
);

const Topbar = ({ toggleSidebar }) => {
  const { admin } = useSelector((state) => state.authorization);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        handleCloseModal();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  const handleOpenModal = () => {
    setModalOpen(true);
    setDropdownOpen(false);
    setErrors({});
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setErrors({});
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      };

      const response = await axios.put(`${apiUrl}/api/v1/auth/change-password`, payload, {
        withCredentials: true
      });

      if (response.data.success) {
        setToast({
          show: true,
          message: 'Password updated successfully',
          type: 'success'
        });
        handleCloseModal();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                    onClick={handleOpenModal}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out animate-modal-enter"
            style={{
              animation: "modalEnter 0.3s ease-out forwards",
            }}
          >
            <style jsx>{`
              @keyframes modalEnter {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>

            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <InputField
                label="Current Password"
                field="currentPassword"
                placeholder="Enter your current password"
                value={passwords.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                showPassword={showPasswords.current}
                togglePasswordVisibility={() => togglePasswordVisibility('current')}
                error={errors.currentPassword}
              />

              <InputField
                label="New Password"
                field="newPassword"
                placeholder="Enter your new password"
                value={passwords.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                showPassword={showPasswords.new}
                togglePasswordVisibility={() => togglePasswordVisibility('new')}
                error={errors.newPassword}
              />

              <InputField
                label="Confirm New Password"
                field="confirmPassword"
                placeholder="Confirm your new password"
                value={passwords.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                showPassword={showPasswords.confirm}
                togglePasswordVisibility={() => togglePasswordVisibility('confirm')}
                error={errors.confirmPassword}
              />

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-secondary"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </>
  );
};

export default Topbar;