const express = require("express");

const app = express();

const { connectDB } = require("./config/database");

const User = require("./models/user");

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is sucessfully listening on the port 7777...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
