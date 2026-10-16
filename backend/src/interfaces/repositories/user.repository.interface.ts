import IBaseRepository from "./base.repository.interface";
import IUser from "../models/user.interface";

interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;

  createUser(
    userData: Omit<IUser, "_id" | "role" | "isBlocked">
  ): Promise<IUser>;

  
  
  updateVerificationStatus(
    email: string,
    isVerified: boolean
  ): Promise<IUser | null>;

  updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<void>;
}

export default IUserRepository;