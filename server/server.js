import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Use your FRONTEND_URL env var or fallback
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

// CORS with dynamic origin
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// API routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/upload", uploadRoutes);

// **Serve uploads statically (important!)**
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"))
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});