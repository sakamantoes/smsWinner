import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
import NotificationBell from "../components/NotificationBell";

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
  const { user, clearAuth } = useAuth();
  const profile = user?.data || user || userFallback;
  const navigate = useNavigate();

  const initial = (profile.name || profile.email || "U")
    .slice(0, 1)
    .toUpperCase();
  const displayName = profile.username || profile.name || userFallback.name;
  const displayEmail = profile.email || userFallback.email;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
        <Sidebar
          {...userSidebarConfig}
          userRole="user"
          supportLabel="Support"
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
              userRole="user"
              supportLabel="Support"
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="relative min-h-screen lg:pl-72">
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
                className="flex h-10 w-10 shrink-0 items-center text-white justify-center rounded-lg border border-white/30 transition-colors hover:bg-white/10 lg:hidden"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div
                role="search"
                className="hidden h-10 w-full max-w-lg items-center gap-2 rounded-lg border border-white/30 bg-black/40 px-3 text-gray-400 transition-colors hover:border-red-light/30 md:flex"
              >
                <Search size={16} className="shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search numbers, emails, countries, OTP codes"
                  className="w-full select-none truncate bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right: notifications + user + logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />

              <div className="hidden items-center gap-3 border-l border-white/30 pl-3 sm:flex">
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-sm font-bold text-white"
                >
                  {initial}
                </div>
                <div className="w-32 lg:w-40">
                  <p className="truncate text-sm font-semibold leading-tight text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs leading-tight text-gray-400">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Log out"
                onClick={handleLogout}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
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