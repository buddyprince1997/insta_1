// const mongoose = require('mongoose')
// const {ObjectId} = mongoose.Schema.Types
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     resetToken:String,
//     expireToken:Date,
//     pic:{
//      type:String,
//      default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
//     },
//     followers:[{type:ObjectId,ref:"User"}],
//     following:[{type:ObjectId,ref:"User"}]
// })

// mongoose.model("User",userSchema)
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String, // Token for password reset
    expireToken: Date,  // Expiry date/time for the reset token
    pic: {
        type: String,
        default: "https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    followers: [{ type: ObjectId, ref: "User" }],    // Array of followers (references to User)
    following: [{ type: ObjectId, ref: "User" }]     // Array of following (references to User)
});

mongoose.model("User", userSchema);
