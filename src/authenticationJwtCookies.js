const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
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

app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("User added sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //write emailId validation ,no password validation is required as anything can be there

    const user = await User.findOne({ emailId: emailId });
    //if email is not there/not valid
    //user will be undefined or null

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //plaintxtpwd + hash return true/false

    if (isPasswordValid) {
      //Create a JWT Token

      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

      // console.log(token);

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
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

//Get user by email
app.get("/user", async (req, res) => {
  //read the req find the email
  const userEmail = req.body.emailId;
  //user in db with this email id
  //use the keyword emailId as this is the fileld name
  try {
    const user = await User.findOne({ emailId: userEmail });
    //returns the first document that it finds , it returns the oldest document
    //return first document which matches the query criteria
    //The conditions are cast to their respective SchemaTypes before the command is sent.
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }

    //key should match exactly with the schema field name ie emailId
    //if wrong no throwing error if there is a typo

    // const users = await User.find({ emailId: userEmail });
    // //trying to find all the users with email id and sending back the response
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    //   // 404 status code, commonly known as "Not Found", indicates that the server cannot locate the requested resource
    // } else {
    //   res.send(users);
    //   //giving back the array of objects
    //   //that array only has one object that is with my email id
    // }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
  //pass a filter it takes a js object

  // User.find({emailId:req.body.emailId});
  //we can also directly write it like this
});

//Feed API - GET /feed - get all the users form the database
app.get("/feed", async (req, res) => {
  //whenever we want to get the data form the data base we should know which model you have to use what are you getting form the database
  //if getting User s the we have to query using this

  try {
    const users = await User.find({});
    //passing an empty filter in find will return all the documents in the collection
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Delete a user form the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
    const users = await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  // keep ? after params so that if userId is not present your code will not fail
  const data = req.body;

  // console.log(data);
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    //   {
    //     "userId":"6880788a979a1a9220ffe964",
    //     "emailId":"aliaaaaa@bhatt.com",
    //     "gender":"female",
    //     "skills":["acting","drama","javascript"],
    //     "xyz":"skhvkdbfj"
    // }
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    //looping through every keys is present in the allowed updates and checking that
    // if any of this is not allowed then my is update allowed is false

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    //update will not be allowed if sending random fields over here
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    //*in data there is also a userId field but it is not created when data is updated
    //what mongodb does is it ignores this field
    //as there is nothing like userId in the schema
    //if not present in schema it will not be added to the database

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    }); //run the validations when the method is called

    // const user = await User.findByIdAndUpdate(userId,data,{returnDocument:"before"});
    //*default value is before if not pass this returnDocument
    //there is a option which is options.returnDocument
    //when api will be called and update happen
    //before will return the user document before the update was applied
    //after return document after update
    console.log(user);

    //**findbyIdAndUpdate is calling findoneandUpdate behind the scenes
    //findByIdAndUpdate and findOneAndUpdate is one and the same thing the difference is that in find in id we only give id and oneandupdate can also take other things
    res.send("User updated sucessfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
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

/*
  Note: conditions is optional, and if conditions is null or undefined, mongoose will send an empty findOne command to MongoDB, which will return an arbitrary document. If you're querying by _id, use findById() instead.

Example:
// Find one adventure whose `country` is 'Croatia', otherwise `null`
await Adventure.findOne({ country: 'Croatia' }).exec();

// Model.findOne() no longer accepts a callback

// Select only the adventures name and length
await Adventure.findOne({ country: 'Croatia' }, 'name length').exec();

  */
