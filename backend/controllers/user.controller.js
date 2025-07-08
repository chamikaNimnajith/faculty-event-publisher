import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

//models
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile Controller", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });

        } else {
            // Follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            // send notification to the user
            const newNotification = new Notification({ from: req.user._id, to: id, type: "follow" });
            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        console.log("Error in followUnfollowUser Controller", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        //const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                    isAdmin:true
                }
            },
            { $sample: { size: 10 } }
        ])

        //const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id.toString()));
        const suggestedUsers = users;

        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedUsers Controller", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let {profileImage, coverImage} = req.body;

    const userId = req.user._id;

    try{
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({error:"Please provide both current password and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({error:"Current password is incorrect"});
            if(newPassword.length < 6) return res.status(400).json({error:"Password must be at least 6 characters"});

            const salt = await bcrypt.genSalt(10);
            user.password =  await bcrypt.hash(newPassword, salt);
        }

        if(profileImage) {
            if (user.profileImage) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
			}
            const uploadedResponse = await cloudinary.uploader.upload(profileImage)
            profileImage = uploadedResponse.secure_url
        }
        
        if(coverImage) {
            if (user.coverImage) {
                // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImage)
            coverImage = uploadedResponse.secure_url
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;

        user = await user.save();

        //password should be null in response
        user.password = null;

        return res.status(200).json(user);

    }catch(error){
        console.log("Error in updateUser Controller", error.message);
        res.status(500).json({ error: error.message });
    }
}

//get all users
// Add pagination and filtering to getAllUsers
export const getAllUsers = async (req, res) => {
    try {

        const userId = req.user._id

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const users = await User.find().select("-password -__v");

        if (!users.length) {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers Controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const setAdmin = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.isAdmin = !user.isAdmin;


        await user.save();

        res.status(200).json({ message: "User promoted to admin successfully", user });
    } catch (error) {
        console.error("Error in setAdmin Controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

};


export const saveUserPreferences = async (req, res) => {
    try {
      const { categories } = req.body;
      const userId = req.user._id;
  
      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: "Invalid categories data" });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { preferences: categories },
        { new: true }
      ).select("-password");
  
      res.status(200).json({
        message: "Preferences saved successfully",
        user
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


