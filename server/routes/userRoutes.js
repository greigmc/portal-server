// userRoutes.js
import express from "express";
import { updateUserProfile } from "../controllers/userController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/users/:id", verifyToken, updateUserProfile);

export default router;
