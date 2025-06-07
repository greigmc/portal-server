import { User } from "../models/userModel.js";

export const normalizeEmail = (email) => email.trim().toLowerCase();
export const normalizeUsername = (username) => username.trim();

export const findUserByIdentifier = async (identifier) => {
  const email = normalizeEmail(identifier);
  const username = identifier.trim();
  return await User.findOne({
    $or: [{ email }, { username }],
  });
};
