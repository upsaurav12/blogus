import express from "express";
import { ensureUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/ensure-user", ensureUser);

export default router;
