import { Request, Response, NextFunction } from "express";
import AdminService from "../services/admin.service";
import AdminRepository from "../repositories/admin.repository.interface";

class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService(new AdminRepository());
  }

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = String(req.query.search ?? "");

      const result = await this.adminService.getAllUsers(
        page,
        limit,
        search
      );

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateBlockStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.userId;

      if (typeof userId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const { isBlocked } = req.body;

      if (typeof isBlocked !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isBlocked must be true or false",
        });
        return;
      }

const adminId = req.user?.userId;
      if (!adminId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const user = await this.adminService.updateBlockStatus(
        userId,
        isBlocked,
        adminId
      );

      res.status(200).json({
        success: true,
        message: isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;