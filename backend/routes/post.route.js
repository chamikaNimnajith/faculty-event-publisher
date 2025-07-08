import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost,getCordingPosts, getEntertainPosts, getSportsPosts, getVolunteerPosts, getTshirtsPosts, getBanglesPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)  //post of users you follow
router.get("/likes/:id",protectRoute,getLikedPosts)
router.get("/user/:username",protectRoute,getUserPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,commentOnPost)
router.get("/cording",protectRoute,getCordingPosts) 
router.get("/entertain",protectRoute,getEntertainPosts)
router.get("/sports",protectRoute,getSportsPosts)
router.get("/volunteer",protectRoute,getVolunteerPosts)
router.get("/tshirts",protectRoute,getTshirtsPosts)
router.get("/bangles",protectRoute,getBanglesPosts) 
router.delete("/:id",protectRoute,deletePost)

export default router;