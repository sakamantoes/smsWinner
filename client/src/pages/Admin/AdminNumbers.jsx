import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MapPin,
  Package,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAvailableServices } from "../../service/number";
import { formatCurrency } from "../../utils/transaction.js";

const serviceNames = {
  go: "Google / Gmail",
  ig: "Instagram",
  wa: "WhatsApp",
};

const formatServiceName = (code) =>
  serviceNames[String(code || "").toLowerCase()] ||
  String(code || "Unknown").toUpperCase();

const normalizeCatalog = (response) => {
  const services = Array.isArray(response?.data) ? response.data : [];

  return services
    .filter((item) => item?.service && item?.country)
    .map((item) => ({
      id: item._id || `${item.provider}-${item.country}-${item.service}`,
      service: item.service,
      serviceName: formatServiceName(item.service),
      country: item.country,
      countryName: item.countryName || `Country ${item.country}`,
      provider: item.provider || "Auto",
      stock: Number(item.stock || 0),
      price: Number(item.sellingPrice || 0),
      updatedAt: item.lastFetchedAt || item.updatedAt,
    }))
    .sort((a, b) => {
      const serviceSort = a.serviceName.localeCompare(b.serviceName);
      if (serviceSort !== 0) return serviceSort;
      return a.countryName.localeCompare(b.countryName);
    });
};

export default function AdminNumbers() {
  const [catalog, setCatalog] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoadingCatalog(true);
      setError("");

      const response = await getAvailableServices();
      const nextCatalog = normalizeCatalog(response);
      setCatalog(nextCatalog);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError(err?.response?.data?.message || "Failed to load services");
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const serviceOptions = useMemo(() => {
    const services = new Map();
    catalog.forEach((item) => {
      if (!services.has(item.service)) {
        services.set(item.service, {
          code: item.service,
          name: item.serviceName,
          stock: 0,
          countries: new Set(),
        });
      }

      const service = services.get(item.service);
      service.stock += item.stock;
      service.countries.add(item.country);
    });

    return Array.from(services.values()).map((item) => ({
      ...item,
      countries: item.countries.size,
    }));
  }, [catalog]);

  const filteredListings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return catalog.filter((item) => {
      const matchesService =
        !selectedService || item.service === selectedService;
      const matchesSearch =
        !search ||
        item.countryName.toLowerCase().includes(search) ||
        item.provider.toLowerCase().includes(search) ||
        item.serviceName.toLowerCase().includes(search);

      return matchesService && matchesSearch;
    });
  }, [catalog, searchTerm, selectedService]);

  const totalStock = catalog.reduce((sum, item) => sum + item.stock, 0);
  const activeCountries = new Set(catalog.map((item) => item.country)).size;
  const totalServices = serviceOptions.length;
  const averagePrice = catalog.length > 0 
    ? catalog.reduce((sum, item) => sum + item.price, 0) / catalog.length 
    : 0;

  const stats = [
    {
      label: "Total Services",
      value: totalServices,
      change: "Available",
      icon: Server,
      iconBg: "bg-red/15",
      iconColor: "text-red",
    },
    {
      label: "Active Countries",
      value: activeCountries,
      change: `${totalStock} total numbers`,
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      changeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Average Price",
      value: averagePrice === 0 ? "N/A" : formatCurrency(averagePrice),
      change: "Per number",
      icon: DollarSign,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-red-dark/40 via-black to-black p-6 text-white shadow-md sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-light">
            <Smartphone size={13} />
            Number Inventory Management
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Admin Numbers
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
            View and manage all available number stocks across different services and countries.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-3 md:grid-cols-3">
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
                className={`rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium text-center ${
                  stat.changeBg || "bg-white/10 text-gray-300 border-white/10"
                }`}
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

      {/* Filters */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Filter by Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-4 text-sm text-white transition-all focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50"
              >
                <option value="">All Services</option>
                {serviceOptions.map((service) => (
                  <option key={service.code} value={service.code}>
                    {service.name} ({service.countries} countries)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by country, provider, or service..."
                  className="h-11 w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-10 pr-4 text-sm text-white transition-all placeholder:text-gray-600 focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchServices()}
            disabled={loadingCatalog}
            className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-gray-400 transition-colors hover:border-red-light/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto"
          >
            <RefreshCw size={16} className={loadingCatalog ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="rounded-xl border border-white/10 bg-white/5 shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Number Inventory</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {filteredListings.length} listing{filteredListings.length === 1 ? "" : "s"} found
            </p>
          </div>
          {loadingCatalog && (
            <Loader2 size={18} className="animate-spin text-red-light" />
          )}
        </div>

        {loadingCatalog ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-red-light" />
          </div>
        ) : error ? (
          <div className="mx-5 my-8 flex items-start gap-2 rounded-lg border border-red-light/20 bg-red-light/10 p-4 text-sm text-red-light">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Package size={42} className="mx-auto text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-white">
              No listings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or refresh the list.
            </p>
          </div>
        ) : (
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-all hover:-translate-y-1 hover:border-red-light/30 hover:bg-white/5"
                >
                  {/* Service Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-light/10 px-2.5 py-1 text-xs font-semibold text-red-light">
                      <Smartphone size={12} />
                      {item.serviceName}
                    </span>
                  </div>

                  {/* Country */}
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-gray-500" />
                    <p className="text-sm font-semibold text-white">
                      {item.countryName}
                    </p>
                  </div>

                  {/* Provider */}
                  <p className="mb-3 text-xs text-gray-500">
                    Provider: {item.provider}
                  </p>

                  {/* Stock and Price */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Package size={12} className="text-emerald-400" />
                      <span className="text-xs font-medium text-gray-300">
                        Stock: {item.stock}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                     
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  {item.updatedAt && (
                    <p className="mt-2 text-[10px] text-gray-600">
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}