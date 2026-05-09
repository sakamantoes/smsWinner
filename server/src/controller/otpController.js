import OtpOrder from "../model/OtpOrder.js";
import nodeOtpApi from "../utils/nodeOtpApi.js";
import smsActivateApi from "../utils/smsActivateApi.js";

// =============================
// COUNTRY MAPPING
// =============================
const countryMap = {
  // Numeric codes to country names
  '0': 'RU', '1': 'UA', '2': 'KZ', '3': 'US', '4': 'GB',
  '5': 'DE', '6': 'FR', '7': 'IT', '8': 'ES', '9': 'NL',
  '10': 'PL', '11': 'BR', '12': 'MX', '13': 'AR', '14': 'AU',
  '15': 'JP', '16': 'ID', '17': 'TH', '18': 'VN', '19': 'NG',
  '20': 'NO', '21': 'DK', '22': 'CZ', '23': 'PT', '24': 'RO', '25': 'IE',
  // Direct country names
  'us': 'US', 'usa': 'US', 'uk': 'GB', 'ng': 'NG', 'ngeria': 'NG',
  'russia': 'RU', 'ukraine': 'UA', 'kazakhstan': 'KZ', 'germany': 'DE',
  'france': 'FR', 'italy': 'IT', 'spain': 'ES', 'netherlands': 'NL',
  'poland': 'PL', 'brazil': 'BR', 'mexico': 'MX', 'argentina': 'AR',
  'australia': 'AU', 'japan': 'JP', 'indonesia': 'ID', 'thailand': 'TH',
  'vietnam': 'VN', 'norway': 'NO', 'denmark': 'DK', 'czech': 'CZ',
  'portugal': 'PT', 'romania': 'RO', 'ireland': 'IE'
};

// =============================
// SERVICE MAPPING
// =============================
const serviceMap = {
  // Short codes to service names
  'tg': 'telegram', 'go': 'google', 'fb': 'facebook', 'wa': 'whatsapp',
  'ig': 'instagram', 'tw': 'twitter', 'ap': 'apple', 'ms': 'microsoft',
  'dc': 'discord', 'sn': 'snapchat', 'tk': 'tiktok', 'am': 'amazon',
  'gp': 'gmail', 'yt': 'youtube', 'li': 'linkedin', 'zl': 'zoom',
  'ub': 'uber', 'lv': 'line', 'vk': 'vkontakte', 'ok': 'odnoklassniki',
  'ma': 'mailru', 'ya': 'yandex', 'pf': 'paypal', 'st': 'stripe',
  'sp': 'spotify', 'nt': 'netflix', 'hz': 'hbo', 'ds': 'disney',
  // Full names
  'telegram': 'telegram', 'google': 'google', 'facebook': 'facebook',
  'whatsapp': 'whatsapp', 'instagram': 'instagram', 'twitter': 'twitter',
  'apple': 'apple', 'microsoft': 'microsoft', 'discord': 'discord',
  'snapchat': 'snapchat', 'tiktok': 'tiktok', 'amazon': 'amazon',
  'gmail': 'gmail', 'youtube': 'youtube', 'linkedin': 'linkedin',
  'zoom': 'zoom', 'uber': 'uber', 'line': 'line', 'vkontakte': 'vkontakte',
  'odnoklassniki': 'odnoklassniki', 'mailru': 'mailru', 'yandex': 'yandex',
  'paypal': 'paypal', 'stripe': 'stripe', 'spotify': 'spotify',
  'netflix': 'netflix', 'hbo': 'hbo', 'disney': 'disney'
};

// =============================
// HELPER: GET COUNTRY NAME
// =============================
const getCountryName = (countryInput) => {
  const normalized = countryInput?.toString().toLowerCase();
  const mapped = countryMap[normalized];
  
  if (!mapped) {
    // If not found in mapping, assume it's already a valid country code
    const upperCountry = countryInput?.toString().toUpperCase();
    const validCountries = ['US', 'UK', 'GB', 'RU', 'UA', 'KZ', 'DE', 'FR', 'IT', 'ES', 
                           'NL', 'PL', 'BR', 'MX', 'AR', 'AU', 'JP', 'ID', 'TH', 'VN',
                           'NG', 'NO', 'DK', 'CZ', 'PT', 'RO', 'IE'];
    
    if (validCountries.includes(upperCountry)) {
      return upperCountry;
    }
    throw new Error(`Invalid country: ${countryInput}`);
  }
  
  return mapped;
};

// =============================
// HELPER: GET SERVICE NAME
// =============================
const getServiceName = (serviceInput) => {
  const normalized = serviceInput?.toString().toLowerCase();
  const mapped = serviceMap[normalized];
  
  if (!mapped) {
    throw new Error(`Invalid service: ${serviceInput}`);
  }
  
  return mapped;
};

// =============================
// NODEOTP PURCHASE
// =============================
const buyFromNodeOtp = async ({ country, service, operator }) => {
  const response = await nodeOtpApi.post("/order", {
    country,
    service,
    operator: operator || "any",
  });

  if (!response.data.success) {
    throw new Error("NODEOTP_FAILED");
  }

  return {
    provider: "nodeotp",
    orderId: response.data.data.orderId.toString(),
    phone: response.data.data.phone,
    cost: response.data.data.cost || 0,
    raw: response.data,
  };
};

// =============================
// SMSACTIVATE PURCHASE
// =============================
const buyFromSmsActivate = async ({ country, service }) => {
  try {
    const countryName = getCountryName(country);
    const serviceName = getServiceName(service);
    
    console.log(`📞 SMSActivate: Buying ${serviceName} number in ${countryName}`);
    
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

    // Successful response
    if (result.success === true && result.activation_id && result.number) {
      console.log(`✅ Got number: ${result.number} (ID: ${result.activation_id})`);
      return {
        provider: "smsactivate",
        orderId: result.activation_id.toString(),
        phone: result.number,
        cost: parseFloat(result.activation_cost) || 0,
        raw: result,
      };
    }
    
    // Error response
    if (result.success === false) {
      throw new Error(result.error || 'API returned error');
    }
    
    // Handle string error responses
    if (typeof result === 'string') {
      if (result.includes('ERROR') || result.includes('NO_NUMBERS')) {
        throw new Error(result);
      }
    }
    
    throw new Error(`Unexpected response: ${JSON.stringify(result)}`);
    
  } catch (error) {
    console.error("❌ SMSActivate error:", error.message);
    throw new Error(`SMS_ACTIVATE_FAILED: ${error.message}`);
  }
};

// =============================
// MAIN PURCHASE CONTROLLER
// =============================
export const buyNumber = async (req, res) => {
  try {
    const { userId, country, service, operator } = req.body;

    // Validate required fields
    if (!userId || !country || !service) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, country, service"
      });
    }

    let purchaseData;
    let errors = [];

    // Try NODEOTP first
    try {
      purchaseData = await buyFromNodeOtp({ country, service, operator });
      console.log("✅ Purchased from NODEOTP");
    } catch (nodeError) {
      console.log("❌ NODEOTP FAILED:", nodeError.message);
      errors.push(`NodeOTP: ${nodeError.message}`);
      
      // Fallback to SMSACTIVATE
      try {
        purchaseData = await buyFromSmsActivate({ country, service });
        console.log("✅ Purchased from SMSACTIVATE");
      } catch (smsError) {
        console.log("❌ SMSACTIVATE FAILED:", smsError.message);
        errors.push(`SMSActivate: ${smsError.message}`);
        
        return res.status(503).json({
          success: false,
          message: "All providers failed to purchase number",
          errors: errors
        });
      }
    }

    // Save to database
    const order = await OtpOrder.create({
      userId,
      provider: purchaseData.provider,
      orderId: purchaseData.orderId,
      phone: purchaseData.phone,
      service: service,
      country: getCountryName(country) || country,
      operator: operator || "any",
      status: "WAITING_FOR_SMS",
      cost: purchaseData.cost || 0,
      rawResponse: purchaseData.raw,
    });

    return res.status(201).json({
      success: true,
      provider: purchaseData.provider,
      data: {
        _id: order._id,
        phone: order.phone,
        status: order.status,
        cost: order.cost,
        createdAt: order.createdAt
      },
    });
    
  } catch (error) {
    console.error("Buy number error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to purchase number",
    });
  }
};

// =============================
// CHECK OTP STATUS
// =============================
export const checkOtpStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let otpCode = null;
    let status = order.status;

    // =========================
    // NODEOTP STATUS
    // =========================
    if (order.provider === "nodeotp") {
      const response = await nodeOtpApi.get(`/order/${order.orderId}/status`);

      if (response.data?.data?.code) {
        otpCode = response.data.data.code;
        status = "OTP_RECEIVED";
      }
    }

    // =========================
    // SMSACTIVATE STATUS
    // =========================
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

      // Check for SMS received
      if (result.success === true && result.status === "SMS Received" && result.verification_code) {
        otpCode = result.verification_code;
        status = "OTP_RECEIVED";
      }
      
      // Check alternative response format
      if (result.status === "SMS Received" && result.code) {
        otpCode = result.code;
        status = "OTP_RECEIVED";
      }
      
      // Handle cancellation
      if (result.status === "Cancelled") {
        status = "CANCELLED";
      }
      
      // Handle not found
      if (result.status === "Not Found") {
        status = "FAILED";
      }
    }

    // Update database if OTP received or status changed
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
      otpCode,
      status: order.status,
      order: {
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
    console.error("Check OTP status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// CANCEL ACTIVATION
// =============================
export const cancelActivation = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "OTP_RECEIVED" || order.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that already received OTP",
      });
    }

    // Cancel with provider
    if (order.provider === "smsactivate") {
      const response = await smsActivateApi.get("/sms.php", {
        params: {
          api_key: process.env.SMS_ACTIVATE_API_KEY,
          action: "cancel_number",
          activation_id: order.orderId,
        },
      });
      
      console.log("Cancel response:", response.data);
    }
    
    // For NodeOTP cancel (adjust endpoint as needed)
    if (order.provider === "nodeotp") {
      // Add NodeOTP cancel logic here if available
      // await nodeOtpApi.post(`/order/${order.orderId}/cancel`);
    }

    order.status = "CANCELLED";
    await order.save();

    return res.json({
      success: true,
      message: "Activation cancelled successfully",
      order: {
        _id: order._id,
        status: order.status,
      },
    });
    
  } catch (error) {
    console.error("Cancel activation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET BALANCE (SMSACTIVATE)
// =============================
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
    console.error("Get balance error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// GET AVAILABLE SERVICES
// =============================
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

// =============================
// GET ORDER DETAILS
// =============================
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OtpOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order: {
        _id: order._id,
        userId: order.userId,
        provider: order.provider,
        phone: order.phone,
        service: order.service,
        country: order.country,
        operator: order.operator,
        otpCode: order.otpCode,
        status: order.status,
        cost: order.cost,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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