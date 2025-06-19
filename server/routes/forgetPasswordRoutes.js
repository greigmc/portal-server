// forgetPasswordRoutes.js
import express from "express";
import { body } from "express-validator";
import { forgotPassword } from "../controllers/forgetPasswordController.js";

const router = express.Router();

// Password forget routes
router.post(
  "/forgotPassword",
  [body("email").isEmail().normalizeEmail()],
  forgotPassword,
);

export default router;
