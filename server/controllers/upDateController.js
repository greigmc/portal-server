// upDateController.js
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

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
