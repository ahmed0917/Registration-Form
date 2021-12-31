const mongoose = require("mongoose")

const db = process.env.MONGO_DB
mongoose.connect(db, 
    { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Connection is successful");
}).catch((e) => {
    console.log("Not connected");
});