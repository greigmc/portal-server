import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import stream from "stream";
import { User } from "../models/userModel.js";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

// Upload Helper
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    const readable = stream.Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};

// CV Upload Controller
export const uploadCvDocument = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const existingPublicId = user?.cvDocument?.publicId;

      // Delete old CV if exists
      if (existingPublicId) {
        console.log("Deleting existing CV:", existingPublicId);
        const deleteResult = await cloudinary.uploader.destroy(
          existingPublicId,
          {
            resource_type: "raw",
          },
        );
        console.log("CV Delete Result:", deleteResult);
      }

      // Upload new CV
      const uploadOptions = {
        folder: "cv",
        resource_type: "raw", // Important for non-image files
      };

      const result = await uploadToCloudinary(req.file.buffer, uploadOptions);

      // Update user with new CV metadata
      await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            "cvDocument.url": result.secure_url,
            "cvDocument.publicId": result.public_id,
            "cvDocument.originalName": req.file.originalname,
          },
        },
        { new: true },
      );

      res.json({
        fileUploader: result.secure_url, // <-- match expected frontend field
        originalName: req.file.originalname,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("CV Upload Error:", error);
      res.status(500).json({
        error: "CV upload failed",
        details: error.message,
      });
    }
  },
];
