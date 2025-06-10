import { Suspense, useEffect, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { appRoutes } from "./appRoutes";
import { hideOverlay, showOverlay } from "./features/overlay/overlaySlice";
import { setIsAuthenticated, unsetUser } from "./features/auth/authSlice";
import Toast from "./components/Toast";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { fetchStudentsCohorts } from "./features/cohorts/cohortsSliceStudentsDetails";
import Overlay from "./components/Overlay";
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authorization);
  const [loading, setLoading] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [sessionExpired, setSessionExpired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const showToast = (message, type) => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: "", type: "" });
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/auth/refresh-token`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const { accessToken, admin } = response.data;

        // Store the new access token
        localStorage.setItem("Tr9kLmXzQ", accessToken);

        // Update admin data if provided
        if (admin) {
          localStorage.setItem("d4aAdmin", JSON.stringify(admin));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);

      return false;
    }
  };

  const handleKeepLoggedIn = async () => {
    const success = await refreshAccessToken();

    if (success) {
      setShowSessionModal(false);
      setSessionExpired(false);
      dispatch(hideOverlay());
      showToast("Session renewed successfully!", "success");
    } else {
      handleSessionExpired();
    }
  };

  const handleSessionExpired = () => {
    localStorage.removeItem("Tr9kLmXzQ");
    localStorage.removeItem("d4aAdmin");
    dispatch(setIsAuthenticated(false));
    dispatch(unsetUser());
    setShowSessionModal(false);
    setSessionExpired(true);
    dispatch(hideOverlay());
    showToast("Your session has expired", "error");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem("Tr9kLmXzQ");
      if (!storedToken || sessionExpired) return;

      try {
        const decoded = jwtDecode(storedToken);
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - now;

        if (timeUntilExpiry <= 30 && timeUntilExpiry > 0) {
          if (!showSessionModal) {
            dispatch(showOverlay());
            setShowSessionModal(true);
            setCountdown(timeUntilExpiry);
          }
        } else if (timeUntilExpiry <= 0) {
          if (showSessionModal) {
            handleSessionExpired();
          } else {
            handleSessionExpired();
          }
        }
      } catch (error) {
        console.error("Token decode error:", error);
        handleSessionExpired();
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(interval);
  }, [dispatch, showSessionModal, sessionExpired]);

  useEffect(() => {
    if (showSessionModal && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSessionModal && countdown <= 0) {
      handleSessionExpired();
    }
  }, [showSessionModal, countdown]);

  useEffect(() => {
    const storedToken = localStorage.getItem("Tr9kLmXzQ");
    const now = Math.floor(Date.now() / 1000);

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        if (decoded.exp > now) {
          dispatch(setIsAuthenticated(true));
        } else {
          handleSessionExpired();
        }
      } catch (error) {
        console.error("Token decode error:", error);
        handleSessionExpired();
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(setIsAuthenticated(false));
      dispatch(unsetUser());
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (sessionExpired) {
      dispatch(setIsAuthenticated(false));
    }
  }, [sessionExpired, dispatch]);

  useEffect(() => {
    if (isAuthenticated && sessionExpired) {
      setSessionExpired(false);
    }
  }, [isAuthenticated, sessionExpired]);

  useEffect(() => {
    dispatch(fetchStudentsCohorts());
  }, [dispatch]);
  useEffect(() => {
    if (isAuthenticated && location.pathname === "/admin-067") {
      navigate("/admin-home", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (loading) {
    return (
      <div
        className="absolute inset-0
      flex items-center justify-center bg-gray-100 bg-opacity-50 z-50"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-t-4 border-[var(--d4a-blue)] border-solid rounded-full animate-spin"></div>
          <span className="text-[var(--d4a-black)] text-lg font-['Karla']">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-4 border-t-4 border-[var(--d4a-blue)] border-solid rounded-full animate-spin"></div>
              <span className="text-[var(--d4a-black)] text-lg font-['Karla']">
                Loading...
              </span>
            </div>
          </div>
        }
      >
        <Routes>
          {appRoutes.map((route) => {
            const Component = route.component;

            if (route.requireAuth) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    isAuthenticated && !sessionExpired ? (
                      <Component />
                    ) : (
                      <Navigate replace to="/admin-067" />
                    )
                  }
                />
              );
            }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Component />}
              />
            );
          })}
        </Routes>
      </Suspense>

      {showSessionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-100">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--d4a-blue)] to-[var(--d4a-red)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white">⏰</span>
              </div>
              <h2 className="text-2xl font-['Quicksand'] font-bold text-[var(--d4a-black)] mb-2">
                Session Expiring Soon
              </h2>
              <p className="text-gray-600 font-['Karla']">
                Your session will expire in
              </p>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[var(--d4a-red)] to-[#ff4444] rounded-full mb-4">
                <span className="text-3xl font-bold text-white font-['Quicksand']">
                  {countdown}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-['Karla']">
                seconds remaining
              </p>
            </div>

            <button
              onClick={handleKeepLoggedIn}
              className="w-full bg-gradient-to-r from-[var(--d4a-blue)] to-[#1887c3] text-white py-4 px-6 rounded-lg font-['Karla'] font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Keep Me Logged In
            </button>

            <p className="text-center text-sm text-gray-500 mt-4 font-['Karla']">
              Click to extend your session
            </p>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;
