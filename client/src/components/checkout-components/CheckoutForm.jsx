import { useState } from "react";

const CheckoutForm = ({ price }) => {
  const [paymentType, setPaymentType] = useState("full");
  const [partialAmount, setPartialAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = paymentType === "full" ? price : partialAmount * 100;
    console.log("Submitting:", { ...formData, amount });
    // Here you would typically send this data to your payment processor
  };

  const fullPrice = price.toLocaleString("en-US", {
    style: "currency",
    currency: "KES",
  });

  return (
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

      <button type="submit" className="btn-primary w-full py-3 text-lg">
        {paymentType === "full" ? `Pay ${fullPrice}` : "Pay Partial Amount"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        If you’ve already made a partial payment, please continue with the same
        email address to ensure we can link your previous transaction.
      </p>
    </form>
  );
};

export default CheckoutForm;
