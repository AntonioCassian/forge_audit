import type { Request, Response } from "express";
import type { CreateUserUseCase } from "../../../core/use-cases/user/CreateUserUseCase.js";

export class CreateUserController {
  constructor(
    private createUserUseCase: CreateUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      if (typeof password !== "string" || password.length === 0) {
        return res.status(400).json({
          error: "Password is required."
        });
      }

      const newUser = await this.createUserUseCase.execute({
        name,
        email,
        password,
        role,
      });

      return res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "Unexpected error creating user.";

      return res.status(400).json({ error: message });
    }
  }
}