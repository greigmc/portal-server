// forgetPasswordController.js
import { User } from "../models/userModel.js";
import { sendResetPasswordEmail } from "../mailer/mailer.js";
import { normalizeEmail } from "../helpers/userHelpers.js";
import crypto from "crypto";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      email: normalizeEmail(email),
    });

    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
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
