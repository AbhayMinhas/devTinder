const express = require('express');
//referencing to the express folder in node_modules

const app = express();
//uncomment once from here

// //creating a new instance express js application
// //creating a new web server


// //How to handle a incoming request
// //this function inside use takes a req array queue and a response

// // app.use((req,res)=>{
// //     res.send('Hello form the server!');
// //     //send the response back 
// //     //whatever req comes in respond with hello form the server
// // })

// //this function is known as req handler
// //server is now responding to the incoming request

// //write a route 

// // app.use("/",(req,res)=>{
// //     res.send("Namaste!");
// // });
// //if any route matches this route & starts with it 
// // is like a wild card anything that matches after this /
// //this route handler will handle it that's why everything is handeled by this route handler

// //order of writing the routes matter

// //this will match all the HTTP method API calls to /test
// app.use("/test",(req,res)=>{
//     res.send("Again Hello from the server!");
// });

// app.use("/hello/2",(req,res)=>{
//     res.send("Second Hello!");
// });

// //if /hello is prior then /hello/2 will not work
// app.use("/hello",(req,res)=>{
//     res.send("Hello hello hello!");
// });
// //if you go to /hello/xyz/... still goto /hello result. as it starts with /hello
// //but /hello123 will not match as it is whole different string

// // go for /xyz and is not created it will give the error that Cannot get /xyz


// // app.use("/",(req,res)=>{
// //     res.send("Namaste!");
// // });
// //if we change the order other routes will start working 
// //when req is coming to port the code will start running form top that is why the order is very important

// // app.use('/user',(req,res)=>{
// //     res.send("ha ha ha");
// // });
// //if use this it will take all get,post,delete req to itself not let it pass
// // order matters

// app.get("/user",(req,res)=>{
//     res.send({firstName: "Abhay",lastName:"Minhas"});
// });
// //this method will only match GET api calls to the route -->/user 

// app.post("/user",(req,res)=>{
//     //saving data to DB
    
//     res.send("Data successfully saved to the database");
// });

// app.delete('/user',(req,res)=>{
//     res.send("deleted successfully!");
// });

//till here

// : -->means it's a dynamic route
app.get("/user/:userId/:name/:passowrd",(req,res)=>{
    //in req query will give info of query parameters
    //match corresponding routes
    //  /user/707
    //req.params to get 707 user id 
    console.log(req.params)
    res.send({firstName: "Abhay",lastName:"Minhas"});
});
app.get("/user",(req,res)=>{
    //in req query will give info of query parameters
    console.log(req.query)
    res.send({firstName: "Abhay",lastName:"Minhas"});
});
//how to get query params in my route handller/controller
//dynamic user id is given

// app.get("/a{bc}d",(req,res)=>{
//     res.send({firstName: "Abhay",lastName:"Minhas"});
// });
//form version 5
//The optional character ? is no longer supported, use braces instead.{}
//b is now optional /abcd /ad work

app.get(/.*fly$/,(req,res)=>{
    res.send({firstName: "Abhay",lastName:"Minhas"});
});//anything ending with word fly work
app.get(/a/,(req,res)=>{
    res.send({firstName: "Abhay",lastName:"Minhas"});
});//if a is there in the path it will work 



// ab+c is now deprecated use Regex instead 
// app.get(/^\/ab+c$/,(req,res)=>{
//     //n number of b in between
//     res.send({firstName: "Abhay",lastName:"Minhas"});
// })

app.get(/^\/a(bc)+d$/,(req,res)=>{
    res.send({firstName:"abhay",lastname:"minhas"});
});

//ab*cd not work use regexp
// app.get(/^\/ab.*cd$/,(req,res)=>{
//     //n number of b in between
//     res.send({firstName: "Abhay",lastName:"Minhas"});
// });
// . --> any character except line breaks
// * --> no or many of prev char
// + --> one or many
// ? --> one or none or use {} in string
// \w --> one word
// \w+ --> many words
// \d --> for letter and d+ --> letters
// refer js regex for more or ai






app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777...");
});
//created a server on port 3000 and the app is listening on it 

//call back function will only be called once the server is up and running 


//whenever you are typing a url you are making an GET api call to this route on our server
//http://localhost:7777/xyz making a get api call to this url

//cannot do post api call form browser need to make explicit code for that
//we can make api call from console 
//fetch() post calls etc

//To test some post calls how will we test
//we cannot always keep writing the fetch code over browser console

//To test your Api's, route,test backend code browser is not good way 

// ----We will Use Postman for that
//Build and share Api's repo to collect api's //api testing tool
