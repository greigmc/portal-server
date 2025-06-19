// contactRoutes.js
import express from "express";
import { body } from "express-validator";
import { handleContactForm } from "../controllers/contactController.js";
import { handleValidationErrors } from "../validators/handleValidation.js";

const router = express.Router();

router.post(
  "/contact",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").optional().isMobilePhone().withMessage("Valid phone number"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message")
      .notEmpty()
      .isLength({ max: 300 })
      .withMessage("Message must be under 300 characters"),
    handleValidationErrors, // 💡 middleware style!
  ],
  handleContactForm, // 🎯 this now handles the logic
);

export default router;
