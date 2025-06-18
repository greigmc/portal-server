// signUpController.js
import { User } from "../models/userModel.js";
import {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} from "../mailer/mailer.js";
import { handleValidationErrors } from "../validators/handleValidation.js";
import {
  normalizeEmail,
  normalizeUsername,
  findUserByIdentifier,
} from "../helpers/userHelpers.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const {
    name,
    username,
    email,
    phone,
    address,
    suburb,
    postcode,
    territory,
    password,
  } = req.body;

  try {
    const emailNorm = normalizeEmail(email);
    const usernameNorm = normalizeUsername(username);

    const existingUser = await User.findOne({
      $or: [
        {
          email: emailNorm,
        },
        {
          username: usernameNorm,
        },
      ],
    });

    if (existingUser) {
      const message =
        existingUser.email === emailNorm
          ? "Email already in use"
          : "Username already taken";
      return res.status(400).json({
        message,
      });
    }

    const newUser = new User({
      name,
      username: usernameNorm,
      email: emailNorm,
      phone,
      address,
      suburb,
      postcode,
      territory,
      password: await hashPassword(password),
    });

    await newUser.save();
    await sendConfirmationEmail(emailNorm, name);

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
