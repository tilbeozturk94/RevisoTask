var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    
   projectName: String,
   image: String,
   description: String,
   timeSpent: Number
    
});

module.exports = mongoose.model("Project", projectSchema);