// utils/priceInterceptor.js

import systemSettingsModel from "../model/systemSettingsSchema.js";

class PriceInterceptor {
  constructor() {
    this.adminProfitConfig = null;
    this.lastUpdated = null;
  }

  /**
   * Load admin profit configuration from database
   */
  async loadAdminProfitConfig() {
    try {
      let settings = await systemSettingsModel.findOne();
      if (!settings) {
        // Create default settings if none exist
        settings = await systemSettingsModel.create({
          profitMarkup: 0,
          adminProfitConfig: {
            enabled: false,
            profitType: 'fixed', // 'fixed' or 'percentage'
            profitValue: 0,
            minProfit: 0,
            maxProfit: null,
            applicableServices: [], // empty means all services
            applicableCountries: [] // empty means all countries
          }
        });
      }
      
      this.adminProfitConfig = settings.adminProfitConfig || {
        enabled: false,
        profitType: 'fixed',
        profitValue: 0,
        minProfit: 0,
        maxProfit: null,
        applicableServices: [],
        applicableCountries: []
      };
      
      this.lastUpdated = new Date();
      return this.adminProfitConfig;
    } catch (error) {
      console.error('Error loading admin profit config:', error);
      return null;
    }
  }

  /**
   * Calculate profit based on admin configuration
   * @param {number} basePrice - Original API price
   * @param {string} service - Service name (e.g., 'whatsapp', 'google')
   * @param {string} country - Country code (e.g., 'NG', 'US')
   * @returns {object} { profit, finalPrice, originalPrice, profitType }
   */
  async calculateProfit(basePrice, service = null, country = null) {
    // Ensure config is loaded
    if (!this.adminProfitConfig) {
      await this.loadAdminProfitConfig();
    }

    const config = this.adminProfitConfig;
    
    // If admin profit is disabled, return zero profit
    if (!config || !config.enabled) {
      return {
        profit: 0,
        finalPrice: basePrice,
        originalPrice: basePrice,
        profitType: 'none',
        profitPercentage: 0
      };
    }

    // Check if service is applicable
    if (config.applicableServices && config.applicableServices.length > 0) {
      if (service && !config.applicableServices.includes(service.toLowerCase())) {
        return {
          profit: 0,
          finalPrice: basePrice,
          originalPrice: basePrice,
          profitType: 'none',
          profitPercentage: 0
        };
      }
    }

    // Check if country is applicable
    if (config.applicableCountries && config.applicableCountries.length > 0) {
      if (country && !config.applicableCountries.includes(country.toUpperCase())) {
        return {
          profit: 0,
          finalPrice: basePrice,
          originalPrice: basePrice,
          profitType: 'none',
          profitPercentage: 0
        };
      }
    }

    let profit = 0;
    let profitPercentage = 0;

    // Calculate profit based on type
    if (config.profitType === 'fixed') {
      profit = config.profitValue;
    } else if (config.profitType === 'percentage') {
      profitPercentage = config.profitValue;
      profit = (basePrice * config.profitValue) / 100;
    }

    // Apply min/max constraints
    if (config.minProfit && profit < config.minProfit) {
      profit = config.minProfit;
    }
    
    if (config.maxProfit && profit > config.maxProfit) {
      profit = config.maxProfit;
    }

    const finalPrice = basePrice + profit;

    return {
      profit: Math.round(profit * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      originalPrice: Math.round(basePrice * 100) / 100,
      profitType: config.profitType,
      profitPercentage: config.profitType === 'percentage' ? config.profitValue : (profit / basePrice * 100)
    };
  }

  /**
   * Update admin profit configuration
   * @param {object} newConfig - New profit configuration
   * @returns {object} Updated configuration
   */
  async updateAdminProfitConfig(newConfig) {
    try {
      let settings = await systemSettingsModel.findOne();
      
      if (!settings) {
        settings = await systemSettingsModel.create({
          profitMarkup: 0,
          adminProfitConfig: newConfig
        });
      } else {
        settings.adminProfitConfig = {
          ...settings.adminProfitConfig,
          ...newConfig
        };
        await settings.save();
      }
      
      // Reload config
      await this.loadAdminProfitConfig();
      
      return {
        success: true,
        message: 'Admin profit configuration updated successfully',
        config: this.adminProfitConfig
      };
    } catch (error) {
      console.error('Error updating admin profit config:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get current admin profit configuration
   */
  async getAdminProfitConfig() {
    if (!this.adminProfitConfig) {
      await this.loadAdminProfitConfig();
    }
    return this.adminProfitConfig;
  }

  /**
   * Enable or disable admin profit
   * @param {boolean} enabled - Enable or disable
   */
  async setAdminProfitEnabled(enabled) {
    return this.updateAdminProfitConfig({ enabled });
  }

  /**
   * Set fixed profit amount
   * @param {number} amount - Fixed profit amount in NGN
   * @param {object} options - Additional options (min, max, services, countries)
   */
  async setFixedProfit(amount, options = {}) {
    const config = {
      enabled: true,
      profitType: 'fixed',
      profitValue: amount,
      ...options
    };
    return this.updateAdminProfitConfig(config);
  }

  /**
   * Set percentage profit
   * @param {number} percentage - Profit percentage
   * @param {object} options - Additional options (min, max, services, countries)
   */
  async setPercentageProfit(percentage, options = {}) {
    const config = {
      enabled: true,
      profitType: 'percentage',
      profitValue: percentage,
      ...options
    };
    return this.updateAdminProfitConfig(config);
  }
}

// Create singleton instance
const priceInterceptor = new PriceInterceptor();

// Initialize on startup
priceInterceptor.loadAdminProfitConfig().catch(console.error);

export default priceInterceptor;