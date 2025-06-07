import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Use env var in real applications
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

interface JwtUserPayload {
  user: {
    id: string;
    username: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload["user"];
}

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default verifyToken;
