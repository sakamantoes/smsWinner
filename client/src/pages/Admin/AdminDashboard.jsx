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
  Users,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Activity,
  Server,
  UserCheck,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Total Users",
    value: "2,847",
    change: "+124 this month",
    icon: Users,
    iconBg: "bg-red/15",
    iconColor: "text-red",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
  {
    label: "Active Sessions",
    value: "1,293",
    change: "86% utilization",
    icon: Activity,
    iconBg: "bg-gradient-to-br from-red/50 to-red/20",
    iconColor: "text-white",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
  {
    label: "Total Revenue",
    value: "NGN 2.4M",
    change: "+18.2% vs last month",
    icon: DollarSign,
    iconBg: "bg-white/10",
    iconColor: "text-gray-200",
    changeBg: "bg-white/8 text-gray-300 border-white/10",
  },
  {
    label: "System Health",
    value: "99.97%",
    change: "All systems operational",
    icon: Server,
    iconBg: "bg-red/15",
    iconColor: "text-red/90",
    changeBg: "bg-red/10 text-red border-white/10 shadow-md",
  },
];

const activeSessions = [
  {
    user: "John Doe",
    service: "WhatsApp",
    country: "United States",
    number: "+1 415 982 1044",
    status: "Waiting for OTP",
    time: "08:42",
    received: false,
  },
  {
    user: "Jane Smith",
    service: "Telegram",
    country: "United Kingdom",
    number: "+44 7403 931 225",
    status: "Code received",
    time: "452981",
    received: true,
  },
  {
    user: "Mike Johnson",
    service: "Google",
    country: "Canada",
    number: "+1 647 812 5590",
    status: "Pending activation",
    time: "11:07",
    received: false,
  },
  {
    user: "Sarah Williams",
    service: "Microsoft",
    country: "Australia",
    number: "+61 412 345 678",
    status: "Waiting for OTP",
    time: "05:23",
    received: false,
  },
];

const serviceCards = [
  {
    title: "Available Numbers Stock",
    description: "Manage SMS-capable numbers inventory across 86 countries.",
    meta: "12,847 numbers available",
    icon: Smartphone,
  },
  {
    title: "Email Accounts Stock",
    description: "Monitor virtual email inventory and bulk purchase orders.",
    meta: "3,421 emails in stock",
    icon: Mail,
  },
  {
    title: "System Security",
    description: "Monitor API keys, rate limits, and security protocols.",
    meta: "All systems protected",
    icon: ShieldCheck,
  },
];

const recentActivity = [
  {
    title: "New user registered",
    detail: "user@example.com - Premium plan",
    amount: "+NGN 15,000",
    direction: "up",
  },
  {
    title: "Number purchase failed",
    detail: "US number - Insufficient funds",
    amount: "Refunded",
    direction: "down",
  },
  {
    title: "Bulk email order",
    detail: "50 emails - Corporate client",
    amount: "+NGN 4,250",
    direction: "up",
  },
  {
    title: "Suspicious activity detected",
    detail: "Multiple failed logins from IP",
    amount: "Flagged",
    direction: "down",
  },
  {
    title: "API rate limit hit",
    detail: "User: john_doe - 1000 requests/min",
    amount: "Throttled",
    direction: "down",
  },
];

const quickActions = [
  { label: "Manage Users", icon: Users, path: "/a/users" },
  { label: "View Reports", icon: BarChart3, path: "/a/reports" },
  { label: "Add Numbers", icon: Phone, path: "/a/numbers" },
  { label: "System Logs", icon: Activity, path: "/a/logs" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-4 sm:p-6 md:p-8 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-red-300">
              <ShieldCheck size={11} className="sm:w-[13px] sm:h-[13px]" />
              Admin Control Panel
            </div>
            <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Monitor users, transactions,
              <br className="hidden xs:block sm:block" /> and system performance.
            </h1>
            <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-gray-400">
              Manage user accounts, track revenue, oversee number/email stock,
              and monitor system health metrics in real-time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/a/users")}
              className="inline-flex h-9 sm:h-11 shrink-0 items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-red-dark/40 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-light active:bg-red-dark"
            >
              <Users size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Manage Users</span>
              <span className="xs:hidden">Users</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/a/reports")}
              className="inline-flex h-9 sm:h-11 shrink-0 items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-white/20 px-3 sm:px-5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <BarChart3 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Analytics</span>
              <span className="xs:hidden">Reports</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/10 shadow-md bg-white/5 p-4 sm:p-5 transition-all transform hover:-translate-y-1 hover:border-red-light/40 hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
              >
                <stat.icon size={16} className="sm:w-[19px] sm:h-[19px]" />
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium text-center ${stat.changeBg}`}
              >
                {stat.change}
              </span>
            </div>
            <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-gray-500">
              {stat.label}
            </p>
            <p className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Main grid ── */}
      <section className="grid gap-4 sm:gap-5 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Left column */}
        <div className="space-y-4 sm:space-y-5">
          {/* Quick actions */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-4 sm:p-5">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-400">
              Admin Quick Actions
            </h2>
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3 xs:grid-cols-4">
              {quickActions.map(({ label, icon: Icon, path }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-red-light/10 shadow-md bg-black/20 py-3 sm:py-5 px-2 text-center transition-all hover:border-red-light/30 hover:bg-red-light/10 active:scale-105"
                >
                  <Icon size={16} className="sm:w-5 sm:h-5 text-white/40" />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-300 text-center leading-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active sessions monitoring */}
          <div className="overflow-hidden rounded-xl border border-red-light/10 shadow-md bg-white/5">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border-b border-red-light/10 shadow-md px-4 sm:px-5 py-3 sm:py-4">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Active User Sessions
                </h2>
                <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500">
                  Real-time OTP requests and number activations
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 rounded-lg border border-white/10 shadow-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-gray-300 transition-colors hover:border-red-light/30 hover:bg-red-light/8">
                  <UserCheck size={11} className="sm:w-[13px] sm:h-[13px]" />
                  <span className="hidden xs:inline">Filter</span>
                </button>
                <button className="flex items-center gap-1 rounded-lg border border-white/10 shadow-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold text-gray-300 transition-colors hover:border-red-light/30 hover:bg-red-light/8">
                  <RefreshCw size={11} className="sm:w-[13px] sm:h-[13px]" />
                  <span className="hidden xs:inline">Refresh</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-red-light/10">
              {activeSessions.map((session) => (
                <div
                  key={session.number}
                  className="flex flex-col gap-2 px-4 sm:px-5 py-3 sm:py-4 hover:bg-white/5 transition-all"
                >
                  {/* User + service */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {session.user}
                      </span>
                      <span className="rounded-full border border-white/10 shadow-md bg-red-light/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[11px] font-medium text-red">
                        {session.service}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <span className="break-all">{session.number}</span>
                      <button
                        aria-label="Copy number"
                        className="rounded p-0.5 text-gray-600 transition-colors hover:text-gray-300"
                      >
                        <Copy size={11} className="sm:w-[13px] sm:h-[13px]" />
                      </button>
                    </div>
                    <div className="mt-0.5 text-[10px] sm:text-xs text-gray-600">
                      {session.country}
                    </div>
                  </div>

                  {/* Status and code row */}
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium">
                      {session.received ? (
                        <CheckCircle2 size={12} className="sm:w-[14px] sm:h-[14px] text-emerald-500" />
                      ) : (
                        <Clock3 size={12} className="sm:w-[14px] sm:h-[14px] text-amber-500" />
                      )}
                      <span
                        className={
                          session.received ? "text-emerald-400" : "text-gray-400"
                        }
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="shrink-0 rounded-lg border border-red-light/10 shadow-md bg-black/40 px-2 sm:px-3 py-1.5 sm:py-2 text-center font-mono text-xs sm:text-sm font-bold tracking-widest text-white">
                      {session.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 sm:space-y-5">
          {/* System inventory */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-white">
              System Inventory
            </h2>
            <div className="mt-3 sm:mt-4 space-y-2.5">
              {serviceCards.map((service) => (
                <div
                  key={service.title}
                  className="group flex gap-3 rounded-xl border border-red-light/10 shadow-md bg-black/20 p-3 sm:p-4 transition-all hover:-translate-y-1 hover:border-red-light/40 hover:bg-red-light/5"
                >
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-red-light/10 text-red transition-colors group-hover:bg-red-light/20">
                    <service.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {service.title}
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-xs leading-4 sm:leading-5 text-gray-500">
                      {service.description}
                    </p>
                    <p className="mt-1 text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      {service.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity / alerts */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-semibold text-white">
                System Alerts & Activity
              </h2>
              <AlertTriangle size={12} className="sm:w-[14px] sm:h-[14px] text-amber-500" />
            </div>
            <div className="mt-3 sm:mt-4 space-y-1">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-2 sm:gap-3 border-b border-red-light/5 shadow-md rounded-lg px-2 py-2 sm:py-2.5 transition-all hover:-translate-y-1 hover:bg-white/5"
                >
                  <div
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${
                      item.direction === "up"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-light/10 text-red-light/80"
                    }`}
                  >
                    {item.direction === "up" ? (
                      <ArrowUpRight size={13} className="sm:w-[15px] sm:h-[15px]" />
                    ) : (
                      <ArrowDownRight size={13} className="sm:w-[15px] sm:h-[15px]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="truncate text-[10px] sm:text-xs text-gray-500">
                      {item.detail}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-[10px] sm:text-xs font-semibold tabular-nums ${
                      item.direction === "up"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="rounded-xl border border-red-light/10 shadow-md bg-white/5 p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Quick Stats
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-lg bg-black/20 p-2 sm:p-3 text-center">
                <UserX size={14} className="sm:w-4 sm:h-4 mx-auto mb-1 text-red-400" />
                <p className="text-xl sm:text-2xl font-bold text-white">14</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Blocked Users</p>
              </div>
              <div className="rounded-lg bg-black/20 p-2 sm:p-3 text-center">
                <Activity size={14} className="sm:w-4 sm:h-4 mx-auto mb-1 text-emerald-400" />
                <p className="text-xl sm:text-2xl font-bold text-white">98.7%</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}