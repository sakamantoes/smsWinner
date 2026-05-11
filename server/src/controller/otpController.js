// controllers/otpController.js

import OtpOrder from "../model/OtpOrder.js";
import User from "../model/User.js";
import Transaction from "../model/Transaction.js";
import CompanyWallet from "../model/CompanyWallet.js";
import nodeApi from "../utils/nodeOtpApi.js";
import smsActivateApi from "../utils/smsActivateApi.js";
import systemSettingsModel from "../model/systemSettingsSchema.js";
import Wallet from "../model/Wallet.js";

// PRICING ENGINE
const calculateSellingPrice = async (providerCost) => {
  const settings = await systemSettingsModel.findOne();

  const markup = settings?.profitMarkup || 1.0;

  const sellingPrice = providerCost + markup;

  return {
    providerCost,
    markup,
    sellingPrice,
  };
};

// COMPLETE COUNTRY MAPPING
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
  // Direct country names
  us: "US",
  usa: "US",
  uk: "GB",
  ng: "NG",
  nigeria: "NG",
  russia: "RU",
  ukraine: "UA",
  kazakhstan: "KZ",
  germany: "DE",
  france: "FR",
  italy: "IT",
  spain: "ES",
  netherlands: "NL",
  poland: "PL",
  brazil: "BR",
  mexico: "MX",
  argentina: "AR",
  australia: "AU",
  japan: "JP",
  indonesia: "ID",
  thailand: "TH",
  vietnam: "VN",
  norway: "NO",
  denmark: "DK",
  czech: "CZ",
  portugal: "PT",
  romania: "RO",
  ireland: "IE",
};

const getCountryName = (countryInput) => {
  const normalized = countryInput?.toString().toLowerCase();
  const mapped = countryMap[normalized];

  if (!mapped) {
    const upperCountry = countryInput?.toString().toUpperCase();
    const validCountries = [
      "US",
      "UK",
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
    ];

    if (validCountries.includes(upperCountry)) {
      return upperCountry;
    }
    throw new Error(`Invalid country: ${countryInput}`);
  }

  return mapped;
};

// COMPLETE SERVICE MAPPING
const serviceMap = {
  // Short codes to service names
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
};

const getServiceName = (serviceInput) => {
  const normalized = serviceInput?.toString().toLowerCase();
  const mapped = serviceMap[normalized];

  if (!mapped) {
    throw new Error(`Invalid service: ${serviceInput}`);
  }

  return mapped;
};

// BUY FROM NODEOTP
const buyFromNodeOtp = async ({ country, service, operator }) => {
  try {
    const response = await nodeApi.post("/order", {
      country,
      service,
      operator: operator || "any",
    });

    console.log("NODEOTP RESPONSE:");
    console.log(response.data);

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
    console.log("❌ FULL NODEOTP ERROR");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);

      const apiError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;

      throw new Error(apiError);
    }

    throw new Error(error.message);
  }
};

// BUY FROM SMSACTIVATE
const buyFromSmsActivate = async ({ country, service }) => {
  try {
    const countryName = getCountryName(country);
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
    console.log("📱 SMSActivate Response:", JSON.stringify(result, null, 2));

    if (result.success === true && result.activation_id && result.number) {
      console.log(
        `✅ Got number: ${result.number} (ID: ${result.activation_id})`,
      );
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

    if (typeof result === "string") {
      if (result.includes("ERROR") || result.includes("NO_NUMBERS")) {
        throw new Error(result);
      }
    }

    throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("❌ SMSActivate error:", error.message);
    throw new Error(`SMS_ACTIVATE_FAILED: ${error.message}`);
  }
};

// CANCEL SMSACTIVATE NUMBER

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

// CANCEL NODEOTP NUMBER

const cancelNodeOtpNumber = async (orderId) => {
  try {
    await nodeApi.post(`/order/${orderId}/cancel`);
    console.log(`✅ Cancelled NodeOTP order ${orderId}`);
  } catch (error) {
    console.error("❌ NODEOTP CANCEL ERROR:", error.message);
  }
};

// buy number controller

export const buyNumber = async (req, res, next) => {
  try {
    // Get userId from authenticated user (NOT from request body)
    const userId = req.user?.id;
    const { country, service, operator } = req.body;

    // Validation
    if (!userId) {
      res.statusCode = 401;
      throw new Error("Unauthorized: User ID missing");
    }

    if (!country || !service) {
      res.statusCode = 400;
      throw new Error("Country and service are required");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.statusCode = 404;
      throw new Error("User not found");
    }

    // Purchase number (try NodeOTP first, fallback to SMSActivate)
    let purchaseData;
    let errors = [];

    try {
      purchaseData = await buyFromNodeOtp({ country, service, operator });
      console.log("✅ Purchased from NODEOTP");
    } catch (nodeError) {
      console.log("❌ NODEOTP FAILED:", nodeError.message);
      errors.push(`NodeOTP: ${nodeError.message}`);

      try {
        purchaseData = await buyFromSmsActivate({ country, service });
        console.log("✅ Purchased from SMSACTIVATE");
      } catch (smsError) {
        console.log("❌ SMSACTIVATE FAILED:", smsError.message);
        errors.push(`SMSActivate: ${smsError.message}`);

        res.statusCode = 500;
        throw new Error(
          `Failed to purchase number from both providers. Errors: ${errors.join(
            " | ",
          )}`,
        );
      }
    }

    // Calculate pricing with markup
    const pricing = await calculateSellingPrice(purchaseData.providerCost);
    const providerCost = pricing.providerCost;
    const totalCost = pricing.sellingPrice;
    const profit = pricing.markup;

    // Check if user has sufficient balance
    if (user.walletBalance < totalCost) {
      // Cancel the purchased number since user can't pay
      if (purchaseData.provider === "nodeotp") {
        await cancelNodeOtpNumber(purchaseData.orderId);
      } else {
        await cancelSmsActivateNumber(purchaseData.orderId);
      }

      return res.status(402).json({
        success: false,
        message: "Insufficient balance",
        required: totalCost,
        available: user.walletBalance,
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
    companyWallet.totalProviderCost += providerCost;
    await companyWallet.save();

    // Create order in database
    const order = await OtpOrder.create({
      userId,
      provider: purchaseData.provider,
      orderId: purchaseData.orderId,
      phone: purchaseData.phone,
      service: service,
      country: getCountryName(country),
      operator: operator || "any",
      status: "WAITING_FOR_SMS",
      cost: totalCost,
      providerCost: providerCost,
      profit: profit,
      rawResponse: purchaseData.raw,
    });

    // Create transaction record
    await Transaction.create({
      userId,
      type: "OTP_PURCHASE",
      provider: purchaseData.provider,
      amount: totalCost,
      providerCost: providerCost,
      profit: profit,
      description: `Purchased ${service} OTP number in ${country}`,
      orderId: order._id,
    });

    // Return success response
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
        profit: order.profit,
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

export const checkOtpStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this order",
      });
    }

    let otpCode = null;
    let status = order.status;

    // Check NodeOTP status
    if (order.provider === "nodeotp") {
      const response = await nodeApi.get(`/order/${order.orderId}/status`);

      if (response.data?.data?.code) {
        otpCode = response.data.data.code;
        status = "OTP_RECEIVED";
      }
    }

    // Check SMSActivate status
    if (order.provider === "smsactivate") {
      const response = await smsActivateApi.get("/sms.php", {
        params: {
          api_key: process.env.SMS_ACTIVATE_API_KEY,
          action: "get_sms",
          activation_id: order.orderId,
        },
      });

      const result = response.data;
      console.log("SMSActivate Status Response:", result);

      if (
        result.success === true &&
        result.status === "SMS Received" &&
        result.verification_code
      ) {
        otpCode = result.verification_code;
        status = "OTP_RECEIVED";
      }

      if (result.status === "SMS Received" && result.code) {
        otpCode = result.code;
        status = "OTP_RECEIVED";
      }

      if (result.status === "Cancelled") {
        status = "CANCELLED";
      }

      if (result.status === "Not Found") {
        status = "FAILED";
      }
    }

    // Update database if OTP received
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
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("CHECK OTP STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CANCEL ACTIVATION

export const cancelActivation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (order.status === "OTP_RECEIVED" || order.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that has already received OTP",
      });
    }

    if (order.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // Cancel with provider
    if (order.provider === "smsactivate") {
      await cancelSmsActivateNumber(order.orderId);
    } else if (order.provider === "nodeotp") {
      await cancelNodeOtpNumber(order.orderId);
    }

    // Refund user (full amount)
    const user = await User.findById(userId);
    if (user) {
      user.walletBalance += order.cost;
      await user.save();
    }

    // Update company wallet (deduct profit)
    const companyWallet = await CompanyWallet.findOne();
    if (companyWallet) {
      companyWallet.totalProfit -= order.profit;
      companyWallet.totalRevenue -= order.cost;
      companyWallet.totalProviderCost -= order.providerCost;
      await companyWallet.save();
    }

    // Update order status
    order.status = "CANCELLED";
    await order.save();

    // Create transaction record for refund
    await Transaction.create({
      userId,
      type: "REFUND",
      provider: order.provider,
      amount: -order.cost,
      providerCost: -order.providerCost,
      profit: -order.profit,
      description: `Refund for cancelled ${order.service} OTP`,
      orderId: order._id,
    });

    return res.json({
      success: true,
      message: "Activation cancelled and refunded successfully",
    });
  } catch (error) {
    console.error("CANCEL ACTIVATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER BALANCE
export const getUserBalance = async (req, res) => {
  try {
    const userId = req.user?.id;

    let wallet = await Wallet.findOne({ userId });

    // 🟢 CREATE WALLET IF NOT EXISTS
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
      });
    }

    return res.json({
      success: true,
      balance: wallet.balance,
    });

  } catch (error) {
    console.error("GET BALANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET COMPANY STATS (Admin only)

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMarkup = async (req, res, next) => {
  try {
    const { profitMarkup } = req.body;

    // VALIDATION
    if (profitMarkup === undefined || isNaN(profitMarkup)) {
      return res.status(400).json({
        success: false,
        message: "Valid profitMarkup is required",
      });
    }

    // Prevent negative markup
    if (Number(profitMarkup) < 0) {
      return res.status(400).json({
        success: false,
        message: "profitMarkup cannot be negative",
      });
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
      message: "Profit markup updated successfully",
      data: {
        profitMarkup: settings.profitMarkup,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET ORDER HISTORY (User specific)

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SMSACTIVATE BALANCE (Admin utility)

export const getSmsActivateBalance = async (req, res) => {
  try {
    const response = await smsActivateApi.get("/sms.php", {
      params: {
        api_key: process.env.SMS_ACTIVATE_API_KEY,
        action: "account_balance",
      },
    });

    return res.json({
      success: true,
      balance: response.data,
    });
  } catch (error) {
    console.error("Get SMSActivate balance error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET AVAILABLE SERVICES (Utility)

export const getAvailableServices = async (req, res) => {
  try {
    const response = await smsActivateApi.get("/sms.php", {
      params: {
        api_key: process.env.SMS_ACTIVATE_API_KEY,
        action: "get_services",
      },
    });

    return res.json({
      success: true,
      services: response.data,
    });
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ORDER DETAILS

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user (unless admin)
    if (order.userId.toString() !== userId) {
      // Check if user is admin here if you have admin role
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this order",
      });
    }

    return res.json({
      success: true,
      data: {
        _id: order._id,
        userId: order.userId,
        provider: order.provider,
        orderId: order.orderId,
        phone: order.phone,
        service: order.service,
        country: order.country,
        operator: order.operator,
        otpCode: order.otpCode,
        status: order.status,
        cost: order.cost,
        providerCost: order.providerCost,
        profit: order.profit,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        rawResponse: order.rawResponse,
      },
    });
  } catch (error) {
    console.error("Get order details error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
