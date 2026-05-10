import axios from "axios";

const initialiseDeposit = async (req, res, next) => {
  const { amount, transactionId, referenceId, paymentMethod } = req.body;
  const user = req.user;
  try {
    const transaction = await WalletTransaction.create({
      userId: user._id,
      amount,
      type: "DEPOSIT",
      transactionId,
      reference: referenceId,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Deposit initiated, you will be notified once it's processed",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const webhookHandler = async (req, res, next) => {
  const event = req.body;

  {
    try {
    } catch (error) {}
  }
};

export { initialiseDeposit, webhookHandler };
