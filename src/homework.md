Create a repository
Initailize the repository
Find the diffrence node_modules,package.json,package-lock.json
Install express
Create a server
Listen to port 7777
Write request handlers for /test, /hello
install nodemon and update scripts inside package.json
what is dependencies
what is the use of "-g" while npm install
Difference between caret and tilde (^ vs ~)

initialize git
.gitignore
create a remote repo on github / bitbucket / gitlab
push all code to remote origin
-play with routes and route extensions ex. /hello, / , /hello/2
-Order of the routes matter alot

-Install Postman app make a workspace / collectin > test API call

-Write logic to handle GET,POST, PATCH, DELETE API calls and test them on Postman

-Explore routing use of ?,+,(),* and regex in routes /a/ , /.*fly$/
-Reading the query params in the routes
-reading the dynamic routes

-Multiple route Handlers - Play with the code
-next()
-next function and errors along with res.send()
-app.use("/route",rH,[],dfj.....) -**what is a Middleware? why do we need it? -**How express JS basically handles requests behind the scenes
-\*\*Difference app.use and app.all
-Write a dummy auth middleware for admin
-Write a dummy auth middleware for al user routes, except /user/login
-Error Handling using app.use("/",(err,req,res,next) = {}); keep it at end of the application anything breaks it will handle (best preactice to use try catch)

-Create a free cluster on MongoDb official website (Mongo Atlas)
-Install mongoose library 
-Connet your application to the Database "Connnection-url"/devTinder
-Call the connectDB function and connect ot database before starting application on 7777

-Create a userSchema & user Model
-Create POST /signup API to add data to database
-Push some doucuments using API calls from postman
-Error Handling using try, catch
