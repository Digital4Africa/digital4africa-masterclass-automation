import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../features/overlay/overlaySlice";
import Toast from "../Toast";
import axios from "axios";
import { fetchCohorts } from "../../features/cohorts/cohortsSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const AddCohortModal = ({ onClose, masterclasses }) => {
  const dispatch = useDispatch();
  const [selectedMasterclass, setSelectedMasterclass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    dispatch(showOverlay());
    return () => dispatch(hideOverlay());
  }, [dispatch]);

  // Helper function to set time to 9 AM or 5 PM EAT (UTC+3)
  const setTimeForEAT = (dateString, hoursEAT) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Convert EAT hours to UTC (EAT is UTC+3)
    const hoursUTC = (hoursEAT + 24 - 3) % 24; // Handle timezone conversion
    date.setUTCHours(hoursUTC, 0, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMasterclass || !startDate || !endDate) {
      setToast({
        isVisible: true,
        message: "Please fill all fields",
        type: "error",
      });
      return;
    }

    // Set fixed times (9 AM and 5 PM East Africa Time)
    const startWithTime = setTimeForEAT(startDate, 9); // 9 AM EAT (6 AM UTC)
    const endWithTime = setTimeForEAT(endDate, 17);    // 5 PM EAT (2 PM UTC)

    if (new Date(startWithTime) >= new Date(endWithTime)) {
      setToast({
        isVisible: true,
        message: "End date must be after start date",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    dispatch(showOverlay());

    try {
      const masterclass = masterclasses.find(
        (m) => m._id === selectedMasterclass
      );

      await axios.post(
        `${apiUrl}/api/v1/cohort/create-cohort`,
        {
          title: masterclass.title,
          startDate: startWithTime,
          endDate: endWithTime,
        },
        {
          withCredentials: true,
        }
      );

      setToast({
        isVisible: true,
        message: "Cohort created successfully!",
        type: "success",
      });

      setTimeout(() => {
        onClose();
        dispatch(hideOverlay());
        dispatch(fetchCohorts());
      }, 1500);
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.response?.data?.message || "Error creating cohort",
        type: "error",
      });
      dispatch(hideOverlay());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[var(--d4a-black)]">
                Create New Cohort
              </h3>
              <button
                onClick={onClose}
                className="text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    Masterclass
                  </label>
                  <select
                    value={selectedMasterclass}
                    onChange={(e) => setSelectedMasterclass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    required
                  >
                    <option value="">Select Masterclass</option>
                    {masterclasses.map((masterclass) => (
                      <option key={masterclass._id} value={masterclass._id}>
                        {masterclass.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--d4a-black)] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--d4a-blue)] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white bg-[var(--d4a-blue)] rounded-md hover:bg-opacity-90 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Creating Cohort..." : "Create Cohort"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
};

export default AddCohortModal;