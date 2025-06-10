// src/utils/paystackModal.js
export const showPaystackModal = ({ email, amountInKoboOrCents, currency = "KES", onSuccess, onClose }) => {
	const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

	const handler = window.PaystackPop.setup({
	  key: paystackPublicKey,
	  email,
	  amount: amountInKoboOrCents, // already multiplied by 100 from caller
	  currency,
	  ref: `PSK_${Date.now()}`,
	  callback: (response) => {
		if (onSuccess) onSuccess(response);
	  },
	  onClose: () => {
		if (onClose) onClose();
	  },
	});

	handler.openIframe();
  };