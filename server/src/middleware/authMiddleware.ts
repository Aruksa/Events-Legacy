import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key"; // Use environment variables in production

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Token: ", req.headers["authorization"]);
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "Access denied. Token not provided." });
    return;
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    (req as any).user = user;
    next();
  });
  return;
};
