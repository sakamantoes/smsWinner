import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Server,
  DollarSign,
  Clock,
  ShieldCheck,
  Wallet,
  CreditCard,
} from "lucide-react";
import WalletBalanceCard from "../../components/WalletBalanceCard.jsx";

import {
  buyNumber,
  checkOtpStatus,
  getAllCountry,
  getAvailableServices,
} from "../../service/number";

// Helper function to get flag emoji from country code
const getCountryFlag = (countryCode, countryName) => {
  const flags = {
    // Common country codes
    NG: "🇳🇬", US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", AU: "🇦🇺", 
    DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹", PT: "🇵🇹",
    NL: "🇳🇱", BE: "🇧🇪", CH: "🇨🇭", AT: "🇦🇹", SE: "🇸🇪",
    NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", RU: "🇷🇺",
    UA: "🇺🇦", TR: "🇹🇷", AE: "🇦🇪", SA: "🇸🇦", QA: "🇶🇦",
    KW: "🇰🇼", BH: "🇧🇭", OM: "🇴🇲", JO: "🇯🇴", IL: "🇮🇱",
    EG: "🇪🇬", MA: "🇲🇦", DZ: "🇩🇿", TN: "🇹🇳", LY: "🇱🇾",
    ZA: "🇿🇦", KE: "🇰🇪", GH: "🇬🇭", SN: "🇸🇳", CI: "🇨🇮",
    IN: "🇮🇳", PK: "🇵🇰", BD: "🇧🇩", LK: "🇱🇰", NP: "🇳🇵",
    CN: "🇨🇳", JP: "🇯🇵", KR: "🇰🇷", ID: "🇮🇩", MY: "🇲🇾",
    SG: "🇸🇬", PH: "🇵🇭", TH: "🇹🇭", VN: "🇻🇳", KH: "🇰🇭",
    BR: "🇧🇷", AR: "🇦🇷", MX: "🇲🇽", CO: "🇨🇴", CL: "🇨🇱",
    PE: "🇵🇪", VE: "🇻🇪", UY: "🇺🇾", PY: "🇵🇾", BO: "🇧🇴",
    EC: "🇪🇨", CR: "🇨🇷", CU: "🇨🇺", DO: "🇩🇴", PR: "🇵🇷",
  };
  
  // Try to match by country code first
  if (countryCode && flags[countryCode.toUpperCase()]) {
    return flags[countryCode.toUpperCase()];
  }
  
  // Try to match by country name
  const nameMap = {
    "Nigeria": "🇳🇬", "United States": "🇺🇸", "USA": "🇺🇸", "America": "🇺🇸",
    "United Kingdom": "🇬🇧", "UK": "🇬🇧", "Britain": "🇬🇧", "England": "🇬🇧",
    "Canada": "🇨🇦", "Australia": "🇦🇺", "Germany": "🇩🇪", "France": "🇫🇷",
    "Spain": "🇪🇸", "Italy": "🇮🇹", "Portugal": "🇵🇹", "Netherlands": "🇳🇱",
    "Belgium": "🇧🇪", "Switzerland": "🇨🇭", "Austria": "🇦🇹", "Sweden": "🇸🇪",
    "Norway": "🇳🇴", "Denmark": "🇩🇰", "Finland": "🇫🇮", "Poland": "🇵🇱",
    "Russia": "🇷🇺", "Ukraine": "🇺🇦", "Turkey": "🇹🇷", "UAE": "🇦🇪",
    "Saudi Arabia": "🇸🇦", "Qatar": "🇶🇦", "Kuwait": "🇰🇼", "Bahrain": "🇧🇭",
    "Oman": "🇴🇲", "Jordan": "🇯🇴", "Israel": "🇮🇱", "Egypt": "🇪🇬",
    "Morocco": "🇲🇦", "Algeria": "🇩🇿", "Tunisia": "🇹🇳", "Libya": "🇱🇾",
    "South Africa": "🇿🇦", "Kenya": "🇰🇪", "Ghana": "🇬🇭", "Senegal": "🇸🇳",
    "India": "🇮🇳", "Pakistan": "🇵🇰", "Bangladesh": "🇧🇩", "Sri Lanka": "🇱🇰",
    "Nepal": "🇳🇵", "China": "🇨🇳", "Japan": "🇯🇵", "South Korea": "🇰🇷",
    "Indonesia": "🇮🇩", "Malaysia": "🇲🇾", "Singapore": "🇸🇬", "Philippines": "🇵🇭",
    "Thailand": "🇹🇭", "Vietnam": "🇻🇳", "Cambodia": "🇰🇭", "Brazil": "🇧🇷",
    "Argentina": "🇦🇷", "Mexico": "🇲🇽", "Colombia": "🇨🇴", "Chile": "🇨🇱",
    "Peru": "🇵🇪", "Venezuela": "🇻🇪", "Uruguay": "🇺🇾", "Paraguay": "🇵🇾",
    "Bolivia": "🇧🇴", "Ecuador": "🇪🇨", "Costa Rica": "🇨🇷", "Cuba": "🇨🇺",
    "Dominican Republic": "🇩🇴", "Puerto Rico": "🇵🇷",
  };
  
  if (countryName && nameMap[countryName]) {
    return nameMap[countryName];
  }
  
  return "🌍"; // Default globe emoji if no flag found
};

const PhoneNumber = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const [loading, setLoading] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [otp, setOtp] = useState("");
  const [pollingActive, setPollingActive] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH COUNTRIES =================
  const fetchCountries = async () => {
    try {
      const data = await getAllCountry();
      // Add flag property to each country
      const countriesWithFlags = (data.countries || []).map((country) => ({
        ...country,
        flag: getCountryFlag(country.code, country.eng),
      }));
      setCountries(countriesWithFlags);
    } catch (error) {
      console.log(error);
      setError("Failed to load countries");
    }
  };

  // ================= FETCH SERVICES =================
  const fetchServices = async () => {
    try {
      const data = await getAvailableServices();
      
      console.log("Full API response:", data);
      
      // FIX: The services are nested in data.services.services
      const servicesArray = data.services?.services || [];
      
      const formattedServices = servicesArray.map((item) => ({
        code: item.code,
        name: item.name,
      }));
      
      console.log("Formatted services:", formattedServices);
      setServices(formattedServices);
    } catch (error) {
      console.log(error);
      setError("Failed to load services");
    }
  };

  // ================= BUY NUMBER =================
  const handleBuyNumber = async () => {
    if (!selectedCountry || !selectedService) {
      setError("Please select both country and service");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setPurchaseData(null);
      setOtp("");

      const payload = {
        country: selectedCountry,
        service: selectedService,
      };

      const res = await buyNumber(payload);
      setPurchaseData(res.data);
      startPolling(res.data.orderId);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Failed to purchase number");
    } finally {
      setLoading(false);
    }
  };

  // ================= CHECK OTP =================
  const startPolling = (orderId) => {
    setPollingActive(true);
    const interval = setInterval(async () => {
      try {
        const res = await checkOtpStatus(orderId);
        if (res.otpCode) {
          setOtp(res.otpCode);
          clearInterval(interval);
          setPollingActive(false);
        }
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      setPollingActive(false);
    };
  }, []);

  useEffect(() => {
    fetchCountries();
    fetchServices();
  }, []);

  const handleCopyNumber = () => {
    if (purchaseData?.phone) {
      navigator.clipboard.writeText(purchaseData.phone);
    }
  };

  const selectedCountryData = countries.find(
    (c) => c.code === selectedCountry || c.eng === selectedCountry
  );
  const selectedServiceData = services.find((s) => s.code === selectedService);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-light mb-4">
              <Smartphone size={13} />
              Virtual Numbers
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Buy SMS-capable numbers
              <br className="hidden sm:block" /> for instant verification.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Choose a country and service, purchase a virtual number, and receive OTP codes instantly. All numbers are admin-listed and ready for use.
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

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Purchase Form - Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <WalletBalanceCard />

          <div className="rounded-xl border border-white/10 shadow-md bg-white/5 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
              <Globe size={14} />
              Purchase Details
            </h2>

            {/* Country Selection */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Select Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50 transition-all"
              >
                <option value="" className="bg-black">🌍 Choose a country</option>
                {countries.map((item, index) => (
                  <option key={item.id || index} value={item.code || item.eng} className="bg-black">
                    {item.flag || "🌍"} {item.eng}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50 transition-all"
              >
                <option value="" className="bg-black">🔧 Choose a service</option>
                {services.map((item, index) => (
                  <option key={index} value={item.code} className="bg-black">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Summary */}
            {(selectedCountryData || selectedServiceData) && (
              <div className="mt-4 rounded-lg border border-red-light/10 bg-red-light/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Selection Summary
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white font-medium">
                    {selectedCountryData?.flag || "🌍"} {selectedCountryData?.eng || selectedCountry || "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white font-medium">
                    {selectedServiceData?.name || selectedService || "—"}
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-light/10 p-3 text-sm text-red-light border border-red-light/20">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuyNumber}
              disabled={loading || !selectedCountry || !selectedService}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-red-dark py-3 text-sm font-semibold text-white transition-all hover:bg-red-light disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone size={18} />
                  Buy Number
                </>
              )}
            </button>

            {/* Info Note */}
            <p className="mt-4 text-center text-[11px] text-gray-600">
              Numbers are valid for 20 minutes. OTP will auto-refresh.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/10 shadow-md bg-white/5 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
              <ShieldCheck size={14} />
              Why Choose Us
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { label: "Active Countries", value: countries.length, icon: Globe },
                { label: "Available Services", value: services.length, icon: Server },
                { label: "Success Rate", value: "98.7%", icon: CheckCircle2 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Status & OTP */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Status Card */}
          {purchaseData && (
            <div className="rounded-xl border border-emerald-500/20 shadow-md bg-gradient-to-br from-emerald-950/20 via-black to-black p-5 transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <h2 className="font-semibold text-white">Number Purchased Successfully</h2>
                </div>
                {pollingActive && (
                  <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400 border border-amber-500/20">
                    <Loader2 size={12} className="animate-spin" />
                    Waiting for OTP...
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Phone Number</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-mono text-lg font-bold text-white">{purchaseData.phone}</p>
                    <button
                      onClick={handleCopyNumber}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Provider</p>
                  <p className="mt-1 text-sm font-medium text-white">{purchaseData.provider || "Standard"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-sm font-medium text-emerald-400">{purchaseData.status || "Active"}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Price</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold text-white">
                    <DollarSign size={14} />
                    {purchaseData.cost} NGN
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Display Card */}
          {otp ? (
            <div className="rounded-xl border border-red-light/20 shadow-md bg-gradient-to-br from-red-950/30 via-black to-black p-6 text-center transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-light/20 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-400 mb-4">
                <RefreshCw size={12} />
                OTP Received
              </div>
              <p className="text-5xl font-bold tracking-wider text-white font-mono">{otp}</p>
              <p className="mt-4 text-sm text-gray-400">
                Use this code for verification. It expires in 5 minutes.
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(otp)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
              >
                <Copy size={14} />
                Copy Code
              </button>
            </div>
          ) : purchaseData && !pollingActive && !otp ? (
            <div className="rounded-xl border border-yellow-500/20 shadow-md bg-gradient-to-br from-yellow-950/20 via-black to-black p-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400 mb-4">
                <Clock size={12} />
                Timeout
              </div>
              <p className="text-gray-400">No OTP received within the time limit.</p>
              <button
                onClick={handleBuyNumber}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-light"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 shadow-md bg-white/5 p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-4">
                  <Smartphone size={28} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white">No Active Session</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                  Select a country and service above, then click "Buy Number" to start receiving OTP codes.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
                  <CreditCard size={12} />
                  <span>Cost deducted from wallet balance</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneNumber;
