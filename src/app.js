const express = require("express");

const app = express();

const { connectDB } = require("./config/database");

const User = require("./models/user");

//how to use the middleware??like this
app.use(express.json());
//middleware activated for all the routes
//this request handler will run on every req that comes to our server
//app.use + no route given + pass a function work for all the routes

//**express.json()->reads the json object converts it into js object and adds that js obj back to req object in the body
//**now the req.body is a js object and we are able to read body  */

//* Uncomment form here once
// app.post("/signup", async (req, res) => {
//   //req -->whole request that postman has sent
//   //express convert req to object and it has given to us to use it
//   //data sent is also a part of this req
//   //cannot read data directly form here(req)

//   // console.log(req);
//   /*<ref *2> IncomingMessage {
//   _events: {
//     close: undefined,
//     error: undefined,
//     data: undefined,
//     end: undefined,
//     readable: undefined
//   },
//   _readableState: ReadableState {*/
//   //this incoming message is like a readable stream data is sent in chunks

//   //we want to read the data which is in the body of this request

//   console.log(req.body);
//   //undefined
//   //getting the body as undefined
//   //reason : - the data sent over here is in json format and our server is not able to read that json data
//   //to read that json data we will need a middleware
//   //we will use this middleware for almost all api's

//   /*middleware that checks the incoming request and convert json into a js object put it into the body and give us access to the data*/

//   //Middleware Given to us by express
//   //express.json
//   //previously needed to build ourselves or use third party middleware
// });
//*till here

app.post("/signup", async (req, res) => {
  //after express.json req.body is exactly same as the format of User object
  //replace the User({}) object with req.body

  //Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

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
