// controllers/adminProfitController.js

import priceInterceptor from "../utils/priceInterceptor.js";
import systemSettingsModel from "../model/systemSettingsSchema.js";

/**
 * Get current admin profit configuration
 */
export const getAdminProfitConfig = async (req, res) => {
  try {
    const config = await priceInterceptor.getAdminProfitConfig();
    return res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error("Get admin profit config error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update admin profit configuration
 */
export const updateAdminProfitConfig = async (req, res) => {
  try {
    const {
      enabled,
      profitType,
      profitValue,
      minProfit,
      maxProfit,
      applicableServices,
      applicableCountries
    } = req.body;

    // Validate required fields
    if (enabled === true) {
      if (!profitType || !['fixed', 'percentage'].includes(profitType)) {
        return res.status(400).json({
          success: false,
          message: "profitType must be 'fixed' or 'percentage' when enabled"
        });
      }

      if (profitValue === undefined || isNaN(profitValue) || profitValue < 0) {
        return res.status(400).json({
          success: false,
          message: "profitValue must be a positive number"
        });
      }

      if (profitType === 'percentage' && profitValue > 100) {
        return res.status(400).json({
          success: false,
          message: "Percentage cannot exceed 100%"
        });
      }
    }

    const updateConfig = {
      enabled: enabled !== undefined ? enabled : false,
      profitType: profitType || 'fixed',
      profitValue: profitValue || 0,
      minProfit: minProfit || 0,
      maxProfit: maxProfit || null,
      applicableServices: applicableServices || [],
      applicableCountries: applicableCountries || []
    };

    const result = await priceInterceptor.updateAdminProfitConfig(updateConfig);
    
    return res.json(result);
  } catch (error) {
    console.error("Update admin profit config error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Enable/disable admin profit
 */
export const toggleAdminProfit = async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (enabled === undefined) {
      return res.status(400).json({
        success: false,
        message: "enabled flag is required"
      });
    }
    
    const result = await priceInterceptor.setAdminProfitEnabled(enabled);
    return res.json(result);
  } catch (error) {
    console.error("Toggle admin profit error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Set fixed profit amount
 */
export const setFixedProfit = async (req, res) => {
  try {
    const { amount, minProfit, maxProfit, applicableServices, applicableCountries } = req.body;
    
    if (!amount || isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }
    
    const result = await priceInterceptor.setFixedProfit(amount, {
      minProfit: minProfit || 0,
      maxProfit: maxProfit || null,
      applicableServices: applicableServices || [],
      applicableCountries: applicableCountries || []
    });
    
    return res.json(result);
  } catch (error) {
    console.error("Set fixed profit error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Set percentage profit
 */
export const setPercentageProfit = async (req, res) => {
  try {
    const { percentage, minProfit, maxProfit, applicableServices, applicableCountries } = req.body;
    
    if (!percentage || isNaN(percentage) || percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        message: "Valid percentage (0-100) is required"
      });
    }
    
    const result = await priceInterceptor.setPercentageProfit(percentage, {
      minProfit: minProfit || 0,
      maxProfit: maxProfit || null,
      applicableServices: applicableServices || [],
      applicableCountries: applicableCountries || []
    });
    
    return res.json(result);
  } catch (error) {
    console.error("Set percentage profit error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get price preview (for admin to see how prices will be affected)
 */
export const getPricePreview = async (req, res) => {
  try {
    const { providerCost, service, country } = req.query;
    
    if (!providerCost || isNaN(providerCost)) {
      return res.status(400).json({
        success: false,
        message: "providerCost is required"
      });
    }
    
    const profitCalculation = await priceInterceptor.calculateProfit(
      parseFloat(providerCost),
      service,
      country
    );
    
    return res.json({
      success: true,
      data: profitCalculation
    });
  } catch (error) {
    console.error("Get price preview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};