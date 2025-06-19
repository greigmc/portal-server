// signInRoutes.js
import express from "express";
import { body } from "express-validator";
import { signin } from "../controllers/signInController.js";
import { handleValidationErrors } from "../validators/handleValidation.js"; // ✅ import it

const router = express.Router();

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
    handleValidationErrors, // ✅ use it here
  ],
  signin,
);

export default router;
