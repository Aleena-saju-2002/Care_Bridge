import IAuthPayload from "../interfaces/auth/auth-payload.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload;
    }
  }
}

export {};