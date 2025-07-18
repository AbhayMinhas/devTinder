//read the docs of mongoose

const mongoose = require('mongoose');


const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://Abhay:abhay%402003@namastenode.ij3gdlm.mongodb.net/devTinder");//if add the name of the specific database at the end of the url it will connect to that database
    //if not refering to db it is refering to the cluser
    //devtinder will be new database which will be created inside that cluster

    
};
//mongoose.connect returns promise
//tells whether the connection was successfully established or not
//use async await to handle the response accordingly

module.exports = {connectDB};

