const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema({
  //every chat should know the participants and they should have a seperate chat for every unique set of participants
  // it should be the type of the user
  //there will be an array of participants
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  ],
  //messages will also be an array of individual message
  //how do you define a single message
  //we can include a schema in another scema
  //messages are of type message schema
  //we can put it in the array also but putting it in the message scehema makes it more readable and cleaner
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
//created chat model with chatSchema

module.exports = { Chat };
