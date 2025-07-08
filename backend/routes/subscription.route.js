import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { saveSubscription } from "../controllers/subscription.controller.js";

const router = express.Router();

router.post("/savesubscription",protectRoute,saveSubscription)

export default router;