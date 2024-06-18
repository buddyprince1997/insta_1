const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

// Get user and their posts
router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name");
        res.json({ user, posts });
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// Follow a user
// router.put('/follow', requireLogin, async (req, res) => {
//     try {
//         const result = await User.findByIdAndUpdate(req.body.followId, {
//             $push: { followers: req.user._id }
//         }, { new: true });

//         if (!result) {
//             return res.status(422).json({ error: "Error following user" });
//         }

//         const updatedUser = await User.findByIdAndUpdate(req.user._id, {
//             $push: { following: req.body.followId }
//         }, { new: true }).select("-password");

//         res.json(updatedUser);
//     } catch (err) {
//         res.status(422).json({ error: err.message });
//     }
// });
router.put('/follow', requireLogin, async (req, res) => {
    try {
        const followId = req.body.followId;
        const userId = req.user._id;

        if (!followId) {
            return res.status(400).json({ error: "Follow ID is required" });
        }

        console.log(`User ${userId} is trying to follow User ${followId}`);

        const result = await User.findByIdAndUpdate(followId, {
            $push: { followers: userId }
        }, { new: true });

        if (!result) {
            return res.status(422).json({ error: "Error following user" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push: { following: followId }
        }, { new: true }).select("-password");

        res.json(updatedUser);
    } catch (err) {
        console.error("Error following user:", err);
        res.status(422).json({ error: err.message });
    }
});

// Unfollow a user
// router.put('/unfollow', requireLogin, async (req, res) => {
//     try {
//         const result = await User.findByIdAndUpdate(req.body.unfollowId, {
//             $pull: { followers: req.user._id }
//         }, { new: true });

//         if (!result) {
//             return res.status(422).json({ error: "Error unfollowing user" });
//         }

//         const updatedUser = await User.findByIdAndUpdate(req.user._id, {
//             $pull: { following: req.body.unfollowId }
//         }, { new: true }).select("-password");

//         res.json(updatedUser);
//     } catch (err) {
//         res.status(422).json({ error: err.message });
//     }
// });
router.put('/unfollow', requireLogin, async (req, res) => {
    try {
        const unfollowId = req.body.unfollowId;
        const userId = req.user._id;

        if (!unfollowId) {
            return res.status(400).json({ error: "Unfollow ID is required" });
        }

        console.log(`User ${userId} is trying to unfollow User ${unfollowId}`);

        const result = await User.findByIdAndUpdate(unfollowId, {
            $pull: { followers: userId }
        }, { new: true });

        if (!result) {
            return res.status(422).json({ error: "Error unfollowing user" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: { following: unfollowId }
        }, { new: true }).select("-password");

        res.json(updatedUser);
    } catch (err) {
        console.error("Error unfollowing user:", err);
        res.status(422).json({ error: err.message });
    }
});

// Update profile picture
router.put('/updatepic', requireLogin, async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true });

        if (!result) {
            return res.status(422).json({ error: "Pic cannot be posted" });
        }

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// Search users by email
router.post('/search-users', async (req, res) => {
    try {
        const userPattern = new RegExp("^" + req.body.query);
        const users = await User.find({ email: { $regex: userPattern } }).select("_id email");

        res.json({ users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
