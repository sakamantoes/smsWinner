import User from "../model/User.js";
import PurchaseReceipt from "../model/PurchaseReceipt.js";
import WalletTransaction from "../model/WalletTransactions.js";
import PricingSetting from "../model/PriceSetting.js";
import calculateSellingPrice from "../utils/calculateSellingPrice.js";
import AvailableService from "../model/ServicesAvailable.js";
import { services } from "../utils/neededCountries.js";

const getUserWalletBalance = async (req, res, next) => {
  const user = req.user;
  try {
    const userExist = await User.findById({ _id: user._id });

    if (!userExist) {
      res.statusCode = 401;
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: userExist.walletBalance,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserDeposit = async (req, res, next) => {
  const user = req.user;

  try {
    const userExist = await User.findById({ _id: user._id });

    if (!userExist) {
      res.statusCode = 401;
      throw new Error("User not found");
    }

    const walletTransaction = await WalletTransaction.find({
      userId: userExist._id,
      type: "DEPOSIT",
    }).sort({ _id: -1 });

    if (!walletTransaction || walletTransaction.length === 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "request was successfull",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "request was successfull",
      data: walletTransaction,
    });
  } catch (error) {
    next(error);
  }
};

const getPurchaseHistory = async (req, res, next) => {
  const user = req.user;

  try {
    const userExist = await User.findById({ _id: user._id });

    if (!userExist) {
      res.statusCode = 401;
      throw new Error("User not found");
    }

    const receiptTransaction = await PurchaseReceipt.find({
      userId: userExist._id,
    }).sort({ _id: -1 });

    if (!receiptTransaction || receiptTransaction.length === 0) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "request was successfull",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "request was successfull",
      data: receiptTransaction,
    });
  } catch (error) {
    next(error);
  }
};

const getPlatformServices = async (req, res, next) => {
  try {
    const priceSetting = await PricingSetting.findOne({});

    if (!priceSetting) {
      res.statusCode = 400;

      throw new Error("error fetching price");
    }

    const availableServices = await AvailableService.find({
      active: true,
      stock: { $gt: 0 },
    }).lean();

    const finalProduct = availableServices.map((item) => {
      const matchedService = services.find(
        (i) => i.countryId === item.country && i.service === item.service,
      );

      return {
        ...item,

        countryName: matchedService?.country || "Unknown",

        sellingPrice: calculateSellingPrice(
          item.providerPrice,
          priceSetting,
        ),
      };
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "list of all available pricing",
      data: finalProduct,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getUserWalletBalance,
  getAllUserDeposit,
  getPurchaseHistory,
  getPlatformServices,
};
