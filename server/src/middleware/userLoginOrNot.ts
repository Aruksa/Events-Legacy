import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key"; // Use environment variables in production

export const authLoginOrNot = (req: Request, res: Response) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Access denied. No token provided." });
    return;
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(200).json({ status: false });
    (req as any).user = user; // attach user data to request
    //console.log("Req: ", (req as any).user.id);
    const userId = (req as any).user.id;
    res.status(200).json({ status: true, id: userId });
  });
  return;
};
