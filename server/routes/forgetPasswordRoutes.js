// forgetPasswordRoutes.js
import express from "express";
import { body } from "express-validator";
import { forgotPassword } from "../controllers/forgetPasswordController.js";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";

const router = express.Router();

router.post(
  "/forgotPassword",
  [body("email").isEmail().normalizeEmail()],
  (req, res) => {
    if (handleValidationErrors(req, res)) return;
    forgotPassword(req, res);
  },
);

export default router;
