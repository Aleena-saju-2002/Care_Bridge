import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateToken = (
  userId: string,
  role: string
): string => {
  return jwt.sign(
    { userId, role },
    config.jwtSecret,
    { expiresIn: "1d" }
  );
};