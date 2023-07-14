const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title : {type:String, required:true},
    body : {type:String, required:true},
    date : {type:String, required:true},
    user : {type:String, required:true}
})

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = {BlogModel}