import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { hideOverlay } from "../../features/overlay/overlaySlice";
const apiUrl = import.meta.env.VITE_API_URL;
const GiveDiscountModal = ({ cohort, onClose }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    amountOff: "",
    reason: "",
  });
  const [modalState, setModalState] = useState("form"); // "form", "confirm", "loading", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTo(0, 0);
    }
  }, [modalState]);

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

  const handleFormSubmit = (e) => {
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

    if (Number(formData.amountOff) >= cohort.masterclassPrice) {
      setErrorMessage(
        "Discount amount cannot be greater than or equal to the masterclass price"
      );
      setModalState("error");
      return;
    }

    // Move to confirmation step
    setModalState("confirm");
  };

  const handleConfirmSubmit = async () => {
    setModalState("loading");

    try {
      const response = await fetch(`${apiUrl}/api/v1/cohort/give-discount`, {
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
      });

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

      <form onSubmit={handleFormSubmit} className="space-y-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060a1] focus:border-transparent outline-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 outline-none"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060a1] focus:border-transparent outline-none"
            placeholder="Enter discount amount"
            min="1"
            max={cohort.masterclassPrice - 1}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0060a1] focus:border-transparent outline-none resize-none"
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
            className="btn-primary"
          >
            Review Details
          </button>
        </div>
      </form>
    </>
  );

  const renderConfirmContent = () => {
    const amountToPay = cohort.masterclassPrice - Number(formData.amountOff);

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Confirm Discount Details
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Student Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Student Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
            </div>
          </div>

          {/* Masterclass Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Masterclass Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span
                  className="font-medium text-right flex-1 ml-4 truncate"
                  title={cohort.masterclassTitle}
                >
                  {cohort.masterclassTitle.length > 25
                    ? `${cohort.masterclassTitle.slice(0, 25)}...`
                    : cohort.masterclassTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {formatDate(cohort.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Original Price:</span>
                <span className="font-medium">
                  Ksh {cohort.masterclassPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Discount Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Discount Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Discount Amount:</span>
                <span className="font-medium text-green-600">
                  - Ksh {Number(formData.amountOff).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-200">
                <span className="text-gray-900 font-semibold">
                  Amount to Pay:
                </span>
                <span className="font-bold text-lg text-gray-900">
                  Ksh {amountToPay.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Reason (if provided) */}
          {formData.reason && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Reason for Discount
              </h3>
              <p className="text-gray-700">{formData.reason}</p>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> Please ensure the student uses the
              exact email address <strong>{formData.email}</strong> when making
              payment for the discount to apply automatically.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setModalState("form")}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm & Apply Discount
            </button>
          </div>
        </div>
      </>
    );
  };

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
          <strong className="bg-brown-100 px-2 py-1 rounded-md">
            Important!
          </strong>{" "}
          Please advice the student uses this exact email when making payment
          for the discount to apply.
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
      case "confirm":
        return renderConfirmContent();
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
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default GiveDiscountModal;
