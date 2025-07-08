import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import webPush from "web-push"
import Subscription from "../models/subscription.model.js"
import { v2 as cloudinary } from "cloudinary"
import { generateEmbedding } from "../lib/utils/geminiHelper.js"
import Sentiment from "sentiment"
import dotenv from "dotenv"
dotenv.config()


webPush.setVapidDetails(
    'mailto:chamikanimnajith@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}

export const getCordingPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Cording" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}

export const getEntertainPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Entertain" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}
export const getSportsPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Sports" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}
export const getVolunteerPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Volunteer" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}
export const getTshirtsPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Shirts" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}
export const getBanglesPosts = async (req, res) => {
    try {
        const posts = await Post.find({ category: "Bangles" }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })
        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get all posts controller:", error)
        res.status(500).json({ error: "Internel server error" })
    }
}




// controllers/postController.js
export const createPost = async (req, res) => {
    try {
        const { text, title, description, category } = req.body;
        
        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        // Generate embedding for the title
        const titleEmbedding = await generateEmbedding(title);
        
        const users = await User.find({ preferences: { $in: [category] } });
        let subscriptions;

        if (users.length > 0) {
            const userIds = users.map(user => user._id);
            subscriptions = await Subscription.find({ userId: { $in: userIds } });
            console.log("Subscriptions found: ", subscriptions);
        } else {
            console.log("No users found with the given category preference.");
        }
        
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
    
        // Create post with embedding
        const newPost = new Post({ 
            user: userId, 
            title,
            description,
            text, 
            img, 
            category,
            title_embedding: titleEmbedding  // Add the embedding
        });
        
        await newPost.save();

        // Send notifications
        if (subscriptions && subscriptions.length > 0) {
            const payload = JSON.stringify({
                title: title,
                message: text || description,
                imageUrl: img, 
            });
          
            subscriptions.forEach(subscription => {
                webPush.sendNotification(subscription, payload).catch(error => {
                    console.error('Error sending notification:', error);
                });
            });
        }
  
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in create post controller:", error);
    }
};
  


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ error: "Post not found" })

        if (post.user.toString() !== req.user._id.toString()) return res.status(401).json({ error: "Unauthorized" })

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: "Internel server error" })
        console.log("Error in delete post controller:", error)
    }
}



export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ error: "Text is required" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Initialize sentiment analyzer
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);

        // Determine emoji based on sentiment score
        let emoji = '';
        if (result.score > 0.1) {
            emoji = '👍'; // Positive
        } else if (result.score < -0.1) {
            emoji = '👎🏼'; // Negative
        }else{
            emoji = '😐'; // Neutral

        }
        

        const comment = {
            text: text, 
            user: userId,
            emoji: emoji
        };

        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in comment on post controller:", error);
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id
        const { id: postId } = req.params

        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ error: "Post not found" })

        const isLiked = post.likes.includes(userId)

        if (isLiked) {
            //unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())

            res.status(200).json(updatedLikes)
        } else {
            //like the post
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save()

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save()
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes)
        }
    } catch (error) {
        res.status(500).json({ error: "Internel server error" })
        console.log("Error in like/unlike post controller:", error)
    }
}


//The reason we don't put await in front of post.likes.push(userId)
// is that .push() is a synchronous JavaScript array method. It simply
//  adds an element to the likes array in memory and does not return a
// Promise, so await is not needed.


export const getLikedPosts = async (req, res) => {
    const userId = req.user._id

    try{
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({ error: "User not found" })

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(likedPosts)

    }catch(error){
        res.status(500).json({ error: "Internel server error" })
        console.log("Error in get liked posts controller:", error)
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({ error: "User not found" })

        const following = user.following

        const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(feedPosts)
    } catch (error) {
        res.status(500).json({ error: "Internel server error" })
        console.log("Error in get following posts controller:", error)
    }
}   

export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params

        const user = await User.findOne({username})
        if(!user) return res.status(404).json({ error: "User not found" })

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: "Internel server error" })
        console.log("Error in get user posts controller:", error)
    }
}