// routes/adminRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", verifyToken, getAllUsers); // Optional: use auth middleware

export default router;
