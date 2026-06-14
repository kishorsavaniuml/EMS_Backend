const mongoose = require ("mongoose");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

console.log(DATABASE_URL);



const dbConnect  = () => {mongoose.connect(DATABASE_URL ,{dbName:"EMS"} ).then(()=>{
    console.log("databse successfully connected")
}).catch((err)=>{
    console.log("database connection failed");
    console.log(err);
    process.exit(1);
})}

module.exports = dbConnect;

