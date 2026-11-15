
import type { Request, Response } from "express";
import type { UpdateUserUseCase } from "../../../core/use-cases/user/UpdateUserUseCase.js";


export class UpdateUserController {
  static handle: any;
  constructor(
    private updateUserUseCase: UpdateUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (typeof id !== "string" || id.trim().length === 0) {
        return res.status(400).json({ error: "A valid user ID is required." });
      }

      const updatedUser = await this.updateUserUseCase.execute({
        id: id.trim(),
        name,
        email,
      });

      return res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });

    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "Unexpected error updating user.";

      return res.status(400).json({ error: message });
    }
  }
}
