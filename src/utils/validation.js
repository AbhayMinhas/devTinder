const validator = require("validator");

const validateSignUpData = (req) => {
  //take out all the fields from the req body -->api expecting the user to pass firstName lastName emailId password
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  }
  //   else if(firstName.length<4 || firstName.length>50){
  //     //also these checks at database level
  //     //keep it in schema or check here
  //     throw new Error("FirstName should be 4-50 characters");
  //     //can add these logic for last name also
  //     //don't write this we will get the error form the model level
  //   }
  else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

  return isEditAllowed;
};



module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
