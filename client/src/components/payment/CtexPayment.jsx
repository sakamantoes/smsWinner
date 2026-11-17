import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../service/api.js";
import useAuth from "../../store/useAuth.js";
import { formatCurrency } from "../../utils/transaction.js";
import PhoneRequiredModal from "./PhoneRequiredModal.jsx";

export default function CtexPayment({ amount, onBack }) {
  const { user } = useAuth();
  const profile = user?.data || user || {};
  const [showPhone, setShowPhone] = useState(false);
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/payment/ctex/initialize-deposit", {
        amount: Number(amount),
      });
      sessionStorage.setItem("ctexReference", res.data.reference);
      window.location.href = res.data.data; // CTEX hosted checkout
    } catch (error) {
      if (error.response?.data?.code === "PHONE_REQUIRED") {
        setShowPhone(true);
      } else {
        toast.error(error.response?.data?.message || "Could not start payment");
      }
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!profile.phone) return setShowPhone(true);
    startPayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-bg px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface-raised p-5 shadow-card">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-heading"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="mt-4 text-lg font-bold text-heading">
          Pay with CTEX PAY
        </h2>
        <p className="mt-1 text-sm text-muted">
          You will pay {formatCurrency(Number(amount))} by bank transfer on a
          secure checkout page.
        </p>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading || !Number(amount)}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-bold text-on-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Starting payment..." : "Continue to payment"}
        </button>
      </div>

      {showPhone && (
        <PhoneRequiredModal
          onClose={() => setShowPhone(false)}
          onSaved={() => {
            setShowPhone(false);
            startPayment();
          }}
        />
      )}
    </div>
  );
}
