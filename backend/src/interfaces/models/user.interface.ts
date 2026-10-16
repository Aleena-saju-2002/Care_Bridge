import { Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  dob: Date;
  role: "user" | "admin" | "hospital";
  isVerified: boolean;
  isBlocked: boolean;
}

export default IUser;