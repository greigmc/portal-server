// uploadRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mime from "mime-types";

import verifyToken from "../middleware/authMiddleware.js";
import { User } from "../models/userModel.js";
import {
  extractTextFromFile,
  extractFieldsFromText,
} from "../utils/fileParser.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    // Use file.originalname (all lowercase)
    const sanitized = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");
    const userId = req.params.userId || "anonymous";
    cb(null, `${userId}_${sanitized}`);
  },
});

const upload = multer({
  storage,
});

/**
 * Upload Profile Picture
 * POST /api/upload/profile/:userId
 */
router.post(
  "/profile/:userId",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const newPath = `/uploads/${req.file.filename}`;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPath = path.join("public", user.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      user.profilePicture = newPath;
      await user.save();

      res.status(200).json({
        profilePicture: newPath,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({
        message: "Failed to update profile picture",
      });
    }
  },
);

/**
 * Upload CV/Document + extract fields
 * POST /api/upload/cv/:userId
 */
router.post(
  "/cv/:userId",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const newPath = `/uploads/${req.file.filename}`;
    const filePath = path.join("public", newPath);

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Delete old CV/file if exists
      if (user.fileUploader) {
        const oldPath = path.join("public", user.fileUploader);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      user.fileUploader = newPath;
      user.fileUploaderOriginalName = req.file.originalname; // Add this line
      await user.save();

      res.status(200).json({
        fileUploader: newPath,
        originalFileName: req.file.originalname, // fix typo
        fields: {},
      });
    } catch (error) {
      console.error("Error updating uploaded file:", error);
      res.status(500).json({
        message: "Failed to update uploaded file",
      });
    }
  },
);

export default router;
