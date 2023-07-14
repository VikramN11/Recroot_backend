const express = require("express");
const { BlogModel } = require("../model/Blog.model");
const jwt = require("jsonwebtoken");

const blogRouter = express.Router();

blogRouter.get("/", async (req, res)=>{
    const token = req.headers.authorization;
    console.log(token);
    if(token){
        jwt.verify(token, 'recroot', async(err, decoded)=>{
            if(decoded){
                let userId = decoded.userID;
                let blogs = await BlogModel.find();
                let userBlogs = await BlogModel.find({user: userId});
                res.send({"blogs":blogs, "userBlogs":userBlogs});
            }
            else{
                res.send({"msg":err.message});
            }
          });
    }
    else{
        res.send({"msg":"Something really wrong"});
    }
    
})

blogRouter.post("/create", async (req, res)=>{
    const payload = req.body;
    try {
        let curr = new Date();
        const blog = new BlogModel({...payload, date : curr.toLocaleString()});
        await blog.save();
        res.send({"msg" : "New blog has been created", "data" : blog});
    } catch (err) {
        res.send({"msg":err.message})
    }
})

blogRouter.patch("/update/:id", async(req, res)=>{
    const payload = req.body;
    const id = req.params.id;
    const blog = await BlogModel.findOne({"_id":id});
    const userID_of_blog = blog.user;
    const userID_request = req.body.user;
    try {
        if(userID_request !== userID_of_blog){
            res.send({"msg":"You are not Authorized"});
        }
        else{
            await BlogModel.findByIdAndUpdate({"_id":id, payload});
            res.send("Updated the Blog");
        }
    } 
    catch(err){
        console.log(err.message);
        res.send({"msg":"Something went wrong"});
    }
})

blogRouter.delete("/delete/:id", async (req, res)=>{
    const payload = req.body;
    const id = req.params.id;
    const blog = await BlogModel.findOne({"_id":id});
    const userID_of_blog = blog.user;
    const userID_request = req.body.user;
    try {
        if(userID_request !== userID_of_blog){
            res.send({"msg":"You are not Authorized"});
        }
        else{
            await BlogModel.findByIdAndDelete({"_id":id});
            res.send("Deleted the Blog");
        }
    } 
    catch(err){
        console.log(err.message);
        res.send({"msg":"Something went wrong"});
    }
})

module.exports = { blogRouter };