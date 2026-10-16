import { Types } from "mongoose";
import IUser from "../interfaces/models/user.interface";
import IAdminRepository from "../interfaces/repositories/admin.repository.interface";
import UserModel from "../models/user.model";
import BaseRepository from "./base.repository";

class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(UserModel);
  }

  async getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number }> {
    const filter = search.trim()
      ? {
          $or: [
            { name: { $regex: search.trim(), $options: "i" } },
            { email: { $regex: search.trim(), $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .lean<IUser[]>(),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }

  async updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return UserModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean<IUser>();
  }
}

export default AdminRepository;