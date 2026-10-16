import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import authorizeRoles from "../middleware/authorize.middleware";

const router = Router();
const adminController = new AdminController();

// View and search users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getAllUsers
);

// Block or unblock a user
router.patch(
  "/users/:userId/block",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.updateBlockStatus
);

export default router;