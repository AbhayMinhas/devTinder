//creating express router

const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// app.use();
// router.user();
//logic how to write code , how it behaves,middleware,route handler everything works the same way as app.use

authRouter.post("/signup", async (req, res) => {
  //first thing that should happen is  Validation of data
  try {
    validateSignUpData(req);
    //throwing error by validation func will catched by catche block -- write in try catch

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //after express.json req.body is exactly same as the format of User object
    //replace the User({}) object with req.body

    //Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT(); //for whatever current user is this user token will come back

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); //cookie expires in 8 hrs
    res.json({ message: "User added sucessfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //write emailId validation ,no password validation is required as anything can be there

    const user = await User.findOne({ emailId: emailId });
    //if email is not there/not valid
    //user will be undefined or null

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT Token
      const token = await user.getJWT(); //for whatever current user is this user token will come back

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); //cookie expires in 8 hrs

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  //Do clean up activities for sessions or want to do logs etc before but for this app this is enough
  //no need to authenticate user either way login or not can use this api
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successful!!");
  //chaining the methods
});

module.exports = authRouter;
//assume that this is inside the auth file so this router is auth router
//authRouter write like this for better understanding
//generally in companies people write router
