import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import postRoutes from "./routers/post.router.js";
import userRoutes from "./routers/user.router.js"
import { ensureUser } from "./controllers/user.controller.js";
const port = import.meta.BACKEND_PORT

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Clerk middleware (adds req.auth)
app.use(clerkMiddleware());

app.use("/api/", userRoutes)
app.use("/api/post", postRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
