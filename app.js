//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.set("view engine","ejs");
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://admin-siddhartha:test123@cluster1.safks.mongodb.net/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema= new mongoose.Schema ({
  email: String,
  password: String,
  watchlist: [{type:String}],
  titlewatchlist: [{type:String}]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User= new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/",(req,res)=>{
    if (req.isAuthenticated()){
  User.findById(req.user.id, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
         res.render("home",{watchItems:foundUser.watchlist,watchTitle:foundUser.titlewatchlist});
      }
    }
});

}
else{
  res.render("home", {watchItems: false})
}
});

app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/signup",(req,res)=>{
  res.render("signup")
});

// app.get("/watchlist", function(req, res){
//   User.find({"secret": {$ne: null}}, function(err, foundUsers){
//     if (err){
//       console.log(err);
//     } else {
//       if (foundUsers) {
//         res.render("home", {usersWithSecrets: foundUsers});
//       }
//     }
//   });
// });

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


app.post("/signup", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/");
      });
    }
  });

});
app.post("/login",function(req,res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/");
      });
    }
  });

});




app.post("/watchlist",function(req,res){
  if (req.isAuthenticated()){
    console.log(req.user.id);
    const watchmovie=req.body.button;
    const watchtitle=req.body.listName;
  console.log(watchmovie);
console.log(watchtitle);

    User.findById(req.user.id, function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        if(foundUser){
          foundUser.watchlist.addToSet(watchmovie);
          foundUser.titlewatchlist.addToSet(watchtitle);
          foundUser.save(function(){
            console.log(foundUser.watchlist)
            res.redirect("/");
          });
        }
      }
    });


  } else {
    res.redirect("/login");
  }
});




app.use(express.static("public"));

let port= process.env.PORT;
if(port==null || port ==""){
  port=3000;
}


app.listen(port, function(){
  console.log("Server started.");
});
