const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;

    // const { token } = req.cookies;
    // //Validate my token
    // if (!token) {
    //   throw new Error("Invalid Token");
    // }

    // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    // //this does not give you a boolean
    // //it gives you a decoded value,iat is used by jwt ignore it
    // // console.log(decodedMessage);

    // const { _id } = decodedMessage;
    // // console.log("Logged In user is: "+_id);

    // const user = await User.findById(_id);
    // if (!user) {
    //   //token valid but user doesn't exits
    //   throw new Error("User does not exist");
    // }

    // // console.log(cookies);

    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;