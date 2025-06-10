import { useState, useEffect } from "react";

import { completeEnrollment } from "../../utils/checkoutUtil";



const PaymentCompletionModal = ({ paymentData, userEmail, onClose }) => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    const processPayment = async () => {
      try {
        const response = await completeEnrollment(paymentData);

        if (response.success) {
          setStatus("success");
          setResult(response.data);
        } else {
          setStatus("error");
          setError(response.message);
        }
      } catch (err) {
		console.log(err);
        setStatus("error");
        setError("Payment verification failed. Please try again.");
      }
    };

    processPayment();
  }, [paymentData]);

  const handleClose = () => {

    onClose?.();
  };

  const handleRetry = () => {
    setStatus("loading");
    setError("");
    setResult(null);

    // Retry the payment completion
    const processPayment = async () => {
      try {
        const response = await completeEnrollment(paymentData);

        if (response.success) {
          setStatus("success");
          setResult(response.data);
        } else {
          setStatus("error");
          setError(response.message);
        }
      } catch (err) {
		console.log(err);
        setStatus("error");
        setError("Payment verification failed. Please try again.");
      }
    };

    processPayment();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-100">
      {/* Modern transparent backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-fadeIn"
        onClick={handleClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden z-10 animate-slideIn">

        {/* Loading State */}
        {status === "loading" && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 border-2 border-blue-400 rounded-full border-r-transparent animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Verifying Payment
            </h3>
            <p className="text-gray-600 animate-pulse">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="p-8 text-center">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success animation */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {result?.balanceRemaining > 0 ? "Payment Successful!" : "Congratulations!"}
            </h3>

            <div className="space-y-3 mb-6">
              {result?.balanceRemaining === 0 ? (
                <p className="text-green-600 font-medium">
                  You have made full payment!
                </p>
              ) : (
                <p className="text-blue-600 font-medium">
                  Payment successful! Remaining balance: KES {result?.balanceRemaining?.toLocaleString()}
                </p>
              )}

              {result?.discount > 0 && (
                <p className="text-orange-600">
                  Discount applied: KES {result.discount.toLocaleString()}
                </p>
              )}

              <p className="text-gray-600 text-sm">
                Further instructions will be sent to your email: {userEmail}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Okay
            </button>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="p-8 text-center">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Error animation */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Payment Verification Failed
            </h3>

            <p className="text-gray-700 mb-4">
              {error}
            </p>

            <p className="text-gray-600 text-sm mb-6">
              Please don't make another payment. Click retry verification below or contact customer support at +254 743830663 or email caleb@digital4africa.com
            </p>

            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-3"
            >
              Retry Verification
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentCompletionModal;