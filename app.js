var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local");
    
    var User = require("./models/user");
    var Freelancer = require("./models/freelancer");
    var Project = require("./models/project");
    
    
    mongoose.connect("mongodb://localhost/reviso", {useMongoClient: true});
    app.use(bodyParser.urlencoded({extended: true}));

    
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    
    //passportJS Config
    
    app.use(require("express-session")({
    
    secret:"App",
    resave: false,
    saveUninitialized:false
}));
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
   
   
   app.use(function(req,res,next){ //to use the current user in every file!
    
    res.locals.currentUser = req.user;
    next();
});
   
   
    app.get("/", function(req,res){
        
        Freelancer.find({}, function(err, allFreelancers){
            
            if(err)
            {
                console.log(err);
            }
            else{
                
                  res.render("landing", {freelancer: allFreelancers});
            }
            
        });
        
      
    });
    
    //LOGIN ROUTES
    app.get("/login", function(req,res){
        
       res.render("login", {page: "login"}); 
    });
    
    app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req,res){
        
    });
    
    
    //SIGNUP ROUTES
    app.get("/register", function(req,res){
        
       res.render("register", {page: "register"}); 
    });
    
    app.post("/register", function(req,res){
        
        var newUser = User({username: req.body.username});
        User.register(newUser, req.body.password, function(err,user){
            
            if(err)
            {
                console.log("ERROR");
            }
            else{
                
                passport.authenticate("local")(req,res, function() {
                    
                    res.redirect("/");
                });
            }
        });
    });
    
    //LOGOUT ROUTE
    
    app.get("/logout", function(req,res){
        
       req.logout(); 
       res.redirect("/");
    });
    
    //FREELANCER ROUTES
   
        
    app.get("/freelancer/new", isLoggedIn , function(req,res){
        
       res.render("new"); 
    });
    
    app.post("/freelancer", function(req,res){
       
       var image = req.body.image;
       var desc = req.body.description;
       var user = {
           id: req.user._id,
           username: req.user.username
            };
       var newFreelancer = {user: user, image:image, description:desc};
       
       Freelancer.create(newFreelancer, function(err, createdFreelancer){
           
          if(err)
          {
              console.log(err);
              res.redirect("/freelancer/new");
          }
          else
          {
              console.log(createdFreelancer);
              res.redirect("/");
          }
       });
        
    });
    
    
     app.get("/freelancer/:id", function(req,res){
        //find the freelancer id and send it to ejs file
        Freelancer.findById(req.params.id).populate("projects").exec(function(err,freelancer){
            
            if(err)
            {
                console.log(err);
            }
            else{
           res.render("show", {freelancer:freelancer}); 
            }
        });
       
    });
    
    
    
    app.post("/freelancer/:id", function(req,res){
        
        Freelancer.findById(req.params.id, function(err, freelancer){
            if(err){
                console.log(err);
            }
            else{
               
                
                Project.create(req.body.project, function(err,createdProject){
                    if(err){
                        console.log(err);
                    }
                    else{
                        
                        freelancer.projects.push(createdProject);
                        freelancer.save();
                        res.redirect("/freelancer/" + req.params.id);
                    }
                });
            }
        });
        
    });
    
    app.get("/freelancer/:id/new", function(req,res){
       
       Freelancer.findById(req.params.id, function(err,freelancer){
           if(err)
           {
               console.log(err);
           }
           else{
                res.render("newProject", {freelancer:freelancer}); 
           }
           
       });
      
    });
    
    
    function isLoggedIn(req,res,next)
    {
        if(req.isAuthenticated())
        {
            next();
        }
        else
        {
            res.redirect("/");
        }
    }
    
     app.listen(process.env.PORT, process.env.IP);