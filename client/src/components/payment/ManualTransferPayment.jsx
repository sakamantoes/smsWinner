import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { useState } from "react";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-light/60";

export default function ManualTransferPayment({
  amount = "",
  onBack,
}) {
  const [formData, setFormData] = useState({
    depositorName: "",
    transactionId: "",
    amount,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center  overflow-y-auto justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
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
              <Building2 size={17} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Transfer
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Manual Transfer
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Transfer to the account below and submit your payment details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="rounded-xl border border-white/10 bg-black/35 p-4 text-sm text-gray-300">
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Bank</span>
              <span className="font-semibold text-white">Wema Bank</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Account Name</span>
              <span className="font-semibold text-white">SMS Winner</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Account Number</span>
              <span className="font-mono font-semibold text-white">
                0000000000
              </span>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">
              Depositor name
            </span>
            <input
              name="depositorName"
              type="text"
              value={formData.depositorName}
              onChange={handleChange}
              placeholder="Name used for transfer"
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">
              Transaction reference
            </span>
            <input
              name="transactionId"
              type="text"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Bank transfer reference"
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">Amount</span>
            <input
              name="amount"
              type="number"
              min="100"
              value={formData.amount}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-dark px-4 text-sm font-bold text-white transition-colors hover:bg-red"
          >
            Submit Transfer Details
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
