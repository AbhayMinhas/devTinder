const express = require("express");

const app = express();

const {adminAuth,userAuth} = require("./middlewares/auth.js");


//GET req to  /users => express check route matching => go through the chain of middlewares and then it will handle the response
//=> It checks all the app.xxx("matching route") functions
//send response and go no further
//try to go to each of these api's
//if writing / handle all the response
// app.use("/",(req,res,next)=>{
//   // res.send("handling / route");
//   next();
// });

// app.use("/route",rH,[rH2,rH3],rH4,rh5);
//wrapping routes inside an array works the same way as not wrapping

//in app.use func the first is the route second is route handler there can be musltiple route handler
//3rd parameter is next given by express js and req and res object is also passed
// app.use(
//   "/user",
//   (req, res, next) => {
//     //route handler
//     // res.send("Route handler 1");
//     //if res not sent req will go to infinite loop in postman
//     console.log("Handling the route user");
//     next();
//     // res.send("Response!!");

//      //call the next function it will go to the next route handler
//   },
//   (req, res,next) => {
//     //route handler 2
//     console.log("Handling the route user 2");
//     //code will send error when trying to send response through same url
//     //as the response is already sent
//     //tcp connection is made open a connection send the data and close connection and the connection is lost
//     //give error in terminal
//     // res.send("2nd Response!!");
//     next();
//   },
//   [(req,res,next)=>{
//     console.log("Handling the route user 3!!");
//     // res.send("3rd Response!!");
//     next();
//   },
//   (req,res,next)=>{
//     console.log("Handling the route user 4!!");
//     // res.send("4th response!!");
//     next();//print cannot get user error in postman "Cannot GET user"
//     //there is not other route handler
//     //sending end response is necessary
//   }],
//   (req,res,next)=>{
//     console.log("Handling the route user 5");
//     res.send("5th rsponse!!");
//   }
// );

// app.get('/user',(req,res,next)=>{
//   console.log("Handling /user route");
//   next();
// },);
// app.get("/user",(req,res,next)=>{
//   console.log("Handling the route user!!");
//   res.send("2nd route Handler");
// });
//works exactly the same way
//again go to /user on next()

//route handler is Just the function that actually is handling route and sending the response back
//the function you put in the middle are known as middlewares
//these are called in the middle of the req chain or method chain thats why called middleware

//Handle auth middleware for all req GET,POST,

//generally the middleware is written using app.use() we want our middleware to work for post get req etc. or you can write for seperate get requests based on scenario
//all the req starting with /admin is handeled by this
//there is also app.all subtle difference between app.use and app.all in routing
//but use app.use
app.use("/admin",adminAuth);
//importing adminAuth function form auth.js 
//

app.post("/user/login",(req,res)=>{
  res.send("User logged in sucessfully");//for login api no user auth restrection needed
});

app.get('/user',userAuth,(req,res)=>{
  res.send("User Data Sent");
});//as we have only one user route we can write imported middleware function like this

app.get("/admin/getAllData", (req, res) => {
  //logic of Checking if the request is authorized

  res.send("All Data Sent");

  //will you rewrite the code for all the admin api's for authorization
  //this is where middleware works
});
app.get("/admin/deleteUser", (req, res) => {
  //Logic of fetching all data

  res.send("Deleted a User");
});

app.listen(7777, () => {
  console.log("server is successfully listning on port 7777...");
});
