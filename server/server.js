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

// ✅ List of allowed frontend origins
const allowedOrigins = [
  "https://www.greigmcmahon.com",
  "https://www.greigmcmahon.net",
  "http://localhost:5173", // for local dev
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ✅ Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// ✅ API Routes
app.use("/api", userRoutes);
app.use("/api", signInRoutes);
app.use("/api", signUpRoutes);
app.use("/api", forgetPasswordRoutes);
app.use("/api", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", adminRoutes);

// ✅ Reset password route (under /app, possibly an SSR reset page?)
app.use("/app", resetPasswordRoutes);

// ✅ Static uploads
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
