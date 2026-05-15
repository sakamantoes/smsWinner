import {
  AlertCircle,
  Bell,
  CreditCard,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletBalanceCard from "../../components/WalletBalanceCard.jsx";
import { GetAllNotifications } from "../../service/notificationApi.js";

const stats = [
  {
    label: "Active Orders",
    value: "6",
    change: "2 waiting",
    icon: Phone,
    iconBg: "bg-gradient-to-br from-red/50 to-red/20",
    iconColor: "text-white",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
  {
    label: "Emails Bought",
    value: "14",
    change: "+3 this week",
    icon: Mail,
    iconBg: "bg-white/10",
    iconColor: "text-gray-200",
    changeBg: "bg-white/8 text-gray-300 border-white/10",
  },
  {
    label: "OTP Received",
    value: "1,284",
    change: "98.7% success",
    icon: MessageSquareText,
    iconBg: "bg-red/15",
    iconColor: "text-red/90",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
];

const serviceCards = [
  {
    title: "Available Phone Numbers",
    description:
      "Buy SMS-capable numbers listed by admin for app verification.",
    meta: "More 86 countries in stock",
    icon: Smartphone,
  },
  {
    title: "Virtual Email Accounts",
    description:
      "Purchase fresh inboxes for signup, confirmation, and recovery links.",
    meta: "Logs purchase ready",
    icon: Mail,
  },
  {
    title: "OTP Inbox",
    description:
      "Receive codes from purchased numbers and track completed orders.",
    meta: "Request your OTP at your convenience",
    icon: ShieldCheck,
  },
];

const quickActions = [
  { label: "Fund Account", icon: CreditCard, to: "/f/fund-account" },
  { label: "Buy Number", icon: Phone, to: "/f/phone-number" },
  { label: "Buy Logs", icon: Mail, to: "/f/logs" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState("");

  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setLoadingNotifications(true);
        setNotificationError("");

        const response = await GetAllNotifications(1, 5, false);
        setRecentNotifications(response?.data?.notifications || []);
      } catch (err) {
        console.error("Failed to fetch recent notifications:", err);
        setNotificationError(
          err?.response?.data?.message || "Failed to load notifications",
        );
      } finally {
        setLoadingNotifications(false);
      }
    };

    void fetchRecentNotifications();
  }, []);

  const formatNotificationDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-300">
              <ShieldCheck size={13} />
              Verification workspace
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Buy virtual numbers, emails,
              <br className="hidden sm:block" /> and receive OTP codes in one
              place.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Fund your account, pick services from admin stock, track active
              purchases, and receive verification codes as they arrive.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate("/f/fund-account", { state: { from: "/f/dashboard" } })
            }
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-red-dark/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-light active:bg-red-dark"
          >
            <Wallet size={16} />
            Fund Account
          </button>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <WalletBalanceCard />

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/10 shadow-md bg-white/5 p-5 transition-all transform hover:-translate-y-1 hover:border-red-light/40 hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
              >
                <stat.icon size={19} />
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${stat.changeBg}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Quick Actions
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3">
              {quickActions.map(({ label, icon: Icon, to }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (to === "/f/fund-account") {
                      navigate(to, {
                        state: { from: "/f/dashboard" },
                      });
                    } else {
                      navigate(to);
                    }
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-light/10 shadow-md bg-black/20 py-5 text-center transition-all hover:border-red-light/30 hover:bg-red-light/10 active:scale-105"
                >
                  <Icon size={20} className="text-white/40" />
                  <span className="text-xs font-semibold text-gray-300">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="font-semibold text-white">Available Services</h2>
            <div className="mt-4 space-y-2.5">
              {serviceCards.map((service) => (
                <div
                  key={service.title}
                  className="group flex gap-3 rounded-xl border border-red-light/10 shadow-md bg-black/20 p-4 transform transition-all hover:-translate-y-1 hover:border-red-light/40 hover:bg-red-light/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-light/10 text-red transition-colors group-hover:bg-red-light/20">
                    <service.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-gray-500">
                      {service.description}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {service.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <div className="mt-4 space-y-1">
              {loadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={22} className="animate-spin text-red-light" />
                </div>
              ) : notificationError ? (
                <div className="flex items-center gap-2 rounded-lg border border-red-light/10 bg-red-light/5 px-3 py-4 text-sm text-red-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{notificationError}</span>
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-6 text-center">
                  <Bell size={24} className="mx-auto text-gray-600" />
                  <p className="mt-2 text-sm text-gray-500">
                    No recent notifications
                  </p>
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-center border-b border-red-light/5 shadow-md gap-3 rounded-lg px-2 py-2.5 transform transition-all hover:-translate-y-1 hover:bg-white/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-light/10 text-red-light/80">
                      <Bell size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {notification.title || "Notification"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {notification.message || "No message"}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-medium text-gray-500">
                      {formatNotificationDate(notification.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
