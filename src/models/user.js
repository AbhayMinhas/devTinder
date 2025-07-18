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

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});
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
