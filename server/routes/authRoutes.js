// authRoutes.js
import express from "express";
import { body } from "express-validator";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  updateProfileLinks,
} from "../controllers/authController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup route
router.post(
  "/signup",
  [
    body("name").trim().escape(),
    body("username").trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("phone").trim().escape(),
    body("address").trim().escape(),
    body("suburb").trim().escape(),
    body("postcode").trim().escape(),
    body("territory").trim().escape(),
    body("password").isLength({ min: 6 }),
  ],
  signup,
);

// Signin route
router.post(
  "/signin",
  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Email or username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  signin,
);

// Password forget routes
router.post(
  "/forgotPassword",
  [body("email").isEmail().normalizeEmail()],
  forgotPassword,
);

// Password reset routes
router.post(
  "/resetPassword",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  resetPassword,
);

// ✅ Profile links update route
router.put("/users/:id/links", authenticateToken, updateProfileLinks);

export default router;
