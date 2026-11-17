import { Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../service/api.js";
import useAuth from "../../store/useAuth.js";

const PHONE_RE = /^(0[789]\d{9}|\+?234[789]\d{9})$/;

export default function PhoneRequiredModal({ onClose, onSaved }) {
  const { user, updateUser } = useAuth();
  const profile = user?.data || user || {};
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const valid = PHONE_RE.test(phone.replace(/\s/g, ""));

  const save = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      const res = await api.put("/api/auth/update-phone", { phone });
      const saved = res.data.data.phone;
      updateUser?.({ ...profile, phone: saved });
      toast.success("Phone number saved");
      onSaved?.(saved);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save phone number");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-5 shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
            <Phone size={20} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-heading"
          >
            <X size={18} />
          </button>
        </div>
        <h2 className="mt-4 text-lg font-bold text-heading">Add your phone number</h2>
        <p className="mt-1 text-sm text-muted">
          We need a phone number on your account before you can fund your wallet.
        </p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08012345678"
          className="mt-4 h-12 w-full rounded-xl border border-border bg-bg px-4 text-heading outline-none placeholder:text-muted focus:border-brand"
        />
        <button
          type="button"
          onClick={save}
          disabled={!valid || saving}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-bold text-on-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save and continue"}
        </button>
      </div>
    </div>
  );
}