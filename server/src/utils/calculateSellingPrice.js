const calculateSellingPrice = (providerPriceUsd, settings) => {
  const nairaPrice = providerPriceUsd * settings.usdToNgnRate;

  if (settings.globalMarkupType === "percentage") {
    return nairaPrice + (nairaPrice * settings.globalMarkupValue) / 100;
  }

  return nairaPrice + settings.globalMarkupValue;
};

export default calculateSellingPrice;
