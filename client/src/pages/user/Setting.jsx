import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Copy,
  CreditCard,
  HelpCircle,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Phone,
  ReceiptText,
  Settings,
  ShieldCheck,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../store/useAuth.js";

const formatUserId = (id) => {
  if (!id) {
    return "Not available";
  }

  return `...${String(id).slice(-8)}`;
};

const settingGroups = [
  {
    title: "Buying Preferences",
    description: "Make number and log purchases easier to repeat.",
    icon: Phone,
    items: [
      {
        label: "Auto-refresh OTP inbox",
        detail: "Keep checking active numbers while you wait for a code.",
        key: "autoRefreshOtp",
        enabled: true,
      },
      {
        label: "Low balance warning",
        detail: "Show a reminder before purchases when wallet balance is low.",
        key: "lowBalanceWarning",
        enabled: true,
      },
    ],
  },
  {
    title: "Notifications",
    description: "Choose the alerts that matter most for your workflow.",
    icon: Bell,
    items: [
      {
        label: "Deposit status updates",
        detail: "Notify me when a manual transfer or gateway payment changes.",
        key: "depositUpdates",
        enabled: true,
      },
      {
        label: "Receipt reminders",
        detail: "Remind me to download receipts after completed purchases.",
        key: "receiptReminders",
        enabled: false,
      },
    ],
  },
];

const quickLinks = [
  {
    label: "Fund wallet",
    description: "Add balance before buying numbers or logs.",
    icon: Wallet,
    path: "/f/fund-account",
  },
  {
    label: "Deposit history",
    description: "Review funding status and references.",
    icon: CreditCard,
    path: "/f/deposits",
  },
  {
    label: "Purchase receipts",
    description: "Find receipts for completed orders.",
    icon: ReceiptText,
    path: "/f/receipts",
  },
];

export default function Setting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = user?.data || user || {};
  const displayName = profile.username || profile.name || "Verified User";
  const displayEmail = profile.email || "No email on file";
  const role = profile.role || "user";
  const userId = profile.id || profile._id;
  const initial = (displayName || displayEmail || "U").slice(0, 1).toUpperCase();

  const [preferences, setPreferences] = useState(() =>
    settingGroups.reduce((acc, group) => {
      group.items.forEach((item) => {
        acc[item.key] = item.enabled;
      });
      return acc;
    }, {}),
  );
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const deleteReady = deleteConfirm.trim().toUpperCase() === "DELETE";

  const accountStatus = useMemo(
    () => [
      {
        label: "Account status",
        value: "Verified",
        icon: CheckCircle2,
        className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        label: "User ID",
        value: formatUserId(userId),
        icon: User,
        className: "text-gray-300 bg-white/5 border-white/10",
      },
    ],
    [role, userId],
  );

  const handleCopy = async (value, label) => {
    if (!value) {
      toast.info(`${label} is not available yet`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleDeletionRequest = () => {
    if (!deleteReady) {
      toast.info("Type DELETE to confirm this request");
      return;
    }

    toast.info("Account deletion request is ready for backend connection");
    setDeleteConfirm("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-red-light to-red-dark text-2xl font-bold text-white">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    User Profile
                  </p>
                  <h2 className="mt-1 truncate text-2xl font-bold text-white">
                    {displayName}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                    <Mail size={14} className="text-red" />
                    <span className="break-all">{displayEmail}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(displayEmail, "Email")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-black/30 px-4 text-sm font-medium text-gray-300 transition-colors hover:border-red-light/30 hover:bg-white/10 hover:text-white"
              >
                <Copy size={14} />
                Copy Email
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {accountStatus.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${item.className}`}
                  >
                    <item.icon size={17} />
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-widest text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold capitalize text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {settingGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-light/10 text-red">
                  <group.icon size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{group.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-white/10">
                {group.items.map((item) => {
                  const enabled = preferences[item.key];

                  return (
                    <div
                      key={item.key}
                      className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {item.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => togglePreference(item.key)}
                        className={`flex h-7 w-12 shrink-0 items-center rounded-full border px-1 transition-colors ${
                          enabled
                            ? "justify-end border-red-light/30 bg-red-light/70"
                            : "justify-start border-white/10 bg-black/40"
                        }`}
                      >
                        <span className="h-5 w-5 rounded-full bg-white shadow" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-md">
            <h2 className="font-semibold text-white">Quick Settings Links</h2>
            <div className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigate(link.path)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-red-light/30 hover:bg-red-light/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-300">
                    <link.icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      {link.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>



          <section className="rounded-xl border border-red-light/20 bg-red-light/10 p-5 shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-light/15 text-red">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-white">Delete Account</h2>
                <p className="mt-1 text-sm leading-6 text-gray-300">
                  This should remove your profile, wallet access, receipts, and
                  active order history after the backend deletion route is added.
                </p>
              </div>
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-widest text-red-200">
              Type DELETE to confirm
            </label>
            <input
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder="DELETE"
              className="mt-2 h-11 w-full rounded-lg border border-red-light/20 bg-black/40 px-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-red-light/60 focus:ring-1 focus:ring-red-light/50"
            />
            <button
              type="button"
              onClick={handleDeletionRequest}
              disabled={!deleteReady}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-light px-4 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:bg-red-light/30 disabled:text-white/50"
            >
              <Trash2 size={15} />
              Request Account Deletion
            </button>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-300">
                <HelpCircle size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-white">Support</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Need help with a deposit, receipt, number purchase, or log
                  order? Keep your reference ID ready before contacting support.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
