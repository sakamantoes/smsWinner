import WalletTransaction from "../model/WalletTransactions.js";

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
  try {
    if (!id || id === undefined) {
      res.statusCode = 400;
      throw new Error("missing parameters id");
    }

    const statusValue = status.toUpperCase();

    const updateDeposit = await WalletTransaction.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { status: statusValue },
      },
      {new: true}
    );

    if(!updateDeposit) {
        res.statusCode = 400
        throw new Error ("somethibng went wrong updating deposit status")
    }

    res.status(200).json({
        status: 200,
        success: true,
        message: "your request is successful",
        data: updateDeposit
    })
  } catch (error) {
    next(error);
  }
};


export {getPlatformDeposits, updateDepositsStatus }