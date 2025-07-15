const express = require("express");

const app = express();
//error handling
//right now we don't have error at top
//get error when thrown
//so it will not go to "/" no error present then go to "/getUserData"
app.use("/", (err, req, res, next) => {
  console.log("went in / but no error")
    if (err) {
    //log your error message
    //you should also be notified in **SENTRY** OR OTHER SERVICES logging and monitoring service can be sent a notification/alert
    res.status(500).send("something went wrong");//good instead of showing random error
  }
});
app.get("/getUserData", (req, res) => {
    //Logic of DB call and get user data if there is an error it will be exposed to handle that we can use
    //try catch
    // try{
    //     //logic of DB call and get user data
    //     throw new Error("dvbzhjf");
        
    // }
    // catch(err){
    //     res.status(500).send("some Error contact support team");
    // }
    
    throw new Error("dvbzhjf");
    res.send("User Data Sent");
});

//match all the routes
//we can also add error as first parameter
// 2 parameters  first request and second is response
//3 req res and third is next
//4 first error req res next
//order matters
app.use("/", (err, req, res, next) => {
    console.log("went in with error");
  if (err) {
    //log your error message
    //you should also be notified in **SENTRY** OR OTHER SERVICES logging and monitoring service can be sent a notification/alert
    res.status(500).send("something went wrong");//good instead of showing random error
  }
});//this wild card error handling should be kept at the end 

 //if any random error comes in from any of the route then it will handle it 
// send appropriate status code use to communicate with frontend it should know WHAT STATUS CODE MEANS WHAT 500,503,401,402,404 any error is send the ui can handle gracefully

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
