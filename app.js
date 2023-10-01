require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");
const alert = require('alert');
// const encrypt = require("mongoose-encryption"); //-----> level 2 security
// const md5 = require("md5"); // ------> level 3 security
const bcrypt = require("bcrypt"); // ------->level 4 security
const saltRounds = 10;



const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

/////////// ----------> making user schema

const dataName = "userDB"
mongoose.connect('mongodb://127.0.0.1:27017/' + dataName);

////////// ---------> adding encryptions by using mongoose.Schema

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});


// -----------------------> for level 2
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET,
//     encryptedFields: ["password"],
// });


////////// ------------> making model

const User = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
    res.render("home");
});



app.get("/login", (req, res) => {
    res.render("login");
});



app.get("/register", (req, res) => {
    res.render("register");
});



app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash,
        });
        newUser.save().then((feedback) => {
            if (feedback) {
                console.log("Success!");
                res.render("secrets");
            } else {
                console.log("Failed");
            }
        });
    });
});



app.post("/login", (req, res) => {
    const {username, password} = req.body;

    User.findOne({email: username}).then((foundUser) => {
        bcrypt.compare(password, foundUser.password, (err, result) =>{
            if (result) {
                console.log("Success!");
                res.render("secrets");
            } else {
                console.log("Wrong password!");
                alert("Sorry wrong password!");
                res.render("login");
            }
        });  
    }).catch((error) => {
        console.log("Failed! No user named: " + username);
        alert("Wrong username or password input.");
    });
});




app.listen(3000, () =>{
    console.log("Server listen at port 3000.");
});