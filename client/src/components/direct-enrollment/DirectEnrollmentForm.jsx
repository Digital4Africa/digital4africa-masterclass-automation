import { useState } from "react";
import Toast from "../Toast";
import { validateEnrollment } from "../../utils/checkoutUtil";
import { fetchCohorts } from "../../features/cohorts/cohortsSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const DirectEnrollmentForm = ({ cohorts, onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    cohortId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    amount: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCohort = cohorts.find(c => c._id === formData.cohortId);
  const confirmMessage = `
Please confirm the enrollment details:

   • Full Name:   ${formData.fullName}
   • Email:       ${formData.email}
   • Phone:       ${formData.phoneNumber}
   • Masterclass: ${selectedCohort ? selectedCohort.masterclassTitle : '—'}
   • Amount:      KES ${parseFloat(formData.amount || 0).toLocaleString()}

Are these details correct?`;

  // Show the browser's confirm dialog; bail out if the user cancels
  if (!window.confirm(confirmMessage)) return;
    setIsSubmitting(true);

    try {
      // Ensure amount is parsed as float
      const validationData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const validationResult = await validateEnrollment(validationData);
      if (!validationResult.success) {
        setToast({
          show: true,
          message: validationResult.message,
          type: "error"
        });
        return;
      }

      // Pass parsed float amount to onSubmit
      const result = await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      console.log("result: ", result);

      if (result.success) {
        setToast({
          show: true,
          message: result.message || "Enrollment successful",
          type: "success"
        });


        setTimeout(() => {
          navigate('/admin-home');
          dispatch(fetchCohorts());
        }, 2000);
      } else {
        setToast({
          show: true,
          message: result.message,
          type: "error"
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "An unexpected error occurred",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[var(--d4ablack)] mb-6">Direct Enrollment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cohort Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Masterclass <span style={{color: 'var(--d4a-red)'}}>*</span></label>
          <select
            name="cohortId"
            value={formData.cohortId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
            required
          >
            <option value="">Select a cohort</option>
            {cohorts.map(cohort => (
              <option key={cohort._id} value={cohort._id}>
                {cohort.masterclassTitle} (KES {cohort.masterclassPrice.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Student Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span style={{color: 'var(--d4a-red)'}}>*</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span style={{color: 'var(--d4a-red)'}}>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span style={{color: 'var(--d4a-red)'}}>*</span></label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
              required
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) <span style={{color: 'var(--d4a-red)'}}>*</span></label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference <span style={{color: 'var(--d4a-red)'}}>*</span></label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0060a1] focus:border-[#0060a1]"
              placeholder="M-PESA code, bank receipt number, etc."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-[#0060a1] hover:bg-[#004a80] text-white font-medium rounded-md transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
        </button>
      </form>

      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default DirectEnrollmentForm;