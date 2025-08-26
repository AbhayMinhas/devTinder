const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",//reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);
//****1 means ascending order and -1 means descending order there can be more things over here explore
//mongodb/mongoose compound index

//ConnectionRequest.find({fromUserId: 278779464687953549835886})
//making the query like this all these queries will be very very fast
//but if making a query like this 
//ConnectionRequest.find({fromUserId: 278779464687953549835886,toUserId: 845498659841684651})
//now just keeping the index on fromUserId will not work it will not make the query fast

// connectionRequestSchema.index({fromUserId: 1 });

//you have to create a compound index like this 
connectionRequestSchema.index({fromUserId: 1 ,toUserId:1});
//all the job of optimizing things will be taken care of by mongodb
//you just have to set the index right

//*****you should know when to keep an index on a single field and when to keep an index on multiple fields
//when you say compound index it means whenever you query with both these parameters combined it will make queries very fast.


//model always starts with a capital letter
//validator function
//the function should be a normal function not an arrow function otherwise this will not work 
//this kind of like a middleware which will be called every time the conneciton request will be saved whenver you will call a save method 
//it will be called pre save
//pre means i am calling this method pre save
//this save is like a event handler
//before you save this function will be called


//we can do alot of things here 
//we can do validations over here,checks,ultimately any code like logging and monitoring over here
connectionRequestSchema.pre("save",function(next){
  const connectionRequest = this;
  //Check if the fromuserId is same as toUserId
  //the type of id is Object you cannot directly compare it it is in objectId you have to parse it
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
  //always call next over here
  //keeping the validation of from userId is not equals to toUserId is kindof the job of schema thats why this function can be written over here
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;