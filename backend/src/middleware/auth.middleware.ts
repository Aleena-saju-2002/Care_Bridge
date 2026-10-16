import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import IAuthPayload from "../interfaces/auth/auth-payload.interface";
import { config } from "../config/env";


const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token is missing",
    });
  }

  try {
   const decoded = jwt.verify(token, config.jwtSecret) as IAuthPayload;

req.user = decoded;

next();
  } catch  {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;