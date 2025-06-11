import express from "express";
import multer from "multer";
import path from "path";
import { Client } from "basic-ftp";
import { Readable } from "stream"; // ✅ Import Readable for stream handling
import verifyToken from "../middleware/authMiddleware.js";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Multer stores the file temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload to FTP using a stream
async function uploadToFtp(buffer, remoteFileName) {
  const client = new Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: true, // ✅ Use FTPS (secure FTP)
    });

    await client.ensureDir(process.env.FTP_UPLOAD_DIR);

    // ✅ Convert buffer to stream
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, `${process.env.FTP_UPLOAD_DIR}/${remoteFileName}`);

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
