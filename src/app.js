const express = require("express");

const app = express();

// app.use("/route",rH,[rH2,rH3],rH4,rh5);
//wrapping routes inside an array works the same way as not wrapping



//in app.use func the first is the route second is route handler there can be musltiple route handler
//3rd parameter is next given by express js and req and res object is also passed
app.use(
  "/user",
  (req, res, next) => {
    //route handler
    // res.send("Route handler 1");
    //if res not sent req will go to infinite loop in postman
    console.log("Handling the route user");
    next();
    // res.send("Response!!");

     //call the next function it will go to the next route handler
  },
  (req, res,next) => {
    //route handler 2
    console.log("Handling the route user 2");
    //code will send error when trying to send response through same url
    //as the response is already sent
    //tcp connection is made open a connection send the data and close connection and the connection is lost
    //give error in terminal
    // res.send("2nd Response!!");
    next();
  },
  [(req,res,next)=>{
    console.log("Handling the route user 3!!");
    // res.send("3rd Response!!");
    next();
  },
  (req,res,next)=>{
    console.log("Handling the route user 4!!");
    // res.send("4th response!!");
    next();//print cannot get user error in postman "Cannot GET user"
    //there is not other route handler
    //sending end response is necessary
  }],
  (req,res,next)=>{
    console.log("Handling the route user 5");
    res.send("5th rsponse!!");
  }
);

app.listen(7777, () => {
  console.log("server is successfully listning on port 7777...");
});
