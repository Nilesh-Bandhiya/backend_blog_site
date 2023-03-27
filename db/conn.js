const mongoose = require('mongoose');
const mongoUri = process.env.Mongo_Uri

mongoose.connect(mongoUri).then(() => {
    console.log("MongoDb connecion Successfully");
}).catch((error) => {
    console.log("No Connection", error);
})