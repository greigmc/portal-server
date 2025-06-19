// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import signInRoutes from "./routes/signInRoutes.js";
import signUpRoutes from "./routes/signUpRoutes.js";
import forgetPasswordRoutes from "./routes/forgetPasswordRoutes.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

// Use your FRONTEND_URL env var or fallback
const allowedOrigin = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/$/, "");

// CORS with dynamic origin
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use(express.json());

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// user routes
app.use("/api", userRoutes);

// signIn routes
app.use("/api", signInRoutes);

// signUp routes
app.use("/api", signUpRoutes);

// forget password routes
app.use("/api", forgetPasswordRoutes);

// reset password routes
app.use("/app", resetPasswordRoutes);

// upload routes
app.use("/api/upload", uploadRoutes);

// admin routes
app.use("/api/users", adminRoutes);

// Contact Form routes
app.use("/api", contactRoutes);

// **Serve uploads statically (important!)**
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
