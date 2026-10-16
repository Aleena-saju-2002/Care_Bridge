import { Request, Response, NextFunction } from "express";
import AppError from "../errors/app.error";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError("Authentication required", 401)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access forbidden", 403)
      );
    }

    next();
  };
};

export default authorizeRoles;