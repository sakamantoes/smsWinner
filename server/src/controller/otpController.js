// controllers/otpController.js

import OtpOrder from "../model/OtpOrder.js";
import User from "../model/User.js";
import Transaction from "../model/Transaction.js";
import CompanyWallet from "../model/CompanyWallet.js";
import nodeApi from "../utils/nodeOtpApi.js";
import smsActivateApi from "../utils/smsActivateApi.js";
import smsBowerApi from "../utils/smsBowerApi.js";
import systemSettingsModel from "../model/systemSettingsSchema.js";
import priceInterceptor from "../utils/priceInterceptor.js";
import { env } from "../config/constant.js";

// UPDATED PRICING ENGINE WITH INTERCEPTOR
const calculateSellingPrice = async (providerCost, service = null, country = null) => {
  const profitCalculation = await priceInterceptor.calculateProfit(providerCost, service, country);
  const settings = await systemSettingsModel.findOne();
  const legacyMarkup = settings?.profitMarkup || 0;
  const finalProfit = Math.max(profitCalculation.profit, legacyMarkup);
  const sellingPrice = providerCost + finalProfit;

  return {
    providerCost,
    markup: finalProfit,
    sellingPrice,
    profitCalculation,
  };
};

// ==================== COUNTRY MAPPING ====================
const countryMap = {
  0: "RU", 1: "UA", 2: "KZ", 3: "US", 4: "GB", 5: "DE", 6: "FR", 7: "IT",
  8: "ES", 9: "NL", 10: "PL", 11: "BR", 12: "MX", 13: "AR", 14: "AU",
  15: "JP", 16: "ID", 17: "TH", 18: "VN", 19: "NG", 20: "NO", 21: "DK",
  22: "CZ", 23: "PT", 24: "RO", 25: "IE",
  usa: "US", us: "US", "united states": "US", uk: "GB", "united kingdom": "GB",
  canada: "CA", ca: "CA", indonesia: "ID", id: "ID", colombia: "CO", co: "CO",
  vietnam: "VN", vn: "VN", "south africa": "ZA", za: "ZA", brazil: "BR", br: "BR",
  philippines: "PH", ph: "PH", malaysia: "MY", my: "MY", australia: "AU", au: "AU",
  netherlands: "NL", nl: "NL", germany: "DE", de: "DE", nigeria: "NG", ng: "NG",
};

const preferredCountries = {
  whatsapp: ["US", "CA", "GB", "NG", "DE", "FR", "ES", "IT", "NL", "BR", "MX", "AR", "AU", "JP", "ID", "TH", "VN"],
  google: ["US", "CA", "GB", "NG", "DE", "FR", "ES", "IT", "NL", "BR", "MX", "AR", "AU", "JP", "ID", "TH", "VN"],
  gmail: ["US", "CA", "GB", "NG", "DE", "FR", "ES", "IT", "NL", "BR", "MX", "AR", "AU", "JP", "ID", "TH", "VN"],
  youtube: ["US", "CA", "GB", "NG", "DE", "FR", "ES", "IT", "NL", "BR", "MX", "AR", "AU", "JP", "ID", "TH", "VN"],
  walmart: ["US", "CA", "GB"],
  instagram: ["US", "CA", "GB", "NG", "DE", "FR", "ES", "IT", "NL", "BR", "MX", "AR", "AU"],
};

const getCountryCode = (countryInput) => {
  const normalized = countryInput?.toString().toLowerCase().trim();
  const mapped = countryMap[normalized];
  if (mapped) return mapped;
  const upperCountry = countryInput?.toString().toUpperCase();
  const validCountries = ["US", "CA", "GB", "RU", "UA", "KZ", "DE", "FR", "IT", "ES", "NL", "PL", "BR", "MX", "AR", "AU", "JP", "ID", "TH", "VN", "NG", "NO", "DK", "CZ", "PT", "RO", "IE", "CO", "ZA", "MY", "CL", "SE", "CM", "AT", "MA", "KE", "HR", "FI", "EG", "GH", "CG", "UY", "GR", "NZ", "BG", "CH"];
  if (validCountries.includes(upperCountry)) return upperCountry;
  throw new Error(`Invalid country: ${countryInput}`);
};

const serviceMap = {
  tg: "telegram", go: "google", fb: "facebook", wa: "whatsapp", ig: "instagram",
  tw: "twitter", ap: "apple", ms: "microsoft", dc: "discord", sn: "snapchat",
  tk: "tiktok", am: "amazon", gp: "gmail", yt: "youtube", li: "linkedin",
  zl: "zoom", ub: "uber", lv: "line", vk: "vkontakte", pf: "paypal",
  sp: "spotify", nt: "netflix", wm: "walmart",
  telegram: "telegram", google: "google", facebook: "facebook", whatsapp: "whatsapp",
  instagram: "instagram", twitter: "twitter", gmail: "gmail", youtube: "youtube",
};

const getServiceName = (serviceInput) => {
  const normalized = serviceInput?.toString().toLowerCase();
  const mapped = serviceMap[normalized];
  if (!mapped) throw new Error(`Invalid service: ${serviceInput}`);
  return mapped;
};

const getSmsBowerServiceId = (serviceName) => {
  const serviceIds = {
    whatsapp: "wa", google: "go", gmail: "gp", youtube: "yt", instagram: "ig",
    facebook: "fb", telegram: "tg", twitter: "tw", apple: "ap", microsoft: "ms",
    discord: "dc", snapchat: "sn", tiktok: "tk", amazon: "am", linkedin: "li",
    zoom: "zl", uber: "ub", line: "lv", vkontakte: "vk", paypal: "pf",
    spotify: "sp", netflix: "nt", walmart: "wm",
  };
  return serviceIds[serviceName] || serviceName;
};

// ==================== PROVIDER FUNCTIONS WITH IMPROVED ERROR HANDLING ====================

const buyFromSmsBower = async ({ country, service }) => {

  const API_KEY = env.smsBowerApiKey

  try {
    const countryCode = getCountryCode(country);
    const serviceName = getServiceName(service);
    const serviceId = getSmsBowerServiceId(serviceName);

    console.log(`📞 SMSBower: Buying ${serviceName} number in ${countryCode}`);
    console.log(`🔑 API Key exists: ${!!API_KEY}`);
    console.log(`🔑 API Key prefix: ${API_KEY?.substring(0, 10)}...`);

    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: API_KEY,
        action: "getNumber",
        service: serviceId,
        country: countryCode,
      },
      timeout: 30000,
    });

    const responseData = response.data;
    console.log("SMSBower Raw Response:", responseData);

    if (typeof responseData === "string") {
      const parts = responseData.split(":");
      
      if (parts[0] === "ACCESS_NUMBER") {
        return {
          provider: "smsbower",
          orderId: parts[1],
          phone: parts[2],
          providerCost: parseFloat(parts[3]) || 0,
          raw: responseData,
        };
      }
      
      if (parts[0] === "NO_NUMBERS") {
        throw new Error(`No numbers available for ${serviceName} in ${countryCode}`);
      }
      
      if (parts[0] === "ERROR") {
        throw new Error(`SMSBower Error: ${parts[1] || "Unknown error"}`);
      }
      
      if (parts[0] === "BAD_SERVICE") {
        throw new Error(`Invalid service '${serviceName}' for SMSBower`);
      }
      
      if (parts[0] === "BAD_COUNTRY") {
        throw new Error(`Invalid country '${countryCode}' for SMSBower`);
      }
      
      if (parts[0] === "BAD_KEY") {
        throw new Error(`Invalid API key for SMSBower. Please check your SMS_BOWER_API_KEY in .env`);
      }
    }
    
    if (responseData && typeof responseData === 'object') {
      if (responseData.status === 0) {
        throw new Error(`SMSBower API Error: ${responseData.message || "No access"}. Check your API key and permissions.`);
      }
    }
    
    throw new Error(`Unexpected SMSBower response: ${JSON.stringify(responseData)}`);
  } catch (error) {
    console.error("❌ SMSBower detailed error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 401) {
      throw new Error(`SMSBower Authentication Failed (401): Invalid or expired API key. Please check your SMS_BOWER_API_KEY environment variable.`);
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error(`SMSBower Connection Timeout: The service did not respond within the timeout period.`);
    }
    
    throw new Error(`SMSBower Failed: ${error.message}`);
  }
};

const buyFromNodeOtp = async ({ country, service, operator }) => {
  try {
    const API_KEY = env.nodeApiKey;
    console.log(`📞 NodeOTP: Buying ${service} number in ${country}`);
    console.log(`🔑 API Key exists: ${!!API_KEY}`);
    
    const response = await nodeApi.post("/order", {
      country,
      service,
      operator: operator || "any",
    }, {
      timeout: 30000,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "NodeOTP request failed");
    }

    const cost = parseFloat(response.data.data.cost) || 0;

    return {
      provider: "nodeotp",
      orderId: response.data.data.orderId.toString(),
      phone: response.data.data.phone,
      providerCost: cost,
      raw: response.data,
    };
  } catch (error) {
    console.error("❌ NodeOTP detailed error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      if (errorMsg.includes("Saldo tidak cukup") || errorMsg.toLowerCase().includes("insufficient balance")) {
        throw new Error(`NodeOTP Insufficient Balance: Your NodeOTP account balance is low. Please add funds to continue. (Details: ${errorMsg})`);
      }
      throw new Error(`NodeOTP Bad Request: ${errorMsg}`);
    }
    
    if (error.response?.status === 401) {
      throw new Error(`NodeOTP Authentication Failed (401): Invalid API key. Please check your NODE_OTP_API_KEY environment variable.`);
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error(`NodeOTP Connection Timeout: The service did not respond within the timeout period.`);
    }
    
    throw new Error(`NodeOTP Failed: ${error.message}`);
  }
};

const buyFromSmsActivate = async ({ country, service }) => {
  try {
    
    const countryName = getCountryCode(country);
    const serviceName = getServiceName(service);

    console.log(`📞 SMSActivate: Buying ${serviceName} number in ${countryName}`);
    console.log(`🔑 API Key exists: ${!!env.smsActivateApiKey}`);

    const response = await smsActivateApi.get("/sms.php", {
      params: {
        api_key: env.smsActivateApiKey,
        action: "get_number",
        service_name: serviceName,
        country: countryName,
      },
      timeout: 30000,
    });

    const result = response.data;
    console.log("SMSActivate Response:", result);

    if (result.success === true && result.activation_id && result.number) {
      return {
        provider: "smsactivate",
        orderId: result.activation_id.toString(),
        phone: result.number,
        providerCost: parseFloat(result.activation_cost) || 0,
        raw: result,
      };
    }

    if (result.success === false) {
      throw new Error(`SMSActivate Error: ${result.error || "API returned error"}`);
    }

    if (typeof result === "string") {
      if (result.includes("ERROR_NO_BALANCE")) {
        throw new Error(`SMSActivate Insufficient Balance: Your SMSActivate account balance is low. Please add funds.`);
      }
      if (result.includes("ERROR_NO_NUMBERS")) {
        throw new Error(`SMSActivate: No numbers available for ${serviceName} in ${countryName}`);
      }
      if (result.includes("ERROR_BAD_SERVICE")) {
        throw new Error(`SMSActivate: Invalid service '${serviceName}'`);
      }
      if (result.includes("ERROR_BAD_COUNTRY")) {
        throw new Error(`SMSActivate: Invalid country '${countryName}'`);
      }
      if (result.includes("ERROR")) {
        throw new Error(`SMSActivate Error: ${result}`);
      }
    }

    throw new Error(`Unexpected SMSActivate response: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("❌ SMSActivate detailed error:", {
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error(`SMSActivate Connection Timeout (15s): The service is slow or unavailable. Please try again later.`);
    }
    
    if (error.response?.status === 401) {
      throw new Error(`SMSActivate Authentication Failed (401): Invalid API key. Please check your SMS_ACTIVATE_API_KEY environment variable.`);
    }
    
    throw new Error(`SMSActivate Failed: ${error.message}`);
  }
};

// CANCEL FUNCTIONS
const cancelSmsBowerNumber = async (activationId) => {
  const API_KEY = env.smsBowerApiKey;
  try {
    await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: API_KEY,
        action: "cancelNumber",
        activation_id: activationId,
      },
    });
    console.log(`✅ Cancelled SMSBower activation ${activationId}`);
  } catch (error) {
    console.error("❌ SMSBOWER CANCEL ERROR:", error.message);
  }
};

const cancelSmsActivateNumber = async (activationId) => {
  try {
    await smsActivateApi.get("/sms.php", {
      params: {
        api_key: process.env.SMS_ACTIVATE_API_KEY,
        action: "cancel_number",
        activation_id: activationId,
      },
    });
    console.log(`✅ Cancelled SMSActivate activation ${activationId}`);
  } catch (error) {
    console.error("❌ SMSACTIVATE CANCEL ERROR:", error.message);
  }
};

const cancelNodeOtpNumber = async (orderId) => {
  try {
    await nodeApi.post(`/order/${orderId}/cancel`);
    console.log(`✅ Cancelled NodeOTP order ${orderId}`);
  } catch (error) {
    console.error("❌ NODEOTP CANCEL ERROR:", error.message);
  }
};

const checkSmsBowerStatus = async (activationId) => {
  const API_KEY = env.smsBowerApiKey;
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key:API_KEY,
        action: "getSms",
        activation_id: activationId,
      },
    });
    const data = response.data;
    if (typeof data === "string") {
      const parts = data.split(":");
      if (parts[0] === "STATUS_OK") return { otpCode: parts[2], status: "OTP_RECEIVED" };
      if (parts[0] === "STATUS_WAIT_CODE") return { otpCode: null, status: "WAITING_FOR_SMS" };
      if (parts[0] === "STATUS_CANCEL") return { otpCode: null, status: "CANCELLED" };
    }
    return { otpCode: null, status: "WAITING_FOR_SMS" };
  } catch (error) {
    console.error("SMSBower status check error:", error.message);
    return { otpCode: null, status: "WAITING_FOR_SMS" };
  }
};

// ==================== MAIN CONTROLLERS ====================

export const buyNumber = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { country, service, operator } = req.body;
    
    console.log("📝 Buy Number Request:", { userId, country, service, operator });
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Please login first" });
    }
    
    if (!country || !service) {
      return res.status(400).json({ success: false, message: "Country and service are required" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    console.log(`💰 User balance: ${user.walletBalance} NGN`);
    
    // Try providers in order
    let purchaseData;
    let errors = [];
    let providerErrors = [];
    
    // Try SMSBower
    console.log("\n🔄 Attempting SMSBower...");
    try {
      purchaseData = await buyFromSmsBower({ country, service });
      console.log("✅ Successfully purchased from SMSBOWER");
    } catch (smsBowerError) {
      const errorMsg = smsBowerError.message;
      console.log("❌ SMSBOWER FAILED:", errorMsg);
      providerErrors.push({ provider: "SMSBower", error: errorMsg });
      errors.push(`SMSBower: ${errorMsg}`);
      
      // Try NodeOTP
      console.log("\n🔄 Attempting NodeOTP as fallback...");
      try {
        purchaseData = await buyFromNodeOtp({ country, service, operator });
        console.log("✅ Successfully purchased from NODEOTP");
      } catch (nodeError) {
        const nodeErrorMsg = nodeError.message;
        console.log("❌ NODEOTP FAILED:", nodeErrorMsg);
        providerErrors.push({ provider: "NodeOTP", error: nodeErrorMsg });
        errors.push(`NodeOTP: ${nodeErrorMsg}`);
        
        // Try SMSActivate
        console.log("\n🔄 Attempting SMSActivate as final fallback...");
        try {
          purchaseData = await buyFromSmsActivate({ country, service });
          console.log("✅ Successfully purchased from SMSACTIVATE");
        } catch (smsError) {
          const smsErrorMsg = smsError.message;
          console.log("❌ SMSACTIVATE FAILED:", smsErrorMsg);
          providerErrors.push({ provider: "SMSActivate", error: smsErrorMsg });
          errors.push(`SMSActivate: ${smsErrorMsg}`);
          
          // All providers failed - return detailed error
          return res.status(503).json({
            success: false,
            message: "Unable to purchase number from any provider. Please check your API keys and balances.",
            errors: providerErrors,
            details: {
              smsBower: {
                status: "failed",
                possible_fix: "Check SMS_BOWER_API_KEY in .env and ensure account has balance"
              },
              nodeOtp: {
                status: "failed",
                possible_fix: "Check NODE_OTP_API_KEY and ensure sufficient balance (Saldo tidak cukup means insufficient balance)"
              },
              smsActivate: {
                status: "failed",
                possible_fix: "Check SMS_ACTIVATE_API_KEY and ensure sufficient balance"
              }
            }
          });
        }
      }
    }
    
    // Calculate pricing with interceptor
    const serviceName = getServiceName(service);
    const countryCode = getCountryCode(country);
    const pricing = await calculateSellingPrice(purchaseData.providerCost, serviceName, countryCode);
    
    const totalCost = pricing.sellingPrice;
    const profit = pricing.markup;
    
    console.log(`💰 Price breakdown: Provider cost: ${purchaseData.providerCost}, Admin profit: ${profit}, Total: ${totalCost}`);
    
    // Check balance
    if (user.walletBalance < totalCost) {
      // Cancel the number since user can't pay
      if (purchaseData.provider === "smsbower") await cancelSmsBowerNumber(purchaseData.orderId);
      else if (purchaseData.provider === "nodeotp") await cancelNodeOtpNumber(purchaseData.orderId);
      else await cancelSmsActivateNumber(purchaseData.orderId);
      
      return res.status(402).json({
        success: false,
        message: `Insufficient balance. Required: ${totalCost} NGN, Available: ${user.walletBalance} NGN`,
        required: totalCost,
        available: user.walletBalance,
        breakdown: {
          providerCost: purchaseData.providerCost,
          adminProfit: profit,
          totalCost: totalCost
        }
      });
    }
    
    // Deduct from user wallet
    user.walletBalance -= totalCost;
    await user.save();
    console.log(`✅ Deducted ${totalCost} NGN from user. New balance: ${user.walletBalance} NGN`);
    
    // Update company wallet
    let companyWallet = await CompanyWallet.findOne();
    if (!companyWallet) {
      companyWallet = await CompanyWallet.create({
        totalProfit: 0,
        totalRevenue: 0,
        totalProviderCost: 0,
      });
    }
    
    companyWallet.totalProfit += profit;
    companyWallet.totalRevenue += totalCost;
    companyWallet.totalProviderCost += purchaseData.providerCost;
    await companyWallet.save();
    
    // Create order
    const order = await OtpOrder.create({
      userId,
      provider: purchaseData.provider,
      orderId: purchaseData.orderId,
      phone: purchaseData.phone,
      service: serviceName,
      country: countryCode,
      operator: operator || "any",
      status: "WAITING_FOR_SMS",
      cost: totalCost,
      providerCost: purchaseData.providerCost,
      profit: profit,
      profitDetails: pricing.profitCalculation,
      rawResponse: purchaseData.raw,
    });
    
    // Create transaction
    await Transaction.create({
      userId,
      type: "OTP_PURCHASE",
      provider: purchaseData.provider,
      amount: totalCost,
      providerCost: purchaseData.providerCost,
      profit: profit,
      description: `Purchased ${service} OTP number in ${country}`,
      orderId: order._id,
      metadata: {
        profitCalculation: pricing.profitCalculation
      }
    });
    
    console.log(`✅ Order created successfully: ${order._id}`);
    
    return res.status(201).json({
      success: true,
      message: "Number purchased successfully",
      data: {
        orderId: order._id,
        provider: order.provider,
        phone: order.phone,
        service: order.service,
        country: order.country,
        status: order.status,
        cost: order.cost,
        providerCost: order.providerCost,
        adminProfit: order.profit,
        profitDetails: order.profitDetails,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("BUY NUMBER UNEXPECTED ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while purchasing number",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// CHECK OTP STATUS
export const checkOtpStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });

    let otpCode = null;
    let status = order.status;

    if (order.provider === "smsbower") {
      const result = await checkSmsBowerStatus(order.orderId);
      otpCode = result.otpCode;
      status = result.status;
    } else if (order.provider === "nodeotp") {
      const response = await nodeApi.get(`/order/${order.orderId}/status`);
      if (response.data?.data?.code) {
        otpCode = response.data.data.code;
        status = "OTP_RECEIVED";
      }
    } else if (order.provider === "smsactivate") {
      const response = await smsActivateApi.get("/sms.php", {
        params: {
          api_key: process.env.SMS_ACTIVATE_API_KEY,
          action: "get_sms",
          activation_id: order.orderId,
        },
      });
      const result = response.data;
      if (result.success === true && result.status === "SMS Received" && result.verification_code) {
        otpCode = result.verification_code;
        status = "OTP_RECEIVED";
      } else if (result.status === "SMS Received" && result.code) {
        otpCode = result.code;
        status = "OTP_RECEIVED";
      } else if (result.status === "Cancelled") {
        status = "CANCELLED";
      }
    }

    if (otpCode) {
      order.otpCode = otpCode;
      order.status = status;
      await order.save();
    } else if (status !== order.status) {
      order.status = status;
      await order.save();
    }

    return res.json({ success: true, otpCode, status: order.status, data: { _id: order._id, phone: order.phone, provider: order.provider, service: order.service, country: order.country, cost: order.cost } });
  } catch (error) {
    console.error("CHECK OTP STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL ACTIVATION
export const cancelActivation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
    if (order.status === "OTP_RECEIVED" || order.status === "COMPLETED") return res.status(400).json({ success: false, message: "Cannot cancel - OTP already received" });
    if (order.status === "CANCELLED") return res.status(400).json({ success: false, message: "Order already cancelled" });

    if (order.provider === "smsbower") await cancelSmsBowerNumber(order.orderId);
    else if (order.provider === "smsactivate") await cancelSmsActivateNumber(order.orderId);
    else if (order.provider === "nodeotp") await cancelNodeOtpNumber(order.orderId);

    const user = await User.findById(userId);
    if (user) {
      user.walletBalance += order.cost;
      await user.save();
    }

    const companyWallet = await CompanyWallet.findOne();
    if (companyWallet) {
      companyWallet.totalProfit -= order.profit;
      companyWallet.totalRevenue -= order.cost;
      companyWallet.totalProviderCost -= order.providerCost;
      await companyWallet.save();
    }

    order.status = "CANCELLED";
    await order.save();

    await Transaction.create({
      userId,
      type: "REFUND",
      provider: order.provider,
      amount: -order.cost,
      description: `Refund for cancelled ${order.service} OTP`,
      orderId: order._id,
    });

    return res.json({ success: true, message: "Activation cancelled and refunded" });
  } catch (error) {
    console.error("CANCEL ACTIVATION ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// GET COMPANY STATS
export const getCompanyStats = async (req, res) => {
  try {
    const companyWallet = await CompanyWallet.findOne();
    const totalOrders = await OtpOrder.countDocuments();
    const completedOrders = await OtpOrder.countDocuments({ status: "OTP_RECEIVED" });
    const cancelledOrders = await OtpOrder.countDocuments({ status: "CANCELLED" });
    return res.json({ success: true, data: { wallet: companyWallet || { totalProfit: 0, totalRevenue: 0, totalProviderCost: 0 }, stats: { totalOrders, completedOrders, cancelledOrders, pendingOrders: totalOrders - completedOrders - cancelledOrders } } });
  } catch (error) {
    console.error("GET COMPANY STATS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE MARKUP
export const updateMarkup = async (req, res) => {
  try {
    const { profitMarkup } = req.body;
    if (profitMarkup === undefined || isNaN(profitMarkup) || profitMarkup < 0) return res.status(400).json({ success: false, message: "Valid profitMarkup required (>=0)" });
    let settings = await systemSettingsModel.findOne();
    if (!settings) settings = await systemSettingsModel.create({ profitMarkup: Number(profitMarkup) });
    else settings.profitMarkup = Number(profitMarkup);
    await settings.save();
    return res.json({ success: true, message: "Profit markup updated", data: { profitMarkup: settings.profitMarkup } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ORDER HISTORY
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await OtpOrder.find({ userId }).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: orders.map(order => ({ _id: order._id, provider: order.provider, phone: order.phone, service: order.service, country: order.country, status: order.status, cost: order.cost, otpCode: order.otpCode, createdAt: order.createdAt })) });
  } catch (error) {
    console.error("GET ORDER HISTORY ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ORDER DETAILS
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const order = await OtpOrder.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.userId.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized" });
    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET PREFERRED COUNTRIES
export const getPreferredCountries = async (req, res) => {
  try {
    const { service } = req.params;
    const serviceName = service?.toLowerCase();
    let countries = [];
    if (serviceName === "whatsapp") countries = preferredCountries.whatsapp;
    else if (serviceName === "google" || serviceName === "gmail" || serviceName === "youtube") countries = preferredCountries.google;
    else if (serviceName === "walmart") countries = preferredCountries.walmart;
    else if (serviceName === "instagram") countries = preferredCountries.instagram;
    else countries = Object.keys(countryMap).filter(c => c.length === 2 && c === c.toUpperCase());
    return res.json({ success: true, service: serviceName, countries });
  } catch (error) {
    console.error("GET PREFERRED COUNTRIES ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET AVAILABLE SERVICES
export const getAvailableServices = async (req, res) => {
  const API_KEY = env.smsBowerApiKey
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: { api_key: API_KEY, action: "getServicesList" },
    });
    return res.json({ success: true, services: response.data });
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SMSBOWER BALANCE
export const getSmsBowerBalance = async (req, res) => {
  const API_KEY = env.sms_bower_api_key;
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: { api_key: API_KEY, action: "getBalance" },
    });
    return res.json({ success: true, balance: response.data });
  } catch (error) {
    console.error("Get SMSBower balance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SMSACTIVATE BALANCE
export const getSmsActivateBalance = async (req, res) => {
  try {
    const response = await smsActivateApi.get("/sms.php", {
      params: { api_key: process.env.SMS_ACTIVATE_API_KEY, action: "get_balance" },
    });
    return res.json({ success: true, balance: response.data });
  } catch (error) {
    console.error("Get SMSActivate balance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SMSBOWER COUNTRIES
export const getSmsBowerCountries = async (req, res) => {
  try {
    const API_KEY = env.smsBowerApiKey;

    console.log("🌍 Fetching SMSBower countries...");
    console.log(`🔑 API Key exists: ${!!API_KEY}`);

    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: API_KEY,
        action: "getCountries",
      },
      timeout: 30000,
    });

    const countries = response.data;

    if (!countries) {
      return res.status(500).json({
        success: false,
        message: "No countries returned from SMSBower",
      });
    }

    // Return ALL country fields
    const formattedCountries = Array.isArray(countries)
      ? countries.map((country) => ({
          ...country,
        }))
      : Object.values(countries).map((country) => ({
          ...country,
        }));

    return res.status(200).json({
      success: true,
      total: formattedCountries.length,
      countries: formattedCountries,
    });
  } catch (error) {
    console.error("❌ GET SMSBOWER COUNTRIES ERROR:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to fetch countries from SMSBower",
      error: error.message,
    });
  }
};

// WEBHOOKS
export const smsBowerWebhook = async (req, res) => {
  try {
    console.log("📩 SMSBOWER WEBHOOK:", req.body);
    const { activation_id, sms_code, status } = req.body;
    if (!activation_id) return res.status(400).json({ success: false, message: "Activation ID missing" });
    const order = await OtpOrder.findOne({ orderId: activation_id.toString(), provider: "smsbower" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (sms_code) { order.otpCode = sms_code; order.status = "OTP_RECEIVED"; order.completedAt = new Date(); await order.save(); console.log(`✅ OTP: ${sms_code}`); }
    if (status === "CANCELLED") { order.status = "CANCELLED"; await order.save(); }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMSBOWER WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const smsActivateWebhook = async (req, res) => {
  try {
    console.log("📩 SMSACTIVATE WEBHOOK:", req.body);
    const { activationid, sms_code } = req.body;
    if (!activationid) return res.status(400).json({ success: false, message: "Activation ID missing" });
    const order = await OtpOrder.findOne({ orderId: activationid.toString(), provider: "smsactivate" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (sms_code) { order.otpCode = sms_code; order.status = "OTP_RECEIVED"; order.completedAt = new Date(); await order.save(); console.log(`✅ OTP: ${sms_code}`); }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMSACTIVATE WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const nodeOtpWebhook = async (req, res) => {
  try {
    console.log("📩 NODEOTP WEBHOOK:", req.body);
    const { success, event, data } = req.body;
    if (!success || !data) return res.status(400).json({ success: false, message: "Invalid payload" });
    const order = await OtpOrder.findOne({ orderId: data.orderId.toString(), provider: "nodeotp" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (event === "otp_received") { order.otpCode = data.code; order.status = "OTP_RECEIVED"; order.completedAt = new Date(); await order.save(); console.log(`✅ OTP: ${data.code}`); }
    if (event === "order_cancelled") order.status = "CANCELLED";
    if (event === "order_expired") order.status = "EXPIRED";
    await order.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("NODEOTP WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};