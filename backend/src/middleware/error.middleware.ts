import { Request, Response, NextFunction } from "express";

import AppError from "../errors/app.error";

import { errorResponse } from "../utils/response";

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      errorResponse(error.message)
    );
  }

  next(error);
};

export default errorMiddleware;