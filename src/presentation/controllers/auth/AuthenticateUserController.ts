import type { Request, Response, NextFunction } from "express";
import type { AuthenticateUser } from "../../../core/use-cases/auth/authenticate_user.js";

export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUser) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const result = await this.authenticateUser.execute({
        email,
        password,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}