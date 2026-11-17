import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CreditCard,
  Landmark,
  X,
} from "lucide-react";
import { useState } from "react";

const paymentOptions = [
  // {
  //   id: "quest",
  //   title: "Pay with QUEST",
  //   description: "Use QUESTPay to fund your wallet instantly.",
  //   icon: CreditCard,
  // },
  {
    id: "ctex",
    title: "Pay with CTEX PAY",
    description: "Pay by bank transfer on a secure checkout page.",
    icon: Landmark,
  },
  {
    id: "manual-transfer",
    title: "Manual Transfer",
    description: "Send money to the account below for confirmation.",
    icon: Building2,
  },
];

export default function PaymentModal({
  isOpen = true,
  initialAmount = "",
  onClose,
  showBackButton = false,
  onSelectPaymentMethod,
}) {
  const [selectedMethod, setSelectedMethod] = useState("ctex");
  const [amount, setAmount] = useState(initialAmount);

  if (!isOpen) return null;

  const selectedOption = paymentOptions.find(
    (option) => option.id === selectedMethod,
  );

  const handleProceed = () => {
    onSelectPaymentMethod?.({
      amount: Number(amount),
      paymentMethod: selectedMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-red-950/30">
        <div aria-hidden="true" className="h-1 w-full bg-red-600" />

        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-start gap-3">
            {showBackButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Go back"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-white">Fund Account</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Choose how you want to add money to your wallet.
              </p>
            </div>
          </div>
          {!showBackButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payment modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition-colors hover:border-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-5 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-zinc-400">Amount</span>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              className="mt-2 h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </label>

          <div className="grid gap-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMethod === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedMethod(option.id)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
                    isSelected
                      ? "border-red-600 bg-red-600/10"
                      : "border-zinc-800 bg-black hover:border-red-600/60 hover:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-zinc-400">
                      {option.description}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className={isSelected ? "text-red-500" : "text-zinc-600"}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={!amount || Number(amount) <= 0}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue with {selectedOption?.title.replace("Pay with ", "")}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}