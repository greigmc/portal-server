// forgetPasswordRoutes.js
import express from "express";
import { body } from "express-validator";
import { forgotPassword } from "../controllers/forgetPasswordController.js";
import { handleValidationErrors } from "../validators/handleValidation.js";

const router = express.Router();

router.post(
  "/forgotPassword",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    handleValidationErrors, // ✅ used as middleware
  ],
  forgotPassword, // ✅ simplified call
);

export default router;
