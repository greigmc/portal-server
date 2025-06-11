// uploadRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Client } from "basic-ftp";
import verifyToken from "../middleware/authMiddleware.js";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Multer stores the file temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload to FTP
async function uploadToFtp(buffer, remoteFileName) {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });

    await client.ensureDir(process.env.FTP_UPLOAD_DIR);
    await client.uploadFrom(Buffer.from(buffer), `${process.env.FTP_UPLOAD_DIR}/${remoteFileName}`);
    await client.close();
    return `${process.env.FTP_PUBLIC_URL}/${remoteFileName}`;
  } catch (error) {
    console.error("FTP upload failed:", error);
    await client.close();
    throw error;
  }
}

// POST /api/upload/profile/:userId
router.post("/profile/:userId", verifyToken, upload.single("file"), async (req, res) => {
  const userId = req.params.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const extension = path.extname(req.file.originalname).toLowerCase();
  const remoteFileName = `${userId}_profile${extension}`;

  try {
    const url = await uploadToFtp(req.file.buffer, remoteFileName);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = url;
    await user.save();

    res.status(200).json({ profilePicture: url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
});

export default router;
