import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/userModel.ts";
import { sendConfirmationEmail } from "../mailer/mailer.ts";
import generateToken from "../utils/generateToken.ts";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

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
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      const message =
        existingUser.email === normalizedEmail
          ? "Email already in use"
          : "Username already taken";
      res.status(400).json({ message });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      phone,
      address,
      suburb,
      postcode,
      territory,
      password: hashedPassword,
    });

    await newUser.save();
    await sendConfirmationEmail(normalizedEmail, name);

    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { identifier, password } = req.body;
  const trimmedIdentifier = identifier.trim();
  const normalizedEmail = trimmedIdentifier.toLowerCase();

  try {
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedIdentifier }],
    });

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // Cast userObject to Partial<IUser> to allow deletion of password
    const userObject: Partial<IUser> = user.toObject();
    delete userObject.password;

    const token = generateToken({
      id: userObject._id,
      name: userObject.name,
      username: userObject.username,
      email: userObject.email,
      phone: userObject.phone,
      address: userObject.address,
      suburb: userObject.suburb,
      postcode: userObject.postcode,
      territory: userObject.territory,
    });

    res.status(200).json({
      token,
      user: {
        id: userObject._id,
        name: userObject.name,
        email: userObject.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
