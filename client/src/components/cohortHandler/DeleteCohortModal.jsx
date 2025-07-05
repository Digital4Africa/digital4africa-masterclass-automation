import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../../features/overlay/overlaySlice";
import axios from "axios";
import { fetchCohorts } from "../../features/cohorts/cohortsSlice";
import Toast from "../Toast";
import { AlertTriangle } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const DeleteCohortModal = ({ onClose, cohort }) => {
  const dispatch = useDispatch();
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    dispatch(showOverlay());
    return () => dispatch(hideOverlay());
  }, [dispatch]);

  const handleDelete = async () => {
    if (confirmationText !== "DELETE") {
      setToast({
        isVisible: true,
        message: "Please type DELETE to confirm",
        type: "error",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${apiUrl}/api/v1/cohort/delete/${cohort._id}`, {
        withCredentials: true,
      });

      setToast({
        isVisible: true,
        message: "Cohort deleted successfully!",
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
        message: error.response?.data?.message || "Error deleting cohort",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
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
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--d4a-black)]">
                DELETE
              </h3>
              <span className="italic">"{cohort.masterclassTitle}"</span>
              <p className="text-gray-600">
                This will permanently delete the cohort and all associated data including:
              </p>
              <ul className="text-sm text-gray-600 text-left list-disc pl-5 space-y-1">
                <li>All student records</li>
                <li>All payment information</li>
                <li>All email notifications</li>
              </ul>
              <p className="text-gray-600 font-medium">
                This action cannot be undone.
              </p>
              <div className="w-full space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type <span className="font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type DELETE"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[var(--d4a-black)] hover:text-[var(--d4a-red)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmationText !== "DELETE"}
                className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors ${
                  isDeleting || confirmationText !== "DELETE" ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
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

export default DeleteCohortModal;