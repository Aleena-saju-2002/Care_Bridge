import { Router } from "express";
import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import UserRepository from "../repositories/user.repository";
import authMiddleware from "../middleware/auth.middleware";
import authorizeRoles from "../middleware/role.middleware";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
  "/signup",
  userController.signup.bind(userController)
);
router.post("/verify-otp", userController.verifyOTP);

router.post(
  "/login",
  userController.login.bind(userController)
);




router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});


router.post("/forgot-password", userController.forgotPassword);
router.post(
  "/verify-forgot-password-otp",
  userController.verifyForgotPasswordOtp
);
router.post(
  "/reset-password",
  userController.resetPassword
);



router.get(
  "/admin-test",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
    });
  }
);



export default router;