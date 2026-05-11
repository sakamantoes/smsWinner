import axios from "axios";
import { env } from "../config/constant.js";
import WalletTransaction from "../model/WalletTransactions.js";
import Wallet from "../model/Wallet.js";
import crypto from "crypto";
import mongoose from "mongoose";

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

    const value = squad.data.data;
    const transaction = await WalletTransaction.create({
      userId: user._id,
      amount: value.transaction_amount / 100,
      type: "DEPOSIT",
      referenceId: value.transaction_ref,
      paymentMethod: "SQUAD",
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
  const { referenceId } = req.query;

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

    console.log("Webhook event received: ", event);

    if (hash !== req.headers["x-squad-signature"]) {
      res.statusCode = 401;
      throw new Error("Invalid signature");
    }

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
        res.statusCode = 404;
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
        res.statusCode = 400;
        throw new Error("Webhook amount does not match transaction amount");
      }

      const wallet = await Wallet.findOneAndUpdate(
        { userId: transaction.userId },
        {
          $setOnInsert: { userId: transaction.userId },
          $inc: { balance: amountToCredit },
        },
        {
          new: true,
          upsert: true,
          session,
        },
      );

      transaction.status = "SUCCESS";
      transaction.orderId = event.Body?.gateway_ref || transaction.orderId;
      transaction.balanceAfter = wallet.balance;
      transaction.balanceBefore = wallet.balance - amountToCredit;

      await transaction.save({ session });

      webhookResult = {
        referenceId,
        status: transaction.status,
        credited: true,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
      };
    });

    res.status(200).json({
      success: true,
      message: "Webhook processed",
      data: webhookResult,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

export {
  initialiseDeposit,
  webhookHandler,
  callbackUrlHandler,
  getPaymentStatus,
};


// Webhook event received:  {
//   Event: 'charge_successful',
//   TransactionRef: 'SQJABE6391404711062900019',
//   Body: {
//     amount: 20000,
//     transaction_ref: 'SQJABE6391404711062900019',
//     gateway_ref: 'SQJABE6391404711062900019_1_18_1',
//     transaction_status: 'Success',
//     email: 'emmanueldartey02@gmail.com',
//     merchant_id: 'SBBHFY3B8W',
//     currency: 'NGN',
//     transaction_type: 'Card',
//     merchant_amount: 19800,
//     created_at: '2026-05-10T22:58:30.648',
//     meta: {},
//     payment_information: {
//       payment_type: 'card',
//       pan: '424242******4242|0526',
//       card_type: 'verve'
//     },
//     is_recurring: false
//   }
// }
