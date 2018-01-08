var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local");
    
    var User = require("./models/user");
    
    
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
        
        res.render("landing");
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
    app.get("/freelancer/:id", function(req,res){
        //find the project by id and show it in the page
    });
    
        
    app.get("/freelancer/new", function(req,res){
        
       res.render("new"); 
    });
    
    
    
     app.listen(process.env.PORT, process.env.IP);