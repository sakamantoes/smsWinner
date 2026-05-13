import mongoose from "mongoose";
import Log from "../model/Logs.js";
import User from "../model/User.js";
import Wallet from "../model/Wallet.js";
import { maskEmail, maskPassword } from "../utils/maskDate.js";

// create log
const createLog = async (req, res, next) => {
  try {
    const { email, password, price, country } = req.body;

    const log = await Log.create({
      email,
      password,
      price,
      country,
    });

    res.status(201).json({
      success: true,
      message: "Log uploaded successfully",
      log,
    });
  } catch (error) {
    next(error);
  }
};

// get all logs
const getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find({ sold: false });

    const maskedLogs = logs.map((log) => ({
      _id: log._id,
      email: maskEmail(log.email),
      password: maskPassword(log.password),
      price: log.price,
      country: log.country,
      sold: log.sold,
      createdAt: log.createdAt,
    }));

    res.status(200).json({
      success: true,
      logs: maskedLogs,
    });
  } catch (error) {
    next(error);
  }
};

// buy log
const buyLog = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const session = await mongoose.startSession();
  const recieptNo = recieptNumberGenerator();
  try {
    let finalResult = null;

    await session.withTransaction(async () => {
      const isUser = await User.findById(userId).session(session);

      if (!isUser) {
        res.statusCode = 401;
        throw new Error("UnAuthorized Access");
      }

      const log = await Log.findById(id).session(session);

      if (!log) {
        res.statusCode = 400;
        throw new Error("Log not found");
      }

      if (log.sold) {
        res.statusCode = 400;
        throw new Error("Log already sold");
      }

      const userWallet = await Wallet.findOneAndUpdate(
        {
          userId: isUser._id,
          balance: { $gte: log.price },
        },
        {
          $inc: { balance: -log.price },
        },
        {
          session,
          new: true,
        },
      );

      if (!userWallet) {
        res.statusCode = 400;
        throw new Error("Insufficient balance");
      }

      const [reciept] = await PurchaseReceipt.create(
        [
          {
            userId: isUser._id,
            purchaseType: "LOG",
            itemId: log._id,
            itemModel: "Log",
            recieptNo: recieptNo,
            amount: log.price,
            balanceBefore: userWallet.balance + log.price,
            balanceAfter: userWallet.balance,
          },
        ],
        {
          session,
        },
      );

      log.sold = true;
      log.soldTo = isUser._id;
      log.purchasedAt = new Date();

      await log.save({ session });

      console.log("log purchase was successfull ");
      finalResult = { log, reciept };
    });

    //   mark as sold

    res.status(200).json({
      success: true,
      message: "Log purchased successfully",
      data: finalResult,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// update log
const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { email, password, price, country } = req.body;

    const log = await Log.findById(id);

    if (!log) {
      res.statusCode = 400;
      throw new Error("Log not found");
    }

    log.email = email || log.email;
    log.password = password || log.password;
    log.price = price || log.price;
    log.country = country || log.country;

    await log.save();

    res.status(200).json({
      success: true,
      message: "Log updated successfully",
      log,
    });
  } catch (error) {
    next(error);
  }
};

// delete log
const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await Log.findById(id);

    if (!log) {
      res.statusCode = 400;
      throw new Error("Log not found");
    }

    await log.deleteOne();

    res.status(200).json({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get my purchased logs
const myPurchasedLogs = async (req, res, next) => {
  try {
    const logs = await Log.find({
      soldTo: req.user._id,
    });

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

export { createLog, getLogs, buyLog, updateLog, deleteLog, myPurchasedLogs };
