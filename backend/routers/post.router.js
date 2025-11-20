import { Router } from "express";

import { createPost, deletepost, getpost, getposts, updatepost } from "../controllers/post.controller.js";
import { requireAuth } from "@clerk/express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
// import { ClerkExpressWithAuth } from "@clerk/express";




const router = Router()

router.post("/create"  , createPost)
router.get("/"  , getposts)
router.get("/:id",getpost)
router.delete("/:id", deletepost)
router.put("/:id", updatepost)

export default router