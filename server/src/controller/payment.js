import axios from "axios";
import { env } from "../config/constant.js";
import WalletTransaction from "../model/WalletTransactions.js";
import User from "../model/User.js";
import crypto from "crypto";
import mongoose from "mongoose";
import {
  sendDepositSuccessNotification,
  sendDepositFailedNotification,
  sendPaymentReceivedNotification,
} from "./notificationController.js";

const normalizeSquadStatus = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  if (normalizedStatus === "success" || normalizedStatus === "successful") {
    return "SUCCESS";
  }

  if (normalizedStatus === "failed" || normalizedStatus === "failure") {
    return "FAILED";
  }

  return "PENDING";
};

const initialiseDeposit = async (req, res, next) => {
  const { amount } = req.body;
  const user = req.user;

  try {
    const data = {
      email: user.email,
      amount: Number(amount * 100),
      currency: "NGN",
      initiate_type: "inline",
      callback_url: "http://localhost:5173/payment/status",
    };

    const squad = await axios.post(
      "https://sandbox-api-d.squadco.com/transaction/initiate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${env.squad_api_secret}`,
        },
      },
    );

    if (!squad || squad.data.success === false || !squad.data.data) {
      res.statusCode = 500;
      throw new Error(squad.data.message || "Failed to initiate deposit");
    }

    const value = squad.data.data;

    await WalletTransaction.create({
      userId: user._id,
      amount: value.transaction_amount / 100,
      type: "DEPOSIT",
      referenceId: value.transaction_ref,
      paymentMethod: "SQUAD",
      depositorName: user.username,
    });

    res.status(201).json({
      success: true,
      message: "Deposit initiated, you will be notified once it's processed",
      data: value.checkout_url,
    });
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.response?.status);
    next(error);
  }
};

const callbackUrlHandler = async (req, res, next) => {
  const { referenceId } = req.body;

  try {
    const transaction = await WalletTransaction.findOne({
      referenceId,
    });

    if (!transaction) {
      res.statusCode = 404;
      throw new Error("Transaction not found");
    }

    res.status(200).json({
      success: true,
      message: "Transaction callback received",
      data: transaction.status,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentStatus = async (req, res, next) => {
  const { referenceId } = req.body;

  try {
    const transaction = await WalletTransaction.findOne({ referenceId });

    if (!transaction) {
      res.statusCode = 404;
      throw new Error("Transaction not found");
    }

    res.status(200).json({
      success: true,
      message: "Payment status fetched",
      data: {
        referenceId: transaction.referenceId,
        status: transaction.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const webhookHandler = async (req, res, next) => {
  const event = req.body;
  const session = await mongoose.startSession();

  try {
    const hash = crypto
      .createHmac("sha512", env.squad_api_secret)
      .update(JSON.stringify(event))
      .digest("hex")
      .toUpperCase();

    if (hash !== req.headers["x-squad-encrypted-body"]) return;

    res.send(200);

    const referenceId = event.TransactionRef || event.Body?.transaction_ref;
    const gatewayStatus = normalizeSquadStatus(event.Body?.transaction_status);

    if (!referenceId) {
      res.statusCode = 400;
      throw new Error("Transaction reference is required");
    }

    let webhookResult = {
      referenceId,
      status: gatewayStatus,
      credited: false,
    };

    await session.withTransaction(async () => {
      const transaction = await WalletTransaction.findOne({
        referenceId,
      }).session(session);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.status === "SUCCESS") {
        webhookResult = {
          referenceId,
          status: transaction.status,
          credited: false,
          message: "Transaction already processed",
        };
        return;
      }

      if (gatewayStatus !== "SUCCESS") {
        transaction.status = gatewayStatus;
        await transaction.save({ session });

        // Send failure notification
        await sendDepositFailedNotification(
          transaction.userId,
          transaction.amount,
          referenceId,
          event.Body?.failure_reason || "Payment processing failed",
        );

        webhookResult = {
          referenceId,
          status: transaction.status,
          credited: false,
        };
        return;
      }

      const amountToCredit = transaction.amount;
      const webhookAmount = Number(event.Body?.amount) / 100;

      if (Number.isFinite(webhookAmount) && webhookAmount !== amountToCredit) {
        throw new Error("Webhook amount does not match transaction amount");
      }

      const wallet = await User.findOneAndUpdate(
        { _id: transaction.userId },
        {
          $setOnInsert: { _id: transaction.userId },
          $inc: { walletBalance: amountToCredit },
        },
        {
          new: true,
          upsert: true,
          session,
        },
      );

      transaction.status = "SUCCESS";
      transaction.orderId = event.Body?.gateway_ref || transaction.orderId;
      transaction.balanceAfter = wallet.walletBalance;
      transaction.balanceBefore = wallet.walletBalance - amountToCredit;

      await transaction.save({ session });

      // Send success notification
      await sendDepositSuccessNotification(
        transaction.userId,
        amountToCredit,
        referenceId,
        wallet.walletBalance,
      );

      webhookResult = {
        referenceId,
        status: transaction.status,
        credited: true,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
      };
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// manual payment
const initializeManualPayment = async (req, res, next) => {
  const { amount, transactionId, depositorName } = req.body;
  const user = req.user;
  try {
    const transaction = await WalletTransaction.create({
      userId: user._id,
      amount: Number(amount),
      type: "DEPOSIT",
      referenceId: transactionId,
      paymentMethod: "MANUAL_TRANSFER",
      depositorName,
    });

    // Send notification for manual payment received
    await sendPaymentReceivedNotification(
      user._id,
      Number(amount),
      transactionId,
      depositorName,
    );

    if (!transaction) {
      res.statusCode = 400;
      throw new Error("an error occured while updating payment");
    }

    res.status(201).json({
      status: 200,
      success: true,
      message:
        "your payment has been recieved, once payment is confirmed it will reflect in your balance",
      data: transaction,
    });
  } catch (error) {
    if (error?.code === 11000) {
      res.statusCode = 400;
      return next(
        new Error("This transaction reference has already been submitted"),
      );
    }

    next(error);
  }
};

export {
  initialiseDeposit,
  webhookHandler,
  callbackUrlHandler,
  getPaymentStatus,
  initializeManualPayment,
};
