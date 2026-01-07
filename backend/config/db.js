const mongoose = require("mongoose");

const db = () => {
   mongoose.connect("mongodb+srv://glnrkklnc_db_user:12345@cluster0.jus8q2y.mongodb.net/")
   .then(() => {
    console.log("MongoDB connected !!!");
   })
   .catch((err) => {
    console.log("MongoDB connection error:");
    console.error(err);
   });
};

module.exports = db;