const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
// the razorpayInstace is initialized with the key and password

const Payment = require("../models/payments");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const user = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const membershipType = req.body.type;
    const { firstName, lastName, emailId } = req.user;

    console.log(req.user._id);
    console.log("membership" + membershipType);
    //amount is in paisa if the currency is usd then it is cents
    //in every currency the low denominations in this case 50000 paisa --> 500 rupees
    //receipt id can be in increasing order
    // this is a partial payment or full payment by default false if not put in
    //notes is like a meta data you want to attach with the payments
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      //   partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });
    //pass all this information and razorpay will give you back a promise it will create an order
    //we will receive the response back with all the order id and it's details
    // once receive that order sucessfully

    // save it in my database
    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // return back my order details to forntend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR: " + err);
  }
});

//user auth should not be there in the webhook validation as razor pay will not logged in
//make sure the name matches with the name in account settings webhook.
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    //whatever the reqbody will be this is what you'll have to pass over here in webhookBody
    //webhookSignature is the header with this name X-Razorpay-Signature
    //which is a hash signature sent with each payload created using webhook signature, this req header was something that you need to verify.

    // const webhookSignature = req.headers["X-Razorpay-Signature"];
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    //Update my payment Status in DB
    //get paymentDetails from here
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({
      _id: payment.userId,
    });
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    //Update the user as premium
    await user.save();

    // if(req.body.event == "payment.captured"){

    // }
    // if(req.body.event == "payment.failed"){

    // }


    //return success response to razorpay



    

    return res.status(200).json({ msg: "Webhook received sucessfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
