// resetPasswordController.js
import { User } from "../models/userModel.js";
import { hashPassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  // console.log("🔍 Received token and password:", token, password);

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
