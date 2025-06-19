// contactRoutes.js
import express from "express";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import { sendContactEmails } from "../controllers/contactController.js";

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
  ],
  (req, res) => {
    if (handleValidationErrors(req, res)) return;

    sendContactEmails(req.body)
      .then(() => res.status(200).json({ message: "Message sent!" }))
      .catch((err) => {
        console.error("Email sending error:", err);
        res.status(500).json({ message: "Error sending email" });
      });
  },
);

export default router;
