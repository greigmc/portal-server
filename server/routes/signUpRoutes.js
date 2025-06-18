// signUpRoutes.js
import express from "express";
import { body } from "express-validator";
import { signup } from "../controllers/signUpController.js";

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

export default router;
