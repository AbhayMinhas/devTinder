const express = require('express');
//referencing to the express folder in node_modules

const app = express();
//creating a new instance express js application
//creating a new web server


//How to handle a incoming request
//this function inside use takes a req array queue and a response

// app.use((req,res)=>{
//     res.send('Hello form the server!');
//     //send the response back 
//     //whatever req comes in respond with hello form the server
// })

//this function is known as req handler
//server is now responding to the incoming request

//write a route 

app.use("/",(req,res)=>{
    res.send("Namaste!");
})
app.use("/test",(req,res)=>{
    res.send("Again Hello from the server!");
});
app.use("/hello",(req,res)=>{
    res.send("Hello hello hello!");
});



app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777...");
});
//created a server on port 3000 and the app is listening on it 

//call back function will only be called once the server is up and running 


