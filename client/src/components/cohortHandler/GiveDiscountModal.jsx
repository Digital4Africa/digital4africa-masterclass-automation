import { useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { hideOverlay } from "../../features/overlay/overlaySlice";
// import { showOverlay, hideOverlay } from "../path/to/your/overlaySlice"; // Update this path

const GiveDiscountModal = ({ cohort, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    amountOff: "",
    reason: "",
  });
  const [modalState, setModalState] = useState("form"); // "form", "loading", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");

  const formatDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.amountOff) {
      setErrorMessage("Email and amount off are required fields");
      setModalState("error");
      return;
    }

    if (isNaN(formData.amountOff) || Number(formData.amountOff) <= 0) {
      setErrorMessage("Amount off must be a valid positive number");
      setModalState("error");
      return;
    }

    setModalState("loading");

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/cohort/give-discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            masterclassTitle: cohort.masterclassTitle,
            cohortId: cohort._id,
            amountOff: Number(formData.amountOff),
            reason: formData.reason,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setModalState("success");
      } else {
        setErrorMessage(data.message || "Failed to assign discount");
        setModalState("error");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error. Please try again.");
      setModalState("error");
    }
  };

  const handleClose = () => {
    dispatch(hideOverlay());
    onClose();
  };

  const renderFormContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Give Discount</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter student's email"
            required
          />
        </div>

        {/* Masterclass Title (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Masterclass Title
          </label>
          <input
            type="text"
            value={cohort.masterclassTitle}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            readOnly
          />
        </div>

        {/* Starting Date (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Date
          </label>
          <input
            type="text"
            value={formatDate(cohort.startDate)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            readOnly
          />
        </div>

        {/* Amount Off */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Off (Ksh) *
          </label>
          <input
            type="number"
            name="amountOff"
            value={formData.amountOff}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter discount amount"
            min="1"
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason (Optional)
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="Enter reason for discount"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </form>
    </>
  );

  const renderLoadingContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Give Discount</h2>
      </div>

      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Applying discount...</p>
      </div>
    </>
  );

  const renderSuccessContent = () => (
    <>
      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-600 mb-2">
          Discount has been successfully assigned to{" "}
          <strong>{formData.email}</strong>
        </p>
        <p className="text-sm font-medium mb-6">
          <strong className="bg-brown-100 px-2 py-1 rounded-md">Important!</strong> Please advice the student uses this
          exact email when making payment for the discount to apply.
        </p>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Okay
        </button>
      </div>
    </>
  );

  const renderErrorContent = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Error</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-red-600 mb-6">{errorMessage}</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setModalState("form")}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (modalState) {
      case "loading":
        return renderLoadingContent();
      case "success":
        return renderSuccessContent();
      case "error":
        return renderErrorContent();
      default:
        return renderFormContent();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 100 }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default GiveDiscountModal;
