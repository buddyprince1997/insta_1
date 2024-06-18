// const mongoose = require('mongoose')
// const {ObjectId} = mongoose.Schema.Types
// const postSchema = new mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     body:{
//         type:String,
//         required:true
//     },
//     photo:{
//         type:String,
//         required:true
//     },
//     likes:[{type:ObjectId,ref:"User"}],
//     comments:[{
//         text:String,
//         postedBy:{type:ObjectId,ref:"User"}
//     }],
//     postedBy:{
//        type:ObjectId,
//        ref:"User"
//     }
// },{timestamps:true})

// mongoose.model("Post",postSchema)

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: "User" }],  // Array of users who liked the post (references to User)
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" }  // Comment object with text and user who posted it (reference to User)
    }],
    postedBy: {
        type: ObjectId,
        ref: "User"  // Reference to the user who posted the post
    }
}, { timestamps: true });  // Automatically manage createdAt and updatedAt timestamps

mongoose.model("Post", postSchema);
