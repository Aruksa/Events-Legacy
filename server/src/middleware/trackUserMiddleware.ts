import { ne } from "@faker-js/faker/.";
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key";

export const trackUserVisit = (req: Request, res: Response, next: NextFunction) => {
  console.log("Token: ", req.headers["authorization"]);
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token === "null" || !token || token === "undefined" || token === null || token === undefined) {
    console.log("passed");
    return next();
  }

  try {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token." });
      (req as any).user = user;
      next();
    });
    return;
  } catch (error) {
    console.log(error);
    next();
  }
};
