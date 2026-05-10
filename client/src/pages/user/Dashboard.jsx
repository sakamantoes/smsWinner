import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Wallet Balance",
    value: "NGN 48,250",
    change: "Ready to spend",
    icon: Wallet,
    iconBg: "bg-red/15",
    iconColor: "text-red",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
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

const activeSessions = [
  {
    service: "WhatsApp",
    country: "United States",
    number: "+1 415 982 1044",
    status: "Waiting for OTP",
    code: "08:42",
    received: false,
  },
  {
    service: "Telegram",
    country: "United Kingdom",
    number: "+44 7403 931 225",
    status: "Code received",
    code: "452981",
    received: true,
  },
  {
    service: "Google",
    country: "Canada",
    number: "+1 647 812 5590",
    status: "Pending activation",
    code: "11:07",
    received: false,
  },
];

const serviceCards = [
  {
    title: "Available Phone Numbers",
    description:
      "Buy SMS-capable numbers listed by admin for app verification.",
    meta: "86 countries in stock",
    icon: Smartphone,
  },
  {
    title: "Virtual Email Accounts",
    description:
      "Purchase fresh inboxes for signup, confirmation, and recovery links.",
    meta: "Bulk purchase ready",
    icon: Mail,
  },
  {
    title: "OTP Inbox",
    description:
      "Receive codes from purchased numbers and track completed orders.",
    meta: "Auto-refresh enabled",
    icon: ShieldCheck,
  },
];

const recentActivity = [
  {
    title: "Received OTP for Telegram",
    detail: "UK number ending in 1225",
    amount: "-NGN 420",
    direction: "down",
  },
  {
    title: "Wallet funded",
    detail: "Card payment completed",
    amount: "+NGN 15,000",
    direction: "up",
  },
  {
    title: "Virtual email created",
    detail: "inbox-7284@smswinners.mail",
    amount: "-NGN 85",
    direction: "down",
  },
];

const quickActions = [
  { label: "Fund Account", icon: CreditCard },
  { label: "Buy Number", icon: Phone },
  { label: "Buy Email", icon: Mail },
  { label: "Refresh OTP", icon: RefreshCw },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-6 text-white sm:p-8">
        {/* subtle radial glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
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
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-red-dark/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-500 active:bg-red-700"
          >
            <Wallet size={16} />
            Fund Account
          </button>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* ── Main grid ── */}
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              Quick Actions
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Fund Account") {
                      navigate("/f/fund-account", {
                        state: { from: "/f/dashboard" },
                      });
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

          {/* Active OTP sessions */}
          <div className="overflow-hidden rounded-xl border border-red-light/10 shadow-md bg-white/5">
            <div className="flex items-center justify-between border-b border-red-light/10 shadow-md px-5 py-4">
              <div>
                <h2 className="font-semibold text-white">
                  Active OTP Sessions
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Purchased numbers waiting for codes
                </p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 shadow-md px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-red-500/30 hover:bg-red-500/8">
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>

            <div className="divide-y divide-red-light/10">
              {activeSessions.map((session) => (
                <div
                  key={session.number}
                  className="flex flex-col gap-3 px-5 py-4 hover:bg-white/5 sm:flex-row sm:items-center sm:gap-4 transform transition-all hover:-translate-y-1"
                >
                  {/* Service + number */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">
                        {session.service}
                      </span>
                      <span className="rounded-full border border-white/10 shadow-md bg-red-light/10 px-2 py-0.5 text-[11px] font-medium text-red">
                        {session.country}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                      {session.number}
                      <button
                        aria-label="Copy number"
                        className="rounded p-0.5 text-gray-600 transition-colors hover:text-gray-300"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {session.received ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <Clock3 size={14} className="text-amber-500" />
                    )}
                    <span
                      className={
                        session.received ? "text-emerald-400" : "text-gray-400"
                      }
                    >
                      {session.status}
                    </span>
                  </div>

                  {/* Code / time */}
                  <div className="w-24 shrink-0 rounded-lg border border-red-light/10 shadow-md bg-black/40 px-3 py-2 text-center font-mono text-sm font-bold tracking-widest text-white">
                    {session.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Available services */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="font-semibold text-white">Available Services</h2>
            <div className="mt-4 space-y-2.5">
              {serviceCards.map((service) => (
                <div
                  key={service.title}
                  className="group flex gap-3 rounded-xl border border-red-light/10 shadow-md bg-black/20 p-4 transform transition-all hover:-translate-y-1  hover:border-red-light/40 hover:bg-red-light/5"
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

          {/* Recent activity */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-5">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <div className="mt-4 space-y-1">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center border-b border-red-light/5 shadow-md gap-3 rounded-lg px-2 py-2.5 transform transition-all hover:-translate-y-1 hover:bg-white/5"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      item.direction === "up"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-light/10 text-red-light/80"
                    }`}
                  >
                    {item.direction === "up" ? (
                      <ArrowUpRight size={15} />
                    ) : (
                      <ArrowDownRight size={15} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {item.detail}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      item.direction === "up"
                        ? "text-emerald-400"
                        : "text-gray-300"
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
