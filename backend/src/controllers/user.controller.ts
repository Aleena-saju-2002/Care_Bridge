import { Request, Response } from "express";
import UserService from "../services/user.service";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  }
}

export default UserController;