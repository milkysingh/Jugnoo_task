const mongoose = require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/Users", {
    useMongoClient: true
},(err,db)=>{
    if(err) {
        console.log("Unable to connect to database");
        return;
    }
    console.log("Database is connnected");
});
module.exports = {mongoose};