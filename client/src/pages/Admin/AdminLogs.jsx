import React, { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle,
  Save,
  X,
  Tag,
  TrendingUp,
  Shield,
} from "lucide-react";
import { createLog, getLogs, updateLog, deleteLog } from "../../service/logs";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    description: "",
    category: "",
    type: "standard",
    price: "",
    cost: "",
    status: "active",
    data: "",
    image: "",
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLogs();
      console.log("Logs data:", data);
      
      // Fix: Access logs array correctly based on your response structure
      const logsArray = data?.logs || data?.data?.logs || data || [];
      setLogs(logsArray);
      setFilteredLogs(logsArray);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = async () => {
    if (!formData.title && !formData.name) {
      setError("Please enter a title/name for the log");
      return;
    }

    try {
      setActionLoading("create");
      setError("");
      setSuccess("");
      
      const payload = {
        title: formData.title || formData.name,
        name: formData.name || formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        status: formData.status,
        data: formData.data,
        image: formData.image,
      };
      
      await createLog(payload);
      setSuccess("Log created successfully!");
      resetForm();
      setIsModalOpen(false);
      await fetchLogs();
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to create log");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleUpdateLog = async () => {
    if (!selectedLog?._id && !selectedLog?.id) {
      setError("Invalid log ID");
      return;
    }

    try {
      setActionLoading("update");
      setError("");
      setSuccess("");
      
      const payload = {
        title: formData.title || formData.name,
        name: formData.name || formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        status: formData.status,
        data: formData.data,
        image: formData.image,
      };
      
      await updateLog(selectedLog._id || selectedLog.id, payload);
      setSuccess("Log updated successfully!");
      resetForm();
      setIsModalOpen(false);
      await fetchLogs();
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to update log");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");
      setSuccess("");
      
      await deleteLog(id);
      setSuccess("Log deleted successfully!");
      await fetchLogs();
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to delete log");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setSelectedLog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    setSelectedLog(log);
    setFormData({
      title: log.title || log.name || "",
      name: log.name || log.title || "",
      description: log.description || "",
      category: log.category || "",
      type: log.type || "standard",
      price: log.price || log.cost || "",
      cost: log.cost || log.price || "",
      status: log.status || "active",
      data: typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : (log.data || ""),
      image: log.image || "",
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openViewModal = (log) => {
    setSelectedLog(log);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      description: "",
      category: "",
      type: "standard",
      price: "",
      cost: "",
      status: "active",
      data: "",
      image: "",
    });
  };

  useEffect(() => {
    let filtered = [...logs];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          (log.title && log.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.name && log.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.category && log.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter);
    }
    
    setFilteredLogs(filtered);
  }, [searchTerm, typeFilter, logs]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalLogs = logs.length;
  const premiumLogs = logs.filter((l) => l.type === "premium").length;
  const standardLogs = logs.filter((l) => l.type === "standard").length;
  const activeLogs = logs.filter((l) => l.status === "active").length;

  const stats = [
    {
      label: "Total Logs",
      value: totalLogs,
      change: "All time",
      icon: FileText,
      iconBg: "bg-red/15",
      iconColor: "text-red",
    },
    {
      label: "Premium Logs",
      value: premiumLogs,
      change: `${totalLogs > 0 ? ((premiumLogs / totalLogs) * 100).toFixed(1) : 0}% of total`,
      icon: TrendingUp,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
    },
    {
      label: "Standard Logs",
      value: standardLogs,
      change: `${totalLogs > 0 ? ((standardLogs / totalLogs) * 100).toFixed(1) : 0}% of total`,
      icon: FileText,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
    {
      label: "Active Logs",
      value: activeLogs,
      change: "Available for purchase",
      icon: CheckCircle,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-dark/40 via-black to-black p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-300">
              <Shield size={13} />
              Admin Logs Management
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Manage logs & data entries
              <br className="hidden sm:block" /> create, edit, and delete.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Full CRUD operations for logs. Create new logs, update existing ones, or remove outdated entries.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-red-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-red-light active:bg-red-dark"
          >
            <Plus size={16} />
            Create New Log
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
              <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-widest text-gray-500">
              {stat.label}
            </p>
            {/* FIXED: Changed from <p> to <div> to prevent nesting error */}
            <div className="mt-1 text-2xl font-bold tracking-tight text-white">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-white/10"></div>
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search logs by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              typeFilter === "all"
                ? " text-red-light border border-red-light bg-red-light/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            All ({totalLogs})
          </button>
          <button
            onClick={() => setTypeFilter("premium")}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              typeFilter === "premium"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            Premium ({premiumLogs})
          </button>
          <button
            onClick={() => setTypeFilter("standard")}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              typeFilter === "standard"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            Standard ({standardLogs})
          </button>
          <button
            onClick={fetchLogs}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 shadow-md bg-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-1 flex-col py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-light" />
            <p className="text-white text-[12px]">Loading Logs....</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-red-light/10 p-4 text-red-400 m-4">
            <AlertCircle size={20} />
            {error}
            <button
              onClick={fetchLogs}
              className="ml-2 rounded-lg bg-red-light/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-light/30"
            >
              Retry
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-white mb-4" />
            <h3 className="text-lg font-semibold text-white">No logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search" : "Create your first log to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-black/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Log</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLogs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-light/10 text-red-light">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{log.title || log.name || "Untitled"}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {log.description?.substring(0, 60) || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-gray-300">
                        <Tag size={10} />
                        {log.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          log.type === "premium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {log.type === "premium" ? "Premium" : "Standard"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-gray-500" />
                        <span className="text-sm font-semibold text-white">
                          {log.price || log.cost || "0.00"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          log.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-light/20 text-red-light"
                        }`}
                      >
                        {log.status === "active" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {log.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        {log.createdAt || log.created_at
                          ? new Date(log.createdAt || log.created_at).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(log)}
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(log)}
                          className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-1.5 text-blue-400 transition-colors hover:bg-blue-500/20"
                          title="Edit Log"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log._id || log.id)}
                          disabled={actionLoading === (log._id || log.id)}
                          className="rounded-lg border border-red-bg-red-light/20 bg-red-light/10 p-1.5 text-red-light transition-colors hover:bg-red-light/20 disabled:opacity-50"
                          title="Delete Log"
                        >
                          {actionLoading === (log._id || log.id) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal content remains the same */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-black/80 p-4 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">
                {modalMode === "create" && "Create New Log"}
                {modalMode === "edit" && "Edit Log"}
                {modalMode === "view" && "Log Details"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {modalMode === "view" && selectedLog ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-light/10 text-red-400">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedLog.title || selectedLog.name}</h3>
                      <p className="text-sm text-gray-400">ID: {selectedLog._id || selectedLog.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm text-white mt-1">{selectedLog.category || "Uncategorized"}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm text-white mt-1 capitalize">{selectedLog.type || "Standard"}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm text-white mt-1">${selectedLog.price || selectedLog.cost || "0.00"}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Status</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          selectedLog.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-light/20 text-red-400"
                        }`}>
                          {selectedLog.status === "active" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {selectedLog.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedLog.createdAt || selectedLog.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedLog.updatedAt || selectedLog.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm text-white mt-1">{selectedLog.description || "No description"}</p>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => openEditModal(selectedLog)}
                      className="flex-1 rounded-lg bg-blue-500/20 py-2.5 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/30 border border-blue-500/20"
                    >
                      <Edit size={16} className="inline mr-2" />
                      Edit Log
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Title / Name *</label>
                      <input
                        type="text"
                        value={formData.title || formData.name}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                        placeholder="Enter log title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                        placeholder="e.g., Social Media, Gaming, Finance"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                      >
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value, cost: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Image URL (Optional)</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                      placeholder="Describe what this log contains..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Log Data (JSON format - Optional)</label>
                    <textarea
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      rows={6}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white font-mono focus:border-red-bg-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-bg-red-light/50"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={modalMode === "create" ? handleCreateLog : handleUpdateLog}
                      disabled={actionLoading === "create" || actionLoading === "update"}
                      className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-light disabled:opacity-50"
                    >
                      {actionLoading === "create" || actionLoading === "update" ? (
                        <Loader2 size={16} className="mx-auto animate-spin" />
                      ) : (
                        <>
                          <Save size={16} className="inline mr-2" />
                          {modalMode === "create" ? "Create Log" : "Save Changes"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-500/90 px-4 py-3 text-sm font-medium text-white shadow-lg animate-in slide-in-from-right-5">
          <CheckCircle size={16} />
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
}