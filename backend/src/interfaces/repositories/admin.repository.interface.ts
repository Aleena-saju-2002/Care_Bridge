import IUser from "../models/user.interface";

interface IAdminRepository {
  getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number }>;

  updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null>;
}

export default IAdminRepository;