// generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const {
    password,
    ...userWithoutPassword
  } = user; // Destructure to remove password
  const payload = {
    id: user.id || user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    suburb: user.suburb,
    postcode: user.postcode,
    territory: user.territory,
    profilePicture: user.profilePicture || null,
    fileUploader: user.cvDocument || null,
    fileUploaderOriginalName: user.cvDocument?.originalName || null,
    profileLinks: user.profileLinks || {},
    bio: user.bio || "",
  };
  console.log("Payload:", payload); // Debugging line to check the payload

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export default generateToken;