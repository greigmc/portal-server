import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import stream from "stream";
import { pipeline } from "stream/promises";
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

// Helper: Upload to Cloudinary
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

// Main Upload Handler
export const uploadProfilePicture = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      let existingPublicId = user?.profilePicture?.publicId || null;

      // Explicitly delete old image if it exists
      if (existingPublicId) {
        console.log("Deleting existing image:", existingPublicId);
        const deleteResult =
          await cloudinary.uploader.destroy(existingPublicId);
        console.log("Cloudinary delete result:", deleteResult);
      }

      // Upload new image
      const uploadOptions = {
        folder: "profile",
        transformation: {
          width: 500,
          height: 500,
          crop: "limit",
        },
      };

      const result = await uploadToCloudinary(req.file.buffer, uploadOptions);

      // Save new image info to user
      const update = {
        profilePicture: {
          url: result.secure_url,
          publicId: result.public_id,
          uploadedImage: result.secure_url,
        },
      };

      await User.findByIdAndUpdate(req.params.userId, update, { new: true });
      const updatedUser = await User.findById(req.params.userId);
      const token = generateToken(updatedUser);

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
        token,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({
        error: "Upload failed",
        details: error.message,
      });
    }
  },
];
