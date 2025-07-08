import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser, getAllUsers, setAdmin, saveUserPreferences } from "../controllers/user.controller.js";

const router = express.Router();

 router.get("/profile/:username",protectRoute ,getUserProfile)
 router.get("/suggested",protectRoute ,getSuggestedUsers)
 router.post("/follow/:id",protectRoute ,followUnfollowUser)
 router.post("/update",protectRoute ,updateUser)
 router.get("/allusers",protectRoute ,getAllUsers)
 router.post("/setadmin",protectRoute ,setAdmin)
 router.post("/userpreference", protectRoute, saveUserPreferences);

export default router;