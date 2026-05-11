// controllers/otpController.js

import OtpOrder from "../model/OtpOrder.js";
import User from "../model/User.js";
import Transaction from "../model/Transaction.js";
import CompanyWallet from "../model/CompanyWallet.js";
import nodeApi from "../utils/nodeOtpApi.js";
import smsActivateApi from "../utils/smsActivateApi.js";
import smsBowerApi from "../utils/smsBowerApi.js";
import systemSettingsModel from "../model/systemSettingsSchema.js";
import Wallet from "../model/Wallet.js";

// PRICING ENGINE
// controllers/otpController.js (updated pricing engine)

import priceInterceptor from "../utils/priceInterceptor.js";

// UPDATED PRICING ENGINE WITH INTERCEPTOR
const calculateSellingPrice = async (
  providerCost,
  service = null,
  country = null,
) => {
  // Get profit calculation from interceptor
  const profitCalculation = await priceInterceptor.calculateProfit(
    providerCost,
    service,
    country,
  );

  // Also check legacy markup for backward compatibility
  const settings = await systemSettingsModel.findOne();
  const legacyMarkup = settings?.profitMarkup || 0;

  // Use the higher of interceptor profit or legacy markup
  const finalProfit = Math.max(profitCalculation.profit, legacyMarkup);
  const sellingPrice = providerCost + finalProfit;

  return {
    providerCost,
    markup: finalProfit,
    sellingPrice,
    profitCalculation, // Include detailed profit info
  };
};

// ==================== COUNTRY MAPPING ====================
// Complete country mapping for all providers
const countryMap = {
  // Numeric codes to country names (SMSActivate format)
  0: "RU",
  1: "UA",
  2: "KZ",
  3: "US",
  4: "GB",
  5: "DE",
  6: "FR",
  7: "IT",
  8: "ES",
  9: "NL",
  10: "PL",
  11: "BR",
  12: "MX",
  13: "AR",
  14: "AU",
  15: "JP",
  16: "ID",
  17: "TH",
  18: "VN",
  19: "NG",
  20: "NO",
  21: "DK",
  22: "CZ",
  23: "PT",
  24: "RO",
  25: "IE",

  // Direct country name mappings
  usa: "US",
  us: "US",
  "united states": "US",
  "united states of america": "US",
  uk: "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  canada: "CA",
  ca: "CA",
  indonesia: "ID",
  id: "ID",
  colombia: "CO",
  co: "CO",
  vietnam: "VN",
  vn: "VN",
  "south africa": "ZA",
  za: "ZA",
  southafrica: "ZA",
  brazil: "BR",
  br: "BR",
  philippines: "PH",
  ph: "PH",
  malaysia: "MY",
  my: "MY",
  australia: "AU",
  au: "AU",
  netherlands: "NL",
  nl: "NL",
  germany: "DE",
  de: "DE",
  chile: "CL",
  cl: "CL",
  sweden: "SE",
  se: "SE",
  cameroon: "CM",
  cm: "CM",
  mexico: "MX",
  mx: "MX",
  thailand: "TH",
  th: "TH",
  spain: "ES",
  es: "ES",
  france: "FR",
  fr: "FR",
  portugal: "PT",
  pt: "PT",
  romania: "RO",
  ro: "RO",
  ireland: "IE",
  ie: "IE",
  argentina: "AR",
  ar: "AR",
  poland: "PL",
  pl: "PL",
  italy: "IT",
  it: "IT",
  denmark: "DK",
  dk: "DK",
  nigeria: "NG",
  ng: "NG",
  "ivory coast": "CI",
  ci: "CI",
  cotedivoire: "CI",
  austria: "AT",
  at: "AT",
  morocco: "MA",
  ma: "MA",
  kenya: "KE",
  ke: "KE",
  croatia: "HR",
  hr: "HR",
  finland: "FI",
  fi: "FI",
  egypt: "EG",
  eg: "EG",
  ghana: "GH",
  gh: "GH",
  congo: "CG",
  cg: "CG",
  czech: "CZ",
  cz: "CZ",
  "czech republic": "CZ",
  uruguay: "UY",
  uy: "UY",
  greece: "GR",
  gr: "GR",
  ukraine: "UA",
  ua: "UA",
  "new zealand": "NZ",
  nz: "NZ",
  bulgaria: "BG",
  bg: "BG",
  switzerland: "CH",
  ch: "CH",
  russia: "RU",
  ru: "RU",
  kazakhstan: "KZ",
  kz: "KZ",
  norway: "NO",
  no: "NO",
};

// Preferred countries for specific services
const preferredCountries = {
  whatsapp: [
    "US",
    "CA",
    "ID",
    "CO",
    "VN",
    "ZA",
    "BR",
    "PH",
    "GB",
    "MY",
    "AU",
    "NL",
    "DE",
    "CL",
    "SE",
    "CM",
    "MX",
    "TH",
    "ES",
    "FR",
    "PT",
    "RO",
    "IE",
    "AR",
    "US_VIRTUAL",
    "PL",
    "IT",
    "DK",
    "NG",
    "CI",
    "AT",
    "MA",
    "KE",
    "HR",
    "FI",
    "EG",
    "GH",
    "CG",
    "CZ",
    "UY",
    "GR",
    "UA",
    "NZ",
    "BG",
  ],
  google: [
    "US",
    "CA",
    "GB",
    "AU",
    "DE",
    "FR",
    "NL",
    "ES",
    "IT",
    "PL",
    "BR",
    "MX",
    "AR",
    "ID",
    "TH",
    "VN",
    "NG",
    "ZA",
    "TR",
    "PK",
    "EG",
    "PH",
    "BD",
    "KE",
    "UA",
    "RO",
    "CZ",
    "GR",
    "PT",
    "SE",
    "NO",
    "DK",
    "FI",
    "IE",
    "NZ",
  ],
  gmail: [
    "US",
    "CA",
    "GB",
    "AU",
    "DE",
    "FR",
    "NL",
    "ES",
    "IT",
    "PL",
    "BR",
    "MX",
    "AR",
    "ID",
    "TH",
    "VN",
    "NG",
    "ZA",
    "TR",
    "PK",
    "EG",
    "PH",
    "BD",
    "KE",
    "UA",
    "RO",
    "CZ",
    "GR",
    "PT",
    "SE",
    "NO",
    "DK",
    "FI",
    "IE",
    "NZ",
  ],
  youtube: [
    "US",
    "CA",
    "GB",
    "AU",
    "DE",
    "FR",
    "NL",
    "ES",
    "IT",
    "PL",
    "BR",
    "MX",
    "AR",
    "ID",
    "TH",
    "VN",
    "NG",
    "ZA",
    "TR",
    "PK",
    "EG",
    "PH",
    "BD",
    "KE",
    "UA",
    "RO",
    "CZ",
    "GR",
    "PT",
    "SE",
    "NO",
    "DK",
    "FI",
    "IE",
    "NZ",
  ],
  walmart: ["US", "CA", "GB", "US_VIRTUAL"],
  instagram: [
    "US",
    "CO",
    "FR",
    "GB",
    "ID",
    "TH",
    "BR",
    "UA",
    "DE",
    "CA",
    "SE",
    "NL",
    "PL",
    "ES",
    "RO",
    "IT",
    "FI",
    "GR",
    "CH",
  ],
};

const getCountryCode = (countryInput) => {
  const normalized = countryInput?.toString().toLowerCase().trim();
  const mapped = countryMap[normalized];

  if (mapped) return mapped;

  // Check if it's already a valid country code
  const upperCountry = countryInput?.toString().toUpperCase();
  const validCountries = [
    "US",
    "CA",
    "GB",
    "RU",
    "UA",
    "KZ",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "PL",
    "BR",
    "MX",
    "AR",
    "AU",
    "JP",
    "ID",
    "TH",
    "VN",
    "NG",
    "NO",
    "DK",
    "CZ",
    "PT",
    "RO",
    "IE",
    "CO",
    "ZA",
    "MY",
    "CL",
    "SE",
    "CM",
    "AT",
    "MA",
    "KE",
    "HR",
    "FI",
    "EG",
    "GH",
    "CG",
    "UY",
    "GR",
    "NZ",
    "BG",
    "CH",
    "US_VIRTUAL",
  ];

  if (validCountries.includes(upperCountry)) return upperCountry;

  throw new Error(`Invalid country: ${countryInput}`);
};

// ==================== SERVICE MAPPING ====================
const serviceMap = {
  // Short codes
  tg: "telegram",
  go: "google",
  fb: "facebook",
  wa: "whatsapp",
  ig: "instagram",
  tw: "twitter",
  ap: "apple",
  ms: "microsoft",
  dc: "discord",
  sn: "snapchat",
  tk: "tiktok",
  am: "amazon",
  gp: "gmail",
  yt: "youtube",
  li: "linkedin",
  zl: "zoom",
  ub: "uber",
  lv: "line",
  vk: "vkontakte",
  ok: "odnoklassniki",
  ma: "mailru",
  ya: "yandex",
  pf: "paypal",
  st: "stripe",
  sp: "spotify",
  nt: "netflix",
  hz: "hbo",
  ds: "disney",
  wm: "walmart",

  // Full names
  telegram: "telegram",
  google: "google",
  facebook: "facebook",
  whatsapp: "whatsapp",
  instagram: "instagram",
  twitter: "twitter",
  apple: "apple",
  microsoft: "microsoft",
  discord: "discord",
  snapchat: "snapchat",
  tiktok: "tiktok",
  amazon: "amazon",
  gmail: "gmail",
  youtube: "youtube",
  linkedin: "linkedin",
  zoom: "zoom",
  uber: "uber",
  line: "line",
  vkontakte: "vkontakte",
  odnoklassniki: "odnoklassniki",
  mailru: "mailru",
  yandex: "yandex",
  paypal: "paypal",
  stripe: "stripe",
  spotify: "spotify",
  netflix: "netflix",
  hbo: "hbo",
  disney: "disney",
  walmart: "walmart",
};

const getServiceName = (serviceInput) => {
  const normalized = serviceInput?.toString().toLowerCase();
  const mapped = serviceMap[normalized];
  if (!mapped) throw new Error(`Invalid service: ${serviceInput}`);
  return mapped;
};

// Get SMSBower service ID
const getSmsBowerServiceId = (serviceName) => {
  const serviceIds = {
    whatsapp: "wa",
    google: "go",
    gmail: "gp",
    youtube: "yt",
    instagram: "ig",
    facebook: "fb",
    telegram: "tg",
    twitter: "tw",
    apple: "ap",
    microsoft: "ms",
    discord: "dc",
    snapchat: "sn",
    tiktok: "tk",
    amazon: "am",
    linkedin: "li",
    zoom: "zl",
    uber: "ub",
    line: "lv",
    vkontakte: "vk",
    paypal: "pf",
    spotify: "sp",
    netflix: "nt",
    walmart: "wm",
  };
  return serviceIds[serviceName] || serviceName;
};

// ==================== PROVIDER FUNCTIONS ====================

// BUY FROM SMSBOWER (PRIMARY)
const buyFromSmsBower = async ({ country, service }) => {
  try {
    const countryCode = getCountryCode(country);
    const serviceName = getServiceName(service);
    const serviceId = getSmsBowerServiceId(serviceName);

    console.log(`📞 SMSBower: Buying ${serviceName} number in ${countryCode}`);

    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: process.env.SMS_BOWER_API_KEY,
        action: "getNumber",
        service: serviceId,
        country: countryCode,
      },
    });

    console.log("SMSBower Response:", JSON.stringify(response.data, null, 2));

    // Handle response - SMSBower returns semicolon separated values
    const responseData = response.data;

    if (typeof responseData === "string") {
      const parts = responseData.split(":");

      if (parts[0] === "ACCESS_NUMBER") {
        const activationId = parts[1];
        const phoneNumber = parts[2];
        const cost = parseFloat(parts[3]) || 0;

        return {
          provider: "smsbower",
          orderId: activationId,
          phone: phoneNumber,
          providerCost: cost,
          raw: responseData,
        };
      }

      if (parts[0] === "NO_NUMBERS") {
        throw new Error("No numbers available for this country/service");
      }

      if (parts[0] === "ERROR") {
        throw new Error(parts[1] || "SMSBower API error");
      }

      if (parts[0] === "BAD_SERVICE") {
        throw new Error("Invalid service for SMSBower");
      }

      if (parts[0] === "BAD_COUNTRY") {
        throw new Error("Invalid country for SMSBower");
      }
    }

    throw new Error(`Unexpected response: ${JSON.stringify(responseData)}`);
  } catch (error) {
    console.error("❌ SMSBower error:", error.message);
    throw new Error(`SMS_BOWER_FAILED: ${error.message}`);
  }
};

// CANCEL SMSBOWER NUMBER
const cancelSmsBowerNumber = async (activationId) => {
  try {
    await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: process.env.SMS_BOWER_API_KEY,
        action: "cancelNumber",
        activation_id: activationId,
      },
    });
    console.log(`✅ Cancelled SMSBower activation ${activationId}`);
  } catch (error) {
    console.error("❌ SMSBOWER CANCEL ERROR:", error.message);
  }
};

// CHECK SMSBOWER STATUS
const checkSmsBowerStatus = async (activationId) => {
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: process.env.SMS_BOWER_API_KEY,
        action: "getSms",
        activation_id: activationId,
      },
    });

    const data = response.data;

    if (typeof data === "string") {
      const parts = data.split(":");

      if (parts[0] === "STATUS_OK") {
        return { otpCode: parts[2], status: "OTP_RECEIVED" };
      }

      if (parts[0] === "STATUS_WAIT_CODE") {
        return { otpCode: null, status: "WAITING_FOR_SMS" };
      }

      if (parts[0] === "STATUS_CANCEL") {
        return { otpCode: null, status: "CANCELLED" };
      }
    }

    return { otpCode: null, status: "WAITING_FOR_SMS" };
  } catch (error) {
    console.error("SMSBower status check error:", error.message);
    return { otpCode: null, status: "WAITING_FOR_SMS" };
  }
};

// BUY FROM NODEOTP (FIRST FALLBACK)
const buyFromNodeOtp = async ({ country, service, operator }) => {
  try {
    const response = await nodeApi.post("/order", {
      country,
      service,
      operator: operator || "any",
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "NODEOTP_FAILED");
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
    console.error("❌ NODEOTP error:", error.message);
    if (error.response) {
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
      );
    }
    throw new Error(error.message);
  }
};

// BUY FROM SMSACTIVATE (SECOND FALLBACK)
const buyFromSmsActivate = async ({ country, service }) => {
  try {
    const countryName = getCountryCode(country);
    const serviceName = getServiceName(service);

    console.log(
      `📞 SMSActivate: Buying ${serviceName} number in ${countryName}`,
    );

    const response = await smsActivateApi.get("/sms.php", {
      params: {
        api_key: process.env.SMS_ACTIVATE_API_KEY,
        action: "get_number",
        service_name: serviceName,
        country: countryName,
      },
    });

    const result = response.data;

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
      throw new Error(result.error || "API returned error");
    }

    if (
      typeof result === "string" &&
      (result.includes("ERROR") || result.includes("NO_NUMBERS"))
    ) {
      throw new Error(result);
    }

    throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("❌ SMSActivate error:", error.message);
    throw new Error(`SMS_ACTIVATE_FAILED: ${error.message}`);
  }
};

// CANCEL FUNCTIONS
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

// ==================== MAIN CONTROLLERS ====================


// Update the buyNumber function in otpController.js

export const buyNumber = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { country, service, operator } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    if (!country || !service) {
      return res.status(400).json({ success: false, message: "Country and service are required" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Try providers in order: SMSBower -> NodeOTP -> SMSActivate
    let purchaseData;
    let errors = [];
    
    // Try SMSBower first
    try {
      purchaseData = await buyFromSmsBower({ country, service });
      console.log("✅ Purchased from SMSBOWER");
    } catch (smsBowerError) {
      console.log("❌ SMSBOWER FAILED:", smsBowerError.message);
      errors.push(`SMSBower: ${smsBowerError.message}`);
      
      // Try NodeOTP
      try {
        purchaseData = await buyFromNodeOtp({ country, service, operator });
        console.log("✅ Purchased from NODEOTP");
      } catch (nodeError) {
        console.log("❌ NODEOTP FAILED:", nodeError.message);
        errors.push(`NodeOTP: ${nodeError.message}`);
        
        // Try SMSActivate
        try {
          purchaseData = await buyFromSmsActivate({ country, service });
          console.log("✅ Purchased from SMSACTIVATE");
        } catch (smsError) {
          console.log("❌ SMSACTIVATE FAILED:", smsError.message);
          errors.push(`SMSActivate: ${smsError.message}`);
          
          return res.status(500).json({
            success: false,
            message: `Failed to purchase number from all providers. Errors: ${errors.join(" | ")}`,
          });
        }
      }
    }
    
    // Calculate pricing with interceptor
    const serviceName = getServiceName(service);
    const countryCode = getCountryCode(country);
    const pricing = await calculateSellingPrice(
      purchaseData.providerCost, 
      serviceName, 
      countryCode
    );
    
    const totalCost = pricing.sellingPrice;
    const profit = pricing.markup;
    
    // Check balance
    if (user.walletBalance < totalCost) {
      // Cancel the number
      if (purchaseData.provider === "smsbower") {
        await cancelSmsBowerNumber(purchaseData.orderId);
      } else if (purchaseData.provider === "nodeotp") {
        await cancelNodeOtpNumber(purchaseData.orderId);
      } else {
        await cancelSmsActivateNumber(purchaseData.orderId);
      }
      
      return res.status(402).json({
        success: false,
        message: "Insufficient balance",
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
    
    // Create order with enhanced pricing info
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
      profitDetails: pricing.profitCalculation, // Store detailed profit info
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
    console.error("BUY NUMBER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to purchase number",
    });
  }
};

// CHECK OTP STATUS
export const checkOtpStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let otpCode = null;
    let status = order.status;

    // Check based on provider
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
      if (
        result.success === true &&
        result.status === "SMS Received" &&
        result.verification_code
      ) {
        otpCode = result.verification_code;
        status = "OTP_RECEIVED";
      } else if (result.status === "SMS Received" && result.code) {
        otpCode = result.code;
        status = "OTP_RECEIVED";
      } else if (result.status === "Cancelled") {
        status = "CANCELLED";
      }
    }

    // Update database
    if (otpCode) {
      order.otpCode = otpCode;
      order.status = status;
      await order.save();
    } else if (status !== order.status) {
      order.status = status;
      await order.save();
    }

    return res.json({
      success: true,
      otpCode: otpCode,
      status: order.status,
      data: {
        _id: order._id,
        phone: order.phone,
        provider: order.provider,
        service: order.service,
        country: order.country,
        cost: order.cost,
      },
    });
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

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.status === "OTP_RECEIVED" || order.status === "COMPLETED") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel - OTP already received",
        });
    }

    if (order.status === "CANCELLED") {
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled" });
    }

    // Cancel with provider
    if (order.provider === "smsbower") {
      await cancelSmsBowerNumber(order.orderId);
    } else if (order.provider === "smsactivate") {
      await cancelSmsActivateNumber(order.orderId);
    } else if (order.provider === "nodeotp") {
      await cancelNodeOtpNumber(order.orderId);
    }

    // Refund user
    const user = await User.findById(userId);
    if (user) {
      user.walletBalance += order.cost;
      await user.save();
    }

    // Update company wallet
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

    return res.json({
      success: true,
      message: "Activation cancelled and refunded",
    });
  } catch (error) {
    console.error("CANCEL ACTIVATION ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER BALANCE
export const getUserBalance = async (req, res) => {
  try {
    const userId = req.user?.id;
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    return res.json({ success: true, balance: wallet.balance });
  } catch (error) {
    console.error("GET BALANCE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET COMPANY STATS
export const getCompanyStats = async (req, res) => {
  try {
    const companyWallet = await CompanyWallet.findOne();
    const totalOrders = await OtpOrder.countDocuments();
    const completedOrders = await OtpOrder.countDocuments({
      status: "OTP_RECEIVED",
    });
    const cancelledOrders = await OtpOrder.countDocuments({
      status: "CANCELLED",
    });

    return res.json({
      success: true,
      data: {
        wallet: companyWallet || {
          totalProfit: 0,
          totalRevenue: 0,
          totalProviderCost: 0,
        },
        stats: {
          totalOrders,
          completedOrders,
          cancelledOrders,
          pendingOrders: totalOrders - completedOrders - cancelledOrders,
        },
      },
    });
  } catch (error) {
    console.error("GET COMPANY STATS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE MARKUP
export const updateMarkup = async (req, res) => {
  try {
    const { profitMarkup } = req.body;

    if (profitMarkup === undefined || isNaN(profitMarkup) || profitMarkup < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid profitMarkup required (>=0)" });
    }

    let settings = await systemSettingsModel.findOne();
    if (!settings) {
      settings = await systemSettingsModel.create({
        profitMarkup: Number(profitMarkup),
      });
    } else {
      settings.profitMarkup = Number(profitMarkup);
      await settings.save();
    }

    return res.json({
      success: true,
      message: "Profit markup updated",
      data: { profitMarkup: settings.profitMarkup },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET ORDER HISTORY
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await OtpOrder.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      data: orders.map((order) => ({
        _id: order._id,
        provider: order.provider,
        phone: order.phone,
        service: order.service,
        country: order.country,
        status: order.status,
        cost: order.cost,
        otpCode: order.otpCode,
        createdAt: order.createdAt,
      })),
    });
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

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET PREFERRED COUNTRIES FOR SERVICE
export const getPreferredCountries = async (req, res) => {
  try {
    const { service } = req.params;
    const serviceName = service?.toLowerCase();

    let countries = [];

    if (serviceName === "whatsapp") {
      countries = preferredCountries.whatsapp;
    } else if (
      serviceName === "google" ||
      serviceName === "gmail" ||
      serviceName === "youtube"
    ) {
      countries = preferredCountries.google;
    } else if (serviceName === "walmart") {
      countries = preferredCountries.walmart;
    } else if (serviceName === "instagram") {
      countries = preferredCountries.instagram;
    } else {
      // Return all available countries
      countries = Object.keys(countryMap).filter(
        (c) => c.length === 2 && c === c.toUpperCase(),
      );
    }

    return res.json({ success: true, service: serviceName, countries });
  } catch (error) {
    console.error("GET PREFERRED COUNTRIES ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET AVAILABLE SERVICES FROM SMSBOWER
export const getAvailableServices = async (req, res) => {
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: process.env.SMS_BOWER_API_KEY,
        action: "getServicesList",
      },
    });

    return res.json({ success: true, services: response.data });
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SMSBOWER BALANCE
export const getSmsBowerBalance = async (req, res) => {
  try {
    const response = await smsBowerApi.get("/stubs/handler_api.php", {
      params: {
        api_key: process.env.SMS_BOWER_API_KEY,
        action: "getBalance",
      },
    });

    return res.json({ success: true, balance: response.data });
  } catch (error) {
    console.error("Get SMSBower balance error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SMSBOWER WEBHOOK HANDLER
export const smsBowerWebhook = async (req, res) => {
  try {
    console.log("📩 SMSBOWER WEBHOOK RECEIVED:", req.body);

    const { activation_id, sms_code, status } = req.body;

    if (!activation_id) {
      return res
        .status(400)
        .json({ success: false, message: "Activation ID missing" });
    }

    const order = await OtpOrder.findOne({
      orderId: activation_id.toString(),
      provider: "smsbower",
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (sms_code) {
      order.otpCode = sms_code;
      order.status = "OTP_RECEIVED";
      order.completedAt = new Date();
      await order.save();
      console.log(`✅ SMSBOWER OTP SAVED: ${sms_code}`);
    }

    if (status === "CANCELLED") {
      order.status = "CANCELLED";
      await order.save();
      console.log(`❌ SMSBOWER ORDER CANCELLED: ${activation_id}`);
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("SMSBOWER WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SMSACTIVATE WEBHOOK
export const smsActivateWebhook = async (req, res) => {
  try {
    console.log("📩 SMSACTIVATE WEBHOOK RECEIVED:", req.body);

    const { activationid, sms_code } = req.body;

    if (!activationid) {
      return res
        .status(400)
        .json({ success: false, message: "Activation ID missing" });
    }

    const order = await OtpOrder.findOne({
      orderId: activationid.toString(),
      provider: "smsactivate",
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (sms_code) {
      order.otpCode = sms_code;
      order.status = "OTP_RECEIVED";
      order.completedAt = new Date();
      await order.save();
      console.log(`✅ SMSACTIVATE OTP SAVED: ${sms_code}`);
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("SMSACTIVATE WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// NODEOTP WEBHOOK
export const nodeOtpWebhook = async (req, res) => {
  try {
    console.log("📩 NODEOTP WEBHOOK RECEIVED:", req.body);

    const { success, event, data } = req.body;

    if (!success || !data) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid webhook payload" });
    }

    const order = await OtpOrder.findOne({
      orderId: data.orderId.toString(),
      provider: "nodeotp",
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (event === "otp_received") {
      order.otpCode = data.code;
      order.status = "OTP_RECEIVED";
      order.completedAt = new Date();
      await order.save();
      console.log(`✅ OTP SAVED: ${data.code}`);
    }

    if (event === "order_cancelled") {
      order.status = "CANCELLED";
      await order.save();
    }

    if (event === "order_expired") {
      order.status = "EXPIRED";
      await order.save();
    }

    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("NODEOTP WEBHOOK ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
