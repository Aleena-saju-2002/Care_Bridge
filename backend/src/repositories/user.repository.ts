import IUserRepository from "../interfaces/repositories/user.repository.interface";
import IUser from "../interfaces/models/user.interface";
import UserModel from "../models/user.model";
import BaseRepository from "./base.repository";

class UserRepository
extends BaseRepository<IUser>  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

 async findByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({
    email: email.trim().toLowerCase(),
  }).lean<IUser>();
}

  async createUser(
    userData: Omit<IUser, "_id" | "role" | "isBlocked">
  ): Promise<IUser> {
    const user = await UserModel.create(userData);

    return user.toObject() as IUser;
  }

  async updateVerificationStatus(
    email: string,
    isVerified: boolean
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { email },
      { isVerified },
      { new: true }
    ).lean<IUser>();
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );
  }
}

export default UserRepository;