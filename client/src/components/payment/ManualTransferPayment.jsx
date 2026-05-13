import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { manualBankPayment } from "../../service/payment.js";

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-light/60";

export default function ManualTransferPayment({ amount = "", onBack }) {
  const [formData, setFormData] = useState({
    depositorName: "",
    transactionId: "",
    amount,
  });
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequestError("");
    setSuccessMessage("");
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setRequestError("");
    setSuccessMessage("");

    try {
      const payload = {
        depositorName: formData.depositorName.trim(),
        transactionId: formData.transactionId.trim(),
        amount: Number(formData.amount),
      };

      const response = await manualBankPayment(payload);
      if (!response?.success) {
        throw new Error(response?.message || "Transfer submission failed.");
      }

      const message =
        response?.message ||
        "Transfer submitted successfully. We will confirm it shortly.";

      setSuccessMessage(message);
      toast.success(message);
      setFormData((current) => ({
        ...current,
        depositorName: "",
        transactionId: "",
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Try again.";

      console.error("error submitting manual payment: ", error);
      setRequestError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          {successMessage ? (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <p>{successMessage}</p>
            </div>
          ) : null}

          {requestError ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-light/20 bg-red-light/10 p-3 text-sm text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{requestError}</p>
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-black/35 p-4 text-sm text-gray-300">
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Bank</span>
              <span className="font-semibold text-white">Opay</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Account Name</span>
              <span className="font-semibold text-white">
                Victory Onyekwerre
              </span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-gray-500">Account Number</span>
              <span className="font-mono font-semibold text-white">
                7089526653
              </span>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">
              Depositor Account name
            </span>
            <input
              name="depositorName"
              type="text"
              value={formData.depositorName}
              onChange={handleChange}
              placeholder="Name used for transfer"
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-dark px-4 text-sm font-bold text-white transition-colors hover:bg-red disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
          >
            <span>Submit Transfer Details</span>
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <ArrowRight size={17} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
