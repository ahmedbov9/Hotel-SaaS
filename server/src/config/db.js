const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDB() {
    try{
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected (:');
    }catch(err) {
        console.log(err);
    }
}

module.exports = connectDB ;