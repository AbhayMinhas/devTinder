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

-JS object vs JSON (difference )-why and when to use
-Add the express.json middleware to your app
-Make your signup API dynamic to recive data form the end user(browser/postman/anyone outeside your server hitting that api can create a user)
-User.findOne with duplicate email ids . which object will be returned
-API - get user by email
-API - Feed API - GET /feed - get all the users form the database
-\*\*API - GET user by ID use mongoose function findById
-Create a delete user API
-Difference between patch and put
-API - Update a user
-Explore the Mongoose Documentation for MOdel methods
-What are options in a Model.findOneAndUpdate method/API, explore more about it
-API - Update the user with the help of email ID instead of userId

-\*Put all the validation default value min length max length etc. user can add random stuff
-Explore schemaType options form the documentation
-add required,unique,lowercase,min,minLength,trim
-Add default
-Create a custom validat functon for gender
-Imporve the DB schema - PUT all appropriate validatioins on each field in schema
-Add timestamps to the userSchema

-Add API level validation on patch request & signup post api
-DATA Sanitization - Add API validation for each field
-Install validator
-Explore validator library functions and Use validator funcs for password,email,URL

- NEVER TRUST req.body

- Validate data in Signup API(create a helper/utility function make habit of it)
- Install bcrypt package
- Create PasswordHash using bcrypt.hash & save the user with encypted password
- Create login API
- Compare passwords and throw error if email or password is invalid

- install cookie-parser
- just send a dummy cookie to user
- create GET /profile API and check if you get the cookie back
- install jsonwebtoken
- // IN login API,after email and password validation, create a JWT token and send it to user in cookies
- read the cookies inside your profile API and find the logged in user

-userAuth Middleware
-Add the userAuth middleware in profile API and a new sendConnectionRequest API
-Set the expiry of JWT token and cookies to 7 days
-Create userSchema method to getJWT()
-Create UserSchema method to comparepassword(passwordInputByUser)
\*\*don't worry about the length of the variable name it should be clear to understand should not be random--the code that you write is for humans to understand(we can also do binary but we can't as it is not human readable)

-Explore tinder APIs
-EXplore the structure of their data and their fields
--example tinder makes 1 api call brings 20-30 profile for feed once finished then it moves on to another set of profiles
-Create a list of all API you can think of in DEV Tinder
-Group multiple routes under respective routers
-Read documentation for express.Router
-Create routes folder for managing auth,profile , request routers
-Create authRouter,profileRouter,requestRouter
-Import these routers in app.js
-Create POST /logout API
-Create PATCH /profile/edit
-Create PATCH /profile/password API => forgot password API
-Make sure you validate all the data in every POST, PATCH APIs.
