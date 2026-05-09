import Log from "../model/Logs.js";
import { maskEmail, maskPassword } from "../utils/maskDate.js";

// create log
const createLog = async (req, res) => {
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
const getLogs = async (req, res) => {
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
const buyLog = async (req, res) => {
  try {
    const { id } = req.params;

    // Logged in user
    const userId = req.user._id;

    const log = await Log.findById(id);

    if (!log) {
     res.statusCode = 400;
     throw new Error("Log not found");
    }

    if (log.sold) {
        res.statusCode = 400;
        throw new Error("Log already sold");
    }

//   mark as sold
    log.sold = true;
    log.soldTo = userId;
    log.purchasedAt = new Date();

    await log.save();

//    auto delete after 24 hours
    setTimeout(
      async () => {
        try {
          await Log.findByIdAndDelete(log._id);
          console.log("Sold log auto deleted");
        } catch (err) {
            console.error("Error auto deleting log:", err.message);
        }
      },
      24 * 60 * 60 * 1000,
    );

    res.status(200).json({
      success: true,
      message: "Log purchased successfully",
      log: {
        email: log.email,
        password: log.password,
        price: log.price,
        country: log.country,
      },
    });
  } catch (error) {
   next(error);
  }
};

// update log
const updateLog = async (req, res) => {
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
const deleteLog = async (req, res) => {
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
const myPurchasedLogs = async (req, res) => {
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
