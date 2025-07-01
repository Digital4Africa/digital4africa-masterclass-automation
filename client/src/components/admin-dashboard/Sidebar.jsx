import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Toast from "../Toast"; // Adjust path as needed
import { logoutAdmin } from "../../utils/logoutAdmin";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, unsetAdmin } from "../../features/auth/authSlice";

const Sidebar = ({ isOpen }) => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { name: "Dashboard", icon: "📊", path: "/admin-home" },
    { name: "Cohorts", icon: "🗂️", path: "/admin-home/cohorts" }, // ← Added here
    { name: "Masterclasses", icon: "🎓", path: "/admin-home/masterclasses" },
    { name: "Students", icon: "👥", path: "/admin-home/students" },
    { name: "Payments", icon: "💳", path: "/admin-home/payments" },
    { name: "Direct Enroll", icon: "➕", path: "/admin-home/direct-enroll" },
    // { name: "Communications", icon: "✉️", path: "/admin-home/communications" },
    // { name: "Settings", icon: "⚙️", path: "/admin-home/settings" },
  ];

  const showToast = (message, type) => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: "", type: "" });
  };

  const handleLogout = async () => {
    const success = await logoutAdmin(dispatch);

    if (success) {
      showToast("Logged out successfully!", "success");

      // Wait for toast to show before navigating
      setTimeout(() => {
        dispatch(setIsAuthenticated(false));
        navigate("/admin-067", { replace: true });
        dispatch(unsetAdmin());
      }, 1500); // 1.5s delay (adjust to match your Toast duration)
    } else {
      showToast("Logout failed. Please try again.", "error");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-30 transition-all duration-300 ${
          isOpen ? "w-54" : "w-20"
        }`}
      >
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
              end={item.path === "/admin-home"}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? "bg-[var(--d4a-blue)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center px-4 py-3 mx-2 rounded-lg transition-colors duration-200 text-[var(--d4a-red)] hover:bg-red-50 w-full text-left mt-4"
          >
            <span className="text-xl">🚪</span>
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default Sidebar;
