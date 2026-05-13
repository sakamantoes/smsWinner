import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Bell,
  CreditCard,
  Gauge,
  Inbox,
  LogOut,
  Mail,
  Menu,
  Phone,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import useAuth from "../store/useAuth";

const userNavItems = [
  { label: "Dashboard", to: "/f/dashboard", icon: Gauge },
  { label: "Numbers", to: "/f/numbers", icon: Phone },
  { label: "Logs", to: "/f/logs", icon: Mail },
  { label: "OTP Inbox", to: "/f/otp-box", icon: Inbox },
  { label: "Deposits", to: "/f/deposits", icon: CreditCard },
  { label: "Receipts", to: "/f/receipts", icon: ReceiptText },
  { label: "Settings", to: "/f/settings", icon: Settings },
];

const userSidebarConfig = {
  navItems: userNavItems,
  workspaceLabel: "User workspace",
  statusTitle: "Verification ready",
  statusDescription:
    "Buy numbers, receive OTP codes, and keep every activation organized.",
  StatusIcon: ShieldCheck,
};

const userFallback = {
  name: "Verified User",
  email: "user@smswinners.com",
};

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const profile = user?.data || user || userFallback;

  const initial = (profile.name || profile.email || "U")
    .slice(0, 1)
    .toUpperCase();
  const displayName = profile.username || profile.name || userFallback.name;
  const displayEmail = profile.email || userFallback.email;

  return (
    <div className="min-h-screen text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
        <Sidebar 
          {...userSidebarConfig} 
          onNavigate={() => {}} // Desktop navigation doesn't need to close anything
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full">
            <Sidebar
              {...userSidebarConfig}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="relative min-h-screen text-slate-950 lg:pl-72">
        {/* ── Header ── */}
        <header className="sticky top-0 z-30 border-b border-white/30 bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Left: mobile toggle + search */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-slate-800 border-white/30 transition-colors hover:bg-slate-100 lg:hidden"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div
                role="search"
                className="hidden h-10 w-full max-w-lg items-center gap-2 rounded-lg border border-white/30 bg-slate-50 px-3 text-slate-500 transition-colors hover:border-red-light/30 hover:bg-white md:flex"
              >
                <Search size={16} className="shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search numbers, emails, countries, OTP codes"
                  className="w-full select-none truncate text-sm bg-transparent border-none focus:outline-none"
                />
              </div>
            </div>

            {/* Right: notifications + user + logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/30 text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Bell size={18} className="text-white" aria-hidden="true" />
                <span
                  aria-label="Unread notifications"
                  className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-light"
                />
              </button>

              <div className="hidden items-center gap-3 border-l border-white/30 pl-3 sm:flex">
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg bg-gradient-to-br from-red-light to-red-dark text-sm font-bold text-white"
                >
                  {initial}
                </div>
                <div className="w-32 lg:w-40">
                  <p className="truncate text-sm font-semibold leading-tight text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs leading-tight text-slate-500">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Log out"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
