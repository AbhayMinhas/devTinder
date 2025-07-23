const mongoose = require("mongoose");

//creating user schema
//schema is a function on to of mongoose
//first_name snake case
//firstName camelcasing
//Good nomenclature is to use Camel casing

//some people use new mongoose.Schema
//but not needed now

//example in docs
//const { Schema } = mongoose;
// const blogSchema = new Schema({


//if the data of required: true field is not there then mongoose will not allow the insertion into the database
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique: true,
    trim:true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min:18,
    
  },
  gender: {
    type: String,
    validate(value){

/*by default the validate method will only be called when new user is created new object
but when patching an existing data this validate function will not run by itself 
You will have to enabel it to run on updates also

in Model.findByIdAndUpdate
in options there is runvalidators
*/

      if(!["male","female","others"].includes(value)){
        throw new Error("Gender data is not valid");
        //we can add this validate function in anything 
        //can add a complicated logic also 
        //as soon as data is being put into the DB value will first go to this validate function
        //if the validate function does not throw any error DB updated
        //throw error then db will not be updated
      }


    }
  },
  photoUrl:{
    type:String,
    default: "https://geographyandyou.com/images/user-profile.png",

  },
  about:{
    type:String,
    default:"This is a default about of the user!",
  },
  skills:{
    type:[String],
  },
},{
  timestamps:true ,
});
//timestamps:ture mongodb add a createdAT and UpdatedAt for every user who register and we don't have to add a extra field
//array of skills


//schema is defined and tells about the info about the user that is stored

//now we create a mongoose model

//
// const User = mongoose.model("User", userSchema);
//

//whenever you are referencing to a model the name always starts with a capital letter define it is a mongoose model ,it is a collection 

//this is like a user class and we will create a small new instances of that class whenever a new user will come in it will be a new instance of that model.

//DB->collection inside->hold some data
//schema is the definition of this model

// this model is a class which will create its own instances

//user came in its is of type User and go into the user collection

//mongoose.model(name of the model,name of the schema passed)

//directly export like this no const made

module.exports = mongoose.model("User", userSchema);
