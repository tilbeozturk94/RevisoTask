var mongoose = require("mongoose");


var freelancerSchema = new mongoose.Schema({
   
     user: {
                
     id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
            username: String
        },
   image: String,
   description: String,
   projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
   }
]
       
 });
 
 module.exports = mongoose.model("Freelancer", freelancerSchema);