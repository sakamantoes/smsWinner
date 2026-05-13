import User from "../model/User.js";
import WalletTransaction from "../model/WalletTransactions.js";

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
        data: walletTransaction ,
      });

  } catch (error) {
    next(error);
  }
};
export { getUserWalletBalance, getAllUserDeposit };
