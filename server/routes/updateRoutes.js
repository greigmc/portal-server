// upDateRoutes.js
import express from "express";
import { updateProfileLinks } from "../controllers/upDateController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Profile links update route
router.put("/users/:id/links", authenticateToken, updateProfileLinks);

export default router;
