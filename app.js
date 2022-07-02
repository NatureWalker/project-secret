// jshint esversion:6
// Add and run "dotenv" module
require('dotenv').config();

// Configuration requires the installation of:
// "mongodb", "mongoose", "express", "ejs", and "body-parser"
// lodash insallation is optional and the require is commented out

// In THIS document:
// "lodash" module is not installed.
// "mongoose-encryption" module is installed.
// "dotenv" module is installed.

// Personalize Configuration
const db = "userDB";
const port = "3000";

// Configure and run "MongoDB" and "Mongoose" modules
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Configure and run "Express.js" model 
const express = require("express");
const app = express();
const ejs = require("ejs");

// Configure Parsers and Files
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Configure Extras
// const _ = require("lodash");
const remotePort = process.env.PORT;
// Add "mongoose-encryption" module
const encrypt = require('mongoose-encryption');

// Connection Function for MongoDB then Node.js
async function connectSystems() {
    try {
        await mongoose.connect(uri + "/" + db);
        console.log("Connected to MongoDB using Mongoose");
    } catch (e) {
        console.log(e);
    } finally {
        if (remotePort == null || remotePort === "") {
            await app.listen(port, () => {
                console.log("Server started on local port " + port);
            });
        } else {
            await app.listen(remotePort, () => {
                console.log("Server started on remote port " + remotePort);
            });   
        }
    }
}

// Connect to MongoDB and Node.js
connectSystems().catch(err => console.log("There has been an error" + err));

// Configure Schemas
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User",userSchema);

//////// Testing Zone /////////

//////// Testing Zone /////////

// Page Builds

app.get("/",(req,res)=> {
res.render("home")
});

app.route("/login")
.get((req,res)=> {
    res.render("login")
})
.post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: username
    }, (e,foundUser) => {
        if(e){
            console.log(e);
        } else {
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("Password is wrong");
                    res.render("login");
                }
            } else {
                console.log("Username is wrong");
                res.render("login"); 
            }
        }
    })
})

app.route("/register")
.get((req,res)=> {
    res.render("register")
})
.post((req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((e) => {
        if (e) {
            console.log(e);
        } else {
            res.render("secrets");
        }
    })
})