import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { 
    startChatSession, 
    chatWithContext, 
    endChatSession 
} from '../controllers/chatbot.controller.js';


const router = express.Router();

// Chat session management
router.post('/chat/start', protectRoute, startChatSession);
router.post('/chat', protectRoute, chatWithContext);
router.post('/chat/end',protectRoute, endChatSession);

export default router;