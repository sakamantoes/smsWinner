import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react";
import { useState } from "react";
import UseALATPay from "react-alatpay";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-light/60";

export default function AlatPayment({ amount = "", onBack }) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    amount,
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submit = UseALATPay({
      businessId: import.meta.env.VITE_ALATPAY_BUSINESS_ID,
      apiKey: import.meta.env.VITE_ALATPAY_API_KEY,
      currency: "NGN",
      color: "#FF0000",
      email: formData.email,
      phone: formData.phone,
      meta: {},
      firstName: formData.firstName,
      lastName: formData.lastName,
      amount: Number(formData.amount) * 100, // Convert to kobo
      redirectUrl: "http://localhost:5173/fund-account",
      onClose: () => {
        console.log("user closed alatpay modal");
      },
      onTransaction: (response) => {
        console.log("Alat Pay Transaction Response: ", response);
      },
    });
    submit.submit();
  };

  return (
    <div className="fixed inset-0 z-50 flex  overflow-y-auto items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-red-light/20 bg-[#111] shadow-2xl">
        <div className="flex items-start gap-3 border-b border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to payment methods"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-red-light/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-red-light">
              <CreditCard size={17} />
              <span className="text-xs font-bold uppercase tracking-widest">
                ALAT
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">Pay with ALAT</h2>
            <p className="mt-1 text-sm text-gray-400">
              Enter your details to continue with ALATPay.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-gray-300">Email</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">
                First name
              </span>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">
                Last name
              </span>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">
                Phone Number
              </span>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-300">
                Amount (NGN)
              </span>
              <input
                name="amount"
                type="tel"
                value={formData.amount}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-dark px-4 text-sm font-bold text-white transition-colors hover:bg-red"
          >
            Proceed with ALAT
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
