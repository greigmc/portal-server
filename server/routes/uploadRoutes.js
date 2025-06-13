// routes/uploadRoutes.js
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { uploadCvDocument } from "../controllers/uploadCvDocumentController.js";
import { uploadProfilePicture } from "../controllers/uploadProfilePictureController.js";

const router = express.Router();

router.post("/profile/:userId", verifyToken, ...uploadProfilePicture);
router.post("/cv/:userId", verifyToken, ...uploadCvDocument);

export default router;
