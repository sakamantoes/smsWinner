import User from "../model/User.js";
import mongoose from "mongoose";
import PurchaseReceipt from "../model/PurchaseReceipt.js";
import WalletTransaction from "../model/WalletTransactions.js";
import PricingSetting from "../model/PriceSetting.js";
import calculateSellingPrice from "../utils/calculateSellingPrice.js";
import AvailableService from "../model/ServicesAvailable.js";
import { countries, services } from "../utils/neededCountries.js";
import axios from "axios";
import { env } from "../config/constant.js";
import OtpOrder from "../model/OtpOrder.js";
import recieptNumberGenerator from "../utils/recieptNo.generator.js";

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

const getUserOtpOrders = async (req, res, next) => {
  const user = req.user;

  try {
    const userExist = await User.findById({ _id: user._id });

    if (!userExist) {
      res.statusCode = 401;
      throw new Error("User not found");
    }

    const otpOrders = await OtpOrder.find({
      userId: userExist._id,
    }).sort({ _id: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      message: "request was successfull",
      data: otpOrders,
    });
  } catch (error) {
    next(error);
  }
};

const checkUserOtpOrderStatus = async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.params;
  const now = new Date();

  try {
    if (!orderId) {
      res.statusCode = 400;
      throw new Error("invalid id params");
    }

    const otpOrder = await OtpOrder.findById(orderId);

    if (!otpOrder) {
      res.statusCode = 404;
      throw new Error("otp order not found");
    }

    if (otpOrder.userId.toString() !== user._id.toString()) {
      res.statusCode = 403;
      throw new Error("You are not authorized to access this resource");
    }

    if (
      ["OTP_RECEIVED", "COMPLETED", "CANCELLED", "FAILED"].includes(
        otpOrder.status,
      )
    ) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "request was successfull",
        otpCode: otpOrder.otpCode,
        otpMessage: otpOrder.otpMessage,
        data: otpOrder,
      });
    }

    if (otpOrder.expiresAt && now > otpOrder.expiresAt) {
      res.statusCode = 400;
      throw new Error(
        "otp session expired, click the cancel button to get a refund",
      );
    }

    const otpStatus = await axios.get(
      "https://smsbower.page/stubs/handler_api.php",
      {
        params: {
          api_key: env.sms_bower_api_key,
          action: "getStatus",
          id: otpOrder.activationId,
        },
      },
    );

    const response = otpStatus.data;
    let otpCode = otpOrder.otpCode;
    let otpMessage = otpOrder.otpMessage;
    let status = otpOrder.status;

    if (typeof response === "string") {
      otpMessage = response;

      if (response.startsWith("STATUS_OK")) {
        const parts = response.split(":");
        otpCode = parts[parts.length - 1];
        status = "OTP_RECEIVED";
      }

      if (response === "STATUS_CANCEL") {
        status = "CANCELLED";
      }

      if (
        response === "STATUS_WAIT_CODE" ||
        response.startsWith("STATUS_WAIT_RETRY")
      ) {
        status = "WAITING_FOR_SMS";
      }
    } else if (response && typeof response === "object") {
      otpMessage =
        response.text ||
        response.smsText ||
        response.message ||
        JSON.stringify(response);
      otpCode = response.code || response.smsCode || otpCode;

      if (otpCode) {
        status = "OTP_RECEIVED";
      }
    }

    const hasChanges =
      otpOrder.otpCode !== otpCode ||
      otpOrder.otpMessage !== otpMessage ||
      otpOrder.status !== status ||
      (status === "OTP_RECEIVED" && !otpOrder.completedAt);

    if (hasChanges) {
      otpOrder.otpCode = otpCode;
      otpOrder.otpMessage = otpMessage;
      otpOrder.status = status;

      if (status === "OTP_RECEIVED" && !otpOrder.completedAt) {
        otpOrder.completedAt = new Date();
      }

      await otpOrder.save();
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "request was successfull",
      otpCode,
      otpMessage,
      data: otpOrder,
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
      const matchedService = countries.find(
        (i) => i.countryId === Number(item.country),
      );

      return {
        ...item,

        countryName: matchedService?.country || "Unknown",

        sellingPrice: calculateSellingPrice(item, priceSetting),
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

const buyNumberService = async (req, res, next) => {
  const user = req.user;
  const { service, country } = req.body;
  const session = await mongoose.startSession();
  const receiptNo = recieptNumberGenerator();
  let finalResult = null;
  let activationId = null;
  let transactionSucceeded = false;

  try {
    const isUser = await User.findById(user._id);

    if (!isUser) {
      res.statusCode = 400;
      throw new Error("unAuthorise access");
    }

    const activeService = await AvailableService.findOne({
      service,
      country,
      active: true,
    });

    if (!activeService) {
      res.statusCode = 400;
      throw new Error("service not available at the moment");
    }

    const priceSetting = await PricingSetting.findOne({});

    if (!priceSetting) {
      res.statusCode = 400;

      throw new Error("error fetching price");
    }

    const price = calculateSellingPrice(activeService, priceSetting);

    if (isUser.walletBalance < price) {
      res.statusCode = 400;
      throw new Error("insufficient funds");
    }

    const buyBowerNumber = await axios.get(
      `https://smsbower.page/stubs/handler_api.php?api_key=${env.sms_bower_api_key}&action=getNumberV2&service=${activeService.service}&country=${activeService.country}&maxPrice=${activeService.providerPrice}&providerIds=${activeService.providerId}&exceptProviderIds=$exceptProviderIds&userID=${env.sms_bower_user_id}&minPrice=${0.0001}`,
    );

    if (!buyBowerNumber || !buyBowerNumber.data) {
      res.statusCode = 400;

      throw new Error("our provider not currently available");
    }

    const response = buyBowerNumber.data;

    if (typeof response === "string") {
      res.statusCode = 400
      throw new Error(response);
    }
    const activationTime = new Date(response.activationTime);
    activationId = response.activationId;

    const expiresAt = new Date(activationTime.getTime() + 10 * 60 * 1000);
    await session.withTransaction(async () => {
      const [otpOrder] = await OtpOrder.create(
        [
          {
            service,
            country,
            status: "WAITING_FOR_SMS",
            phoneNumber: response.phoneNumber,
            activationId: response.activationId,
            sellingPrice: price,
            userId: isUser._id,
            providerPrice: response.activationCost,
            canGetAnotherSms: response.canGetAnotherSms,
            activationOperator: response.activationOperator,
            expiresAt,
          },
        ],
        {
          session,
        },
      );

      await User.findByIdAndUpdate(
        isUser._id,
        {
          $inc: {
            walletBalance: -price,
          },
        },
        { session },
      );

      if (!otpOrder) {
        res.statusCode = 400;
        throw new Error("something went wrong saving order");
      }

      const userBalance = isUser.walletBalance;
      const userAfteBalance = isUser.walletBalance - price;

      const [receipt] = await PurchaseReceipt.create(
        [
          {
            userId: isUser._id,
            amount: price,
            itemModel: "OtpOrder",
            itemId: otpOrder._id,
            receiptNo,
            purchaseType: "OTP",
            description: "number purchase",
            balanceAfter: Number(userAfteBalance),
            balanceBefore: Number(userBalance),
          },
        ],
        {
          session,
        },
      );

      if (!receipt) {
        res.statusCode = 400;
        throw new Error("an error occured, so purchase will be reversed");
      }

      finalResult = { receipt, otpOrder };
    });
    transactionSucceeded = true;

    res.status(200).json({
      status: 200,
      sucess: true,
      message: "you purchase was successsfull",
      data: finalResult,
    });
  } catch (error) {
    if (activationId && !transactionSucceeded) {
      await axios.get(
        `https://smsbower.page/stubs/handler_api.php?api_key=${env.sms_bower_api_key}&action=setStatus&status=8&id=${activationId}`,
      );
    }
    next(error);
  } finally {
    await session.endSession();
  }
};

const cancelOtpAndRefund = async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.params;
  const session = await mongoose.startSession();
  const receiptNo = recieptNumberGenerator();
  let finalResult = null;

  try {
    if (!orderId) {
      res.statusCode = 400;
      throw new Error("invalid id parameters");
    }

    const userOrderExist = await OtpOrder.findOne({
      userId: user._id,
      activationId: orderId,
    });

    if (!userOrderExist) {
      res.statusCode = 404;
      throw new Error("otp order not found");
    }

    // already completed
    if (["OTP_RECEIVED", "COMPLETED"].includes(userOrderExist.status)) {
      res.statusCode = 400;
      throw new Error("otp already received");
    }

    // already cancelled
    if (["CANCELLED", "FAILED"].includes(userOrderExist.status)) {
      res.statusCode = 400;
      throw new Error("otp already cancelled");
    }

    // cancel from provider
    const smsBowerCancel = await axios.get(
      `https://smsbower.page/stubs/handler_api.php?api_key=${env.sms_bower_api_key}&action=setStatus&status=8&id=${userOrderExist.activationId}`,
    );

    const response = smsBowerCancel.data;

    // if provider fails to cancel
    if (response !== "ACCESS_CANCEL") {
      res.statusCode = 400;
      throw new Error("provider failed to cancel otp");
    }

    await session.withTransaction(async () => {
      // cancel order
      const updatedOrder = await OtpOrder.findByIdAndUpdate(
        userOrderExist._id,
        {
          $set: {
            status: "CANCELLED",
            cancelReason: "Cancelled by user",
          },
        },
        {
          session,
          new: true,
        },
      );

      if (!updatedOrder) {
        throw new Error("failed to update otp order");
      }

      // refund wallet
      const userSaved = await User.findByIdAndUpdate(
        user._id,
        {
          $inc: {
            walletBalance: Number(userOrderExist.sellingPrice),
          },
        },
        {
          session,
          new: true,
        },
      );

      // invalid user
      if (!userSaved) {
        throw new Error("user not found");
      }

      const balanceAfter = userSaved.walletBalance;

      const balanceBefore = balanceAfter - userOrderExist.sellingPrice;

      // generate receipt for record purpose
      const [receipt] = await PurchaseReceipt.create(
        [
          {
            userId: user._id,
            amount: userOrderExist.sellingPrice,
            itemModel: "OtpOrder",
            itemId: userOrderExist._id,
            receiptNo,
            purchaseType: "OTP_REFUND",
            description: "OTP order cancelled and refunded",
            balanceAfter: Number(balanceAfter),
            balanceBefore: Number(balanceBefore),
          },
        ],
        {
          session,
        },
      );

      if (!receipt) {
        throw new Error("failed to create refund receipt");
      }

      finalResult = {
        receipt,
        order: updatedOrder,
      };
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "otp cancelled and refunded successfully",
      data: finalResult,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

export {
  getUserWalletBalance,
  getAllUserDeposit,
  getPurchaseHistory,
  getUserOtpOrders,
  checkUserOtpOrderStatus,
  getPlatformServices,
  buyNumberService,
  cancelOtpAndRefund,
};
