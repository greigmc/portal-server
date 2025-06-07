// authController.js
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

export const signin = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { identifier, password } = req.body;

  try {
    const user = await findUserByIdentifier(identifier);
    if (!user)
      return res.status(400).json({
        message: "User does not exist",
      });

    const isValid = await comparePassword(password, user.password);
    if (!isValid)
      return res.status(400).json({
        message: "Invalid password",
      });

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(404).json({
        message: "User not found",
      });

    const token = generateToken(updatedUser);

    res.json({
      message: "Profile updated successfully",
      token,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email } = req.body;

  try {
    const user = await User.findOne({
      email: normalizeEmail(email),
    });
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
      // Don't reveal whether the email exists
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    await sendResetPasswordEmail(user.email, token, user.name);

    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log("🔍 Received token and password:", token, password);

  try {
    // Find the user by the reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: {
        $gt: Date.now(),
      }, // Token is still valid
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });
    }

    // Reset the user's password
    user.password = await hashPassword(password);

    // Clear the reset token and expiry
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      message: "Password successfully reset.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateProfileLinks = async (req, res) => {
  const { id } = req.params;
  const { profileLinks } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { profileLinks },
      { new: true },
    );

    const token = generateToken(user); // include updated info
    res.json({ token });
  } catch (err) {
    console.error("Error updating profile links:", err);
    res.status(500).json({ error: "Failed to update links." });
  }
};
