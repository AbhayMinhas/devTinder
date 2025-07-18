const express = require("express");

const { connectDB } = require("./config/database");
//library mongoose has sucessfully established the connection with the database //this is refering to the cluster
// inside the cluser there are multiple type of database

/*we need to first connect to the database then listen to the server
if server starts first and api req is made by user to db but db is not connected then it will be a problem .
 */
const app = express();
const User = require('./models/user');

//using this post method & create an api which will signup the user
app.post("/signup", async (req, res) => {
//   const userObj = {
//     firstName: "Abhay",
//     lastName: "Minhas",
//     emailId: "abhayminhas1@gmail.com",
//     password: "abhay",
//   };

  //if i want to save this user to our mongodb DB collection
  //we will need to create a new instance of this model and add this database to this model and save that instance 
  //creating a new User whith this data or 

  // **technically creating a new instance of the user model**
  // **new NameOfTheModel(pass the data of that new model that you want to save)**

// **  const user = new User(userObj);
//created new instance of user model
    const user = new User({
    firstName: "sachin",
    lastName: "tendulkar",
    emailId: "sachin@gmail.com",
    password: "sachin@123",
  });
try{

  await user.save();
  res.send("User Added successfully");

}
catch(err){
  //400->bad request
  res.status(400).send("Error saving the user:"+err.message);
}
  //calling .save on the instance of the model this data will be saved onto a database and this function will return you a promise

/* most of the mongoose functions 
putting the data to database ,saving it
,getting the data
all of these functions methods and api's will return you a promise
most of time we'll have to use async await
//use await for user to save and make the post callback as async func
*/

res.send('user added successfully');

});


connectDB()
  .then(() => {
    console.log("Database connection established");
    //proper way of connecting to the DB and start application and then start listning to the api calls
    //once db connection is sucessfully established then we will do app.listen
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });



  