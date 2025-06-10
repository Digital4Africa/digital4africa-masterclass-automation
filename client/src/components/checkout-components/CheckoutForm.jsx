import { useState } from "react";
import { showPaystackModal } from "../../utils/paystackModal";
import { validateEnrollment } from "../../utils/checkoutUtil";


import PaymentCompletionModal from "./CompletePaymentModal";

const CheckoutForm = ({ price, cohortId }) => {
  const [paymentType, setPaymentType] = useState("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setShowCompletionModal(false);
    setPaymentData(null);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    const amount = paymentType === "full" ? price : partialAmount;

    const validationData = {
      fullName: formData.name,
      email: formData.email,
      cohortId,
      amount: amount,
    };

    try {
      const validationResult = await validateEnrollment(validationData);

      if (validationResult.success) {
        // Show Paystack modal if validation is successfulf
        showPaystackModal({
          email: formData.email,
          amountInKoboOrCents: amount * 100,
          currency: "KES",
          onSuccess: async (response) => {
            const reference = response.reference;
            const data = {
              email: formData.email,
              fullName: formData.name,
              cohortId,
              amount,
              reference,
            };

            setPaymentData(data);
            setShowCompletionModal(true);
          },
          onClose: () => {
            console.log("[Paystack onClose] Payment closed by user");
          },
        });
      } else {
        alert(`Failed to validate: ${validationResult.message}`);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to validate enrollment");
    } finally {
      setIsProcessing(false);
    }
  };

  const fullPrice = price.toLocaleString("en-US", {
    style: "currency",
    currency: "KES",
  });

  return (
    <>
      {showCompletionModal && paymentData && (
        <PaymentCompletionModal
          paymentData={paymentData}
          userEmail={formData.email}
          onClose={handleModalClose}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input-field mt-1"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-field mt-1"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Payment Options</h3>

          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                paymentType === "full"
                  ? "border-[#0060a1] bg-blue-50 text-[#0060a1]"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentType("full")}
            >
              Pay Full Amount
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                paymentType === "partial"
                  ? "border-[#0060a1] bg-blue-50 text-[#0060a1]"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentType("partial")}
            >
              Pay Partial
            </button>
          </div>

          {paymentType === "full" ? (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                Total Amount: <span className="font-bold">{fullPrice}</span>
              </p>
            </div>
          ) : (
            <div>
              <label
                htmlFor="partialAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Partial Amount (Kes)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">Kes </span>
                </div>
                <input
                  type="number"
                  id="partialAmount"
                  name="partialAmount"
                  min="1"
                  required
                  className="input-field pl-10"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder={`maximum ${fullPrice}`}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-lg"
          disabled={isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : paymentType === "full"
            ? `Pay ${fullPrice}`
            : "Pay Partial Amount"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          If you've already made a partial payment, please continue with the
          same email address to ensure we can link your previous transaction.
        </p>
      </form>
    </>
  );
};

export default CheckoutForm;
