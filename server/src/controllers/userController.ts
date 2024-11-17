import { Request, Response } from "express";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const secretKey = "your_secret_key";

export const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User is not registered." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1d",
    });
    // res.cookie('token', token);

    res.status(200).json({ message: "Login successful", token });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
    return;
  }
};

export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error });
    return;
  }
};
