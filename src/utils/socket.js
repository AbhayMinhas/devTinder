const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  //give it what type of hash you want to create
  // and in string you need to give the string
  //digest it using hex it's a secure way of doing it
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //Handle events
    //whenever you receive a connection so these are the events handlers
    //handling these events form here
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      //sort so that the room id's of two people are same

      console.log(firstName + " joining Room : " + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        //Save message to the database
        try {
          //HW
          //check if user id and target user id are friends

          // const isfriend = ConnectionRequest.findOne({
          //   $or: [
          //     {
          //       fromUserId: userId,
          //       toUserId: targetUserId,
          //       status: "accepted",
          //     },
          //     {
          //       fromUserId: targetUserId,
          //       toUserId: userId,
          //       status: "accepted",
          //     },
          //   ],
          // }); //to be continued

          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);
          // the message can be the first message also or to append message in an existing chat
          //if chat exists update , if not update a new one
          //$all all the people in this array should be participants over here
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          //we can extend our code to third user also but the query will be similar to this only

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userId,
            timestamp: new Date(),
          });
        } catch (err) {
          console.log("unable to save the messages in DB " + err);
        }
      },
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
