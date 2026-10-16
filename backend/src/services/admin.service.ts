import IAdminRepository from "../interfaces/repositories/admin.repository.interface";
import IUser from "../interfaces/models/user.interface";
// import AppError from "../utils/app-error";
import AppError from "../errors/app.error";


class AdminService {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number }> {
    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("Page must be a positive integer", 400);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new AppError("Limit must be between 1 and 100", 400);
    }

    return this.adminRepository.getAllUsers(page, limit, search);
  }

  async updateBlockStatus(
    userId: string,
    isBlocked: boolean,
    adminId: string
  ): Promise<IUser> {
    if (userId === adminId) {
      throw new AppError("You cannot block your own account", 400);
    }

    const user = await this.adminRepository.updateBlockStatus(
      userId,
      isBlocked
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export default AdminService;