const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author:[ {
        type:mongoose.Schema.Types.ObjectId, ref: 'Users'}
   
    ]})
  
module.exports=mongoose.model("Review",reviewSchema)
