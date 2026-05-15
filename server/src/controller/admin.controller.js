import WalletTransaction from "../model/WalletTransactions.js";
import mongoose from "mongoose";
import User from "../model/User.js";
import PriceSetting from "../model/PriceSetting.js";

const getPlatformDeposits = async (req, res, next) => {
  try {
    const deposits = await WalletTransaction.find({});

    if (!deposits) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "your deposits was successfull",
        data: [],
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "your deposits was successfull",
      data: deposits,
    });
  } catch (error) {
    next(error);
  }
};

const updateDepositsStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const session = await mongoose.startSession();

  let finalResult = null;

  try {
    if (!mongoose.Types.ObjectId.isValid(id) || id === undefined) {
      res.statusCode = 400;
      throw new Error("Invalid transaction ID");
    }

    if (!status) {
      res.statusCode = 400;
      throw new Error("missing status");
    }

    const statusValue = status.toUpperCase();

    await session.withTransaction(async () => {
      const transaction = await WalletTransaction.findOneAndUpdate(
        {
          _id: id,
          status: { $in: ["PENDING", "FAILED"] },
        },
        {
          $set: {
            status: statusValue,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!transaction) {
        res.statusCode = 400;

        throw new Error("you can only update pending or failed transaction");
      }

      if (statusValue !== "SUCCESS") {
        finalResult = transaction;
        return;
      }

      const user = await User.findOneAndUpdate(
        {
          _id: transaction.userId,
        },
        {
          $inc: {
            walletBalance: transaction.amount,
          },
        },
        {
          session,
          new: true,
        },
      );

      transaction.balanceBefore = user.walletBalance - transaction.amount;

      transaction.balanceAfter = user.walletBalance;

      await transaction.save({ session });

      finalResult = { receipt: transaction, user };
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "your request is successful",
      data: finalResult,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

const priceSettingController = async (req, res, next) => {
  const { nairaRate, markupType, markupValue } = req.body;
  try {
    const priceSetting = await PriceSetting.findOneAndUpdate(
      {},
      {
        usdToNgnRate: nairaRate,
        globalMarkupType: markupType,
        globalMarkupValue: markupValue,
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "you have successfully updated product price",
      data: priceSetting,
    });
  } catch (error) {
    next(error);
  }
};

export { getPlatformDeposits, updateDepositsStatus, priceSettingController };
