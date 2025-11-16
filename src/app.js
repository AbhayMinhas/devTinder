const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser"); 
const cors = require('cors'); 

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials:true,
  }
));//with credentials true even if we are on http not https we can still send the cookies and receive the data safely on the network 
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is sucessfully listening on the port 7777...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected"+err);
  });
