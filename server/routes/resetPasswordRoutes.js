// resetPasswordsRoutes.js
import express from "express";
import { body } from "express-validator";
import { resetPassword } from "../controllers/resetPasswordController.js";
import { handleValidationErrors } from "../validators/handleValidation.js";

const router = express.Router();

router.post(
  "/resetPassword",
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    handleValidationErrors,
  ],
  resetPassword,
);

export default router;
