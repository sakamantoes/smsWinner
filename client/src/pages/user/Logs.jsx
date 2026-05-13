import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ShoppingBag,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  DollarSign,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { getLogs, buyLog, getUserPurchasedApi } from "../../service/logs";
import WalletBalanceCard from "../../components/WalletBalanceCard.jsx";

const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("available"); // available, history
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ================= FETCH LOGS =================
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs();
      console.log("Logs data:", data);
      setLogs(data.logs || data.data || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH PURCHASE HISTORY =================
  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserPurchasedApi();
      console.log("Purchase history data:", data);
      setPurchaseHistory(data.purchases || data.data || []);
    } catch (error) {
      console.log(error);
      // If endpoint doesn't exist yet, set empty array
      setPurchaseHistory([]);
    }
  };

  // ================= BUY LOG =================
  const handleBuyLog = async (id, price) => {
    if (!window.confirm(`Are you sure you want to purchase this log for $${price}?`)) {
      return;
    }

    try {
      setBuyingId(id);
      setError("");
      setSuccess("");
      
      const res = await buyLog(id);
      console.log("Purchase response:", res);
      
      setSuccess("Log purchased successfully!");
      
      // Refresh both lists
      await fetchLogs();
      await fetchPurchaseHistory();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess("");
        setSelectedLog(null);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to purchase log");
    } finally {
      setBuyingId(null);
    }
  };

  // ================= VIEW LOG DETAILS =================
  const handleViewDetails = async (id) => {
    try {
      setLoading(true);
      const data = await getLogById(id);
      setSelectedLog(data.log || data.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load log details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchPurchaseHistory();
  }, []);

  // Filter logs based on search and type
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = searchTerm === "" || 
      (log.title && log.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.category && log.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === "all" || log.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const totalLogs = logs.length;
  const purchasedCount = purchaseHistory.length;
  const totalSpent = purchaseHistory.reduce((sum, item) => sum + (item.price || 0), 0);

  const stats = [
    {
      label: "Available Logs",
      value: totalLogs,
      change: "Ready to purchase",
      icon: FileText,
      iconBg: "bg-red/15",
      iconColor: "text-red",
    },
    {
      label: "Purchased Logs",
      value: purchasedCount,
      change: "In your collection",
      icon: ShoppingBag,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Spent",
      value: `NGN ${totalSpent.toFixed(2)}`,
      change: "All time",
      icon: DollarSign,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-300">
              <FileText size={13} />
              Logs Marketplace
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Browse and purchase
              <br className="hidden sm:block" /> premium logs & data.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Access verified logs, user data, and activity records. Purchase individual logs or buy in bulk for better rates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/f/fund-account", { state: { from: "/f/dashboard" } })}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-red-dark/40 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-light active:bg-red-700"
          >
            <Wallet size={16} />
            Fund Wallet
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <WalletBalanceCard statusText="Available" />

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/10 shadow-md bg-white/5 p-5 transition-all transform hover:-translate-y-1 hover:border-red-light/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
              >
                <stat.icon size={19} />
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  stat.changeBg || "bg-white/8 text-gray-300 border-white/10"
                }`}
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === "available"
              ? "text-red-light border-b-2 border-red-light"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Available Logs
          {totalLogs > 0 && activeTab !== "available" && (
            <span className="ml-2 rounded-full bg-red-light/20 px-1.5 py-0.5 text-xs text-red-400">
              {totalLogs}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === "history"
              ? "text-red-light border-b-2 border-red-light"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Purchase History
          {purchasedCount > 0 && activeTab !== "history" && (
            <span className="ml-2 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400">
              {purchasedCount}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filter Bar - Only show for available logs */}
      {activeTab === "available" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filterType === "all"
                  ? "bg-red-light/20 text-white border border-red-light/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("premium")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filterType === "premium"
                  ? "bg-red-light/20 text-white border border-red-light/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setFilterType("standard")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filterType === "standard"
                  ? "bg-red-light/20 text-white border border-red-light/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              Standard
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activeTab === "available" ? (
        /* Available Logs Grid */
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-red-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-red-light/10 p-4 text-red-400">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white">No logs available</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search or filter" : "Check back later for new logs"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLogs.map((log) => (
                <div
                  key={log._id}
                  className="group rounded-xl border border-white/10 shadow-md bg-white/5 p-5 transition-all transform hover:-translate-y-1 hover:border-red-light/40 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-light/10 text-red-400">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{log.title || log.name}</h3>
                        <p className="text-xs text-gray-500">{log.category || "General"}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      log.type === "premium" 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {log.type || "Standard"}
                    </span>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                    {log.description || "No description available"}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-gray-500">#</p>
                      <span className="text-lg font-bold text-white">
                        {log.price || log.cost || "0.00"}
                      </span>
                      <span className="text-xs text-gray-500">NGN</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(log._id)}
                        className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleBuyLog(log._id, log.price)}
                        disabled={buyingId === log._id}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-light disabled:opacity-50"
                      >
                        {buyingId === log._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <ShoppingBag size={12} />
                        )}
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Purchase History */
        <div className="space-y-4">
          {purchaseHistory.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-white">No purchase history</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't purchased any logs yet
              </p>
              <button
                onClick={() => setActiveTab("available")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-light"
              >
                Browse Logs
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 shadow-md bg-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10 bg-black/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Log</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Purchase Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {purchaseHistory.map((purchase) => (
                      <tr key={purchaselog._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-white">{purchase.title || purchase.log_title}</p>
                            <p className="text-xs text-gray-500">{purchase.category || "Log"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          {new Date(purchase.created_at || purchase.purchase_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-emerald-400">
                            ${purchase.price}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                            <CheckCircle2 size={10} />
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDetails(purchase.log_id)}
                            className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <Download size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black/80 p-4 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-light/10 text-red-400">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedLog.title || selectedLog.name}</h3>
                  <p className="text-sm text-gray-400">{selectedLog.category || "General"}</p>
                </div>
              </div>
              
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-gray-300">{selectedLog.description || "No description available"}</p>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-lg font-bold text-white">
                    ${selectedLog.price || selectedLog.cost}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium text-white capitalize">
                    {selectedLog.type || "Standard"}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(selectedLog.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-xs text-gray-500">Downloads</p>
                  <p className="text-sm font-medium text-white">
                    {selectedLog.downloads || 0}
                  </p>
                </div>
              </div>
              
              {selectedLog.data && (
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Log Data</p>
                  <pre className="max-h-60 overflow-auto rounded bg-black/50 p-3 text-xs text-gray-300">
                    {typeof selectedLog.data === 'object' 
                      ? JSON.stringify(selectedLog.data, null, 2)
                      : selectedLog.data}
                  </pre>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleBuyLog(selectedLoglog._id, selectedLog.price)}
                  disabled={buyingId === selectedLoglog._id}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-light disabled:opacity-50"
                >
                  {buyingId === selectedLoglog._id ? (
                    <Loader2 size={16} className="mx-auto animate-spin" />
                  ) : (
                    `Purchase $${selectedLog.price}`
                  )}
                </button>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Toasts */}
      {success && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-500/90 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-right-5">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}
      
      {error && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-red-light/90 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-right-5">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default Logs;
