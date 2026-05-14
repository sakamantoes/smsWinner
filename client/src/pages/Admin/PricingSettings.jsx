// components/admin/PricingSettings.jsx
import React, { useState } from "react";
import {
  DollarSign,
  Percent,
  TrendingUp,
  Save,
  Loader2,
  AlertCircle,
  Edit2,
  X,
} from "lucide-react";
import { updatePricingSettings } from "../../service/payment";
import { toast } from "react-toastify";

const PricingSettings = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nariaRate: "",
    markupType: "percentage",
    markupValue: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "markupValue" || name === "nariaRate" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nariaRate || formData.nariaRate <= 0) {
      toast.error("Please enter a valid Naira rate");
      return;
    }
    
    if (!formData.markupValue || formData.markupValue <= 0) {
      toast.error("Please enter a valid markup value");
      return;
    }

    if (formData.markupType === "percentage" && formData.markupValue > 100) {
      toast.error("Percentage markup cannot exceed 100%");
      return;
    }

    setLoading(true);
    try {
      const response = await updatePricingSettings({
        nariaRate: formData.nariaRate,
        markupType: formData.markupType,
        markupValue: formData.markupValue,
      });

      if (response.success) {
        toast.success(response.message || "Pricing settings updated successfully!");
        setIsEditing(false);
        // Reset form but keep values
        setFormData({
          nariaRate: "",
          markupType: "percentage",
          markupValue: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update pricing settings");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      nariaRate: "",
      markupType: "percentage",
      markupValue: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-gradient-to-br from-red-950/40 via-black to-black p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-dark/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-light/40 bg-red-light/10 px-3 py-1 text-xs font-semibold text-red-300">
            <TrendingUp size={13} />
            Pricing Configuration
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Pricing Settings
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
            Configure USD to NGN conversion rates and global markup settings for all products.
          </p>
        </div>
      </div>

      {/* Current Settings Display - Static for now */}
      {!isEditing && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Pricing Configuration</h2>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-lg bg-red-light/10 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-light/20"
            >
              <Edit2 size={16} />
              Update Settings
            </button>
          </div>

          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-400">Update Pricing</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Click the "Update Settings" button to configure USD to NGN rates and markup values.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Update Pricing Settings</h2>
            <button
              onClick={handleCancel}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* USD to NGN Rate */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                USD to NGN Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                <input
                  type="number"
                  name="nariaRate"
                  value={formData.nariaRate}
                  onChange={handleInputChange}
                  step="1"
                  min="0"
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-8 py-2 text-white placeholder:text-gray-500 focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50"
                  placeholder="Enter Naira rate"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Example: 1500 means 1 USD = 1500 NGN</p>
            </div>

            {/* Markup Type */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Markup Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="markupType"
                    value="percentage"
                    checked={formData.markupType === "percentage"}
                    onChange={handleInputChange}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-white">Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="markupType"
                    value="fixed"
                    checked={formData.markupType === "fixed"}
                    onChange={handleInputChange}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-white">Fixed (USD)</span>
                </label>
              </div>
            </div>

            {/* Markup Value */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Markup Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {formData.markupType === "percentage" ? "%" : "$"}
                </span>
                <input
                  type="number"
                  name="markupValue"
                  value={formData.markupValue}
                  onChange={handleInputChange}
                  step={formData.markupType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={formData.markupType === "percentage" ? "100" : undefined}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-8 py-2 text-white placeholder:text-gray-500 focus:border-red-light/50 focus:outline-none focus:ring-1 focus:ring-red-light/50"
                  placeholder={`Enter markup ${formData.markupType === "percentage" ? "percentage" : "amount"}`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.markupType === "percentage" 
                  ? "Percentage added to the base price" 
                  : "Fixed USD amount added to the base price"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-red-light px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {loading ? "Saving..." : "Save Settings"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-white/10 px-6 py-2 text-sm font-semibold text-gray-400 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-400">How pricing works</h3>
            <p className="text-xs text-gray-400 mt-1">
              Final price = (Base USD price × USD to NGN rate) + Markup value.
              Changes will affect all products immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSettings;