var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    
   projectName: String,
   timeSpent: [{
       
       task: String,
       time: String
   }]
    
});

module.exports = mongoose.model("Project", projectSchema);