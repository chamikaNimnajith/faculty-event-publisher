    import express from "express";
    import dotenv from "dotenv";
    import cookieParser from "cookie-parser";
    import {v2 as cloudinary} from "cloudinary";
    import path from "path";
    import { fileURLToPath } from "url";
    import authRoutes from "./routes/auth.route.js";
    import userRoutes from "./routes/user.route.js";
    import postRoutes from "./routes/post.route.js";
    import notificationRoutes from "./routes/notification.route.js";
    import chatbotRoutes from "./routes/chatbot.route.js";
    import connectMongoDB from "./db/connectMongoDB.js";
    import subscriptionRoutes from "./routes/subscription.route.js";

    dotenv.config();

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const app = express();
    const PORT = process.env.PORT || 5000;
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    app.use(express.json({limit: "10mb"}));  //to parse json object to javascript object
    app.use(express.urlencoded({extended: true})); // tp parse form data(url encoded)

    app.use(cookieParser())

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use("/api/subscription", subscriptionRoutes);
    app.use("/api/chatbot", chatbotRoutes); 

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../frontend/dist")));
        app.get("*", (req, res) => {
            res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
        });
    }


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        connectMongoDB();
    });