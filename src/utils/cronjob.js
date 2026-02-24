const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail=require("./sendEmail");

const { subDays, startOfDay, endOfDay } = require("date-fns");
// cron.schedule("* * * * * *",()=>{
//     console.log("Hello World, "+new Date());
// });
//run this code as soon as our application starts and we need to require the file.
//This job will run at 8 AM in the morning everyday
cron.schedule("0 8 * * *", async () => {
  //send emails to all people who got requests the previous day

  try {
    const yesterday = subDays(new Date(), 1); //give me yesterday's date
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayend = endOfDay(yesterday);
//pending requests of yesterday
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayend,
      },
    }).populate("fromUserId toUserId");
    //list of emails whome i want to send the reminders to.
    //and we don't want repeated email id's 
    //suppose elon musk have 5 connection request but we want it only once so we want a set data structure
     
    const listOfEmails = [...new Set(pendingRequests.map(req=>req.toUserId.emailId))];
    console.log(listOfEmails);
    for(const email of listOfEmails){
        //send Emails
        try{

            const res = await sendEmail.run("New Friend Request Pending for "+email, "There are so manyy friend requests pending,Please login to DevTinder.in and accept or reject the requests.");
            console.log(res);
        }
        catch(err){
            console.log("email send error "+err);
        }
    }
  } catch (err) {
    console.error(err);
  }
});
