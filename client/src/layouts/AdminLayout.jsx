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
  Search,
  Settings,
  ShieldCheck,
  Wallet,
  X,
  Users,
  BarChart3,
  Activity,
  Flag,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import useAuth from "../store/useAuth";

const adminNavItems = [
  { label: "Dashboard", to: "/a/dashboard", icon: Gauge },
  { label: "Analytics", to: "/a/analytics", icon: BarChart3 },
  { label: "Users", to: "/a/users", icon: Users },
  { label: "Transactions", to: "/a/transactions", icon: CreditCard },
  { label: "Numbers", to: "/a/numbers", icon: Phone },
  { label: "Logs", to: "/a/logs", icon: Activity },
  { label: "Reports", to: "/a/reports", icon: Flag },
  { label: "Settings", to: "/a/settings", icon: Settings },
];

const adminSidebarConfig = {
  navItems: adminNavItems,
  workspaceLabel: "Admin workspace",
  statusTitle: "Admin access",
  statusDescription:
    "Manage users, monitor transactions, and oversee system operations.",
  StatusIcon: ShieldCheck,
};

const adminFallback = {
  name: "Admin User",
  email: "admin@smswinners.com",
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearAuth } = useAuth(); // Move this BEFORE using user
  const navigate = useNavigate();
  
  const profile = user?.data || user || adminFallback;

  const initial = (profile.name || profile.email || "A")
    .slice(0, 1)
    .toUpperCase();
  const displayName = profile.username || profile.name || adminFallback.name;
  const displayEmail = profile.email || adminFallback.email;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-white">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
        <Sidebar
          {...adminSidebarConfig}
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
              {...adminSidebarConfig}
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
                  placeholder="Search users, transactions, numbers..."
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
                onClick={handleLogout}
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

export default AdminLayout;