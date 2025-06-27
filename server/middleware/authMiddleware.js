// authMiddleware.js
import jwt from "jsonwebtoken";

const SECRET_KEY = (process.env.JWT_SECRET || "").trim();

if (!SECRET_KEY) {
  throw new Error("Missing JWT_SECRET. Check your environment variables.");
}


const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("JWT_SECRET from process.env:", `"${SECRET_KEY}"`);
  // console.log("Authorization header:", authHeader);

  const token = authHeader?.replace("Bearer ", "").trim();
  // console.log("Extracted token:", token);

  if (!token) {
    // console.log("No token provided");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    // console.log("JWT verify error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default verifyToken;

