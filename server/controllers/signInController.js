// signInController.js
import { handleValidationErrors } from "../validators/handleValidation.js";
import { findUserByIdentifier } from "../helpers/userHelpers.js";
import { comparePassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";

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
