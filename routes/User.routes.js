const express = require("express");
const { UserModel } = require("../model/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");

const userRouter = express.Router();


// Multer storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadedfiles/');
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
      cb(null, `${Date.now()}-${file.originalname}`);
      
    },
  });

// Multer upload 
const upload = multer({ storage: storage });

userRouter.get("/", async (req, res)=>{
    try {
        const users = await UserModel.find();
        res.send({"user":users})
    } catch (err) {
        res.send({"msg":"Something went wrong"})
    }
})


userRouter.post("/register", upload.single('profileImage'), async (req, res)=>{
    try {
        const {name, email, password, profile} = req.body;
        console.log(req.body);
        let profileImage = req.file.filename;
        let filepath = req.file.path;
        console.log(filepath);
        bcrypt.hash(password, 5, async(err, hash) =>{
            if(err) res.send({"error" : err.message});
            else{
                const user = new UserModel({name, email, password : hash, profile:profileImage});
                await user.save();
                res.send({"msg" : "New User has been registered", "user":user, "filepath":filepath});
            }
        });
    } catch (error) {
        res.send({"msg":"something went wrong", "error":error.message})
    }
    
})

userRouter.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result)=> {
                // result == true
                if(result){
                    const token = jwt.sign({userID : user[0]._id}, "recroot")
                    res.send({"msg":"User logged in", "token":token, "userId":user[0]._id});
                }
                else if(err){
                    res.send({"msg":"Something went wrong", "err":err.message});
                }
            });
            
        }
        else{
            res.send({"msg":"Something went wrong"})
        }
        
    } catch (err) {
        res.send({"error" : err.message});
    }
    
})

module.exports = {userRouter}