const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
//you can reuse it in populate

//GET all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);
    //filter can be wiritten in a string with space seperated fields or can be written in an array
    //there are more way of writing this.

    //populate fromUserId form the reference (i.e User collection)
    //populate("formUserId",pass the list of data that i need form that)
    //If not pass second parameter it will send every thing which is there inside the User object ,it will just send us back
    //this is very very bad way mail id and password and all additional information will also be sent
    //DO NOT OVERFETCH DATA BE VERY SPECIFIC ABOUT WHAT YOU ARE TRYING TO FETCH
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Akshay => Elon => accepted
    //Elon => Akshay => accepted

    // const connectionRequests = await ConnectionRequest.find({
    //   $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    //   status: "accepted",
    // }); //this is my code

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    //A user is asking for connections so i want the array of the users connected
    //no need for the data of the whole connections document.no need of touserid formuserid etc.

    console.log(connectionRequests);

    //modify the data accordingly
    const data = connectionRequests.map((row) => {
      //you cannot compare to mongoose id like this with === ,
      //  call this tostring this will now check the string inside the object id
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    //for each row we will just send back row.fromUserId

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //User should see all the user cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    //Example :Rahul=>[ Akshay, Elon, Mark, Donald, MS Dhoni, Virat]
    //R-> Akshay->rejected R-> Elon-> Accepted
    //[Mark, Donald, MS Dhoni, Virat]
    const loggedInUser = req.user;
    //we have to snitize the page and limit so db not suffer
    const page = parseInt(req.query.page) || 1; //the numbers will be in string convert them into int
    //if the limit is xyz the it will not parse and the OR value is assigned
    let limit = parseInt(req.query.limit) || 10;
    //take it form req.query not req.params
    //req.params will be when you make api like /feed/:skip?
    //this is query not params
    //http://localhost:7777/feed?page=1&limit=2
    //http://localhost:7777/feed?limit=3
    limit = limit > 50 ? 50 : limit;
    //if someone pass 1 lac and no sanitization it will hang our db and it will freeze the db

    const skip = (page - 1) * limit;

    //Find all the connection request (sent+ reeived)
    // const connectionRequests = await ConnectionRequest.find({
    //   $or:[
    //     {fromUserId:loggedInUser._id},
    //     {toUserId: loggedInUser._id}
    //   ],
    // }).select("fromUserId toUserId").populate("fromUserId","firstName").populate("toUserId","firstName");
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    //contain all unique enteries

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    //these are the prople whom i want to hide form the feed
    // console.log(hideUsersFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    //finding all the users whose id is not present in the hide user array
    //Array.form() --> function to convert the set into an array

    res.json({data: users});

    //suppose we have 1000 of users
    //we don't want my feed api to send 999 users to a new users in feed api
    //api should always return 10 users at a time
    // the feature of pagination should be there
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
