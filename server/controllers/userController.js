// userController.js
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.params.id;

  if (req.user.id !== userId) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this profile" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate updated token
    const token = generateToken(updatedUser);

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
