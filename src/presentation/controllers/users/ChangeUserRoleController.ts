
import type { Request, Response } from "express";
import type { ChangeUserRoleUseCase } from "../../../core/use-cases/user/ChangeUserRoleUseCase.js";

export class ChangeUserRoleController {
  static handle: any;
  constructor(
    private changeUserRoleUseCase: ChangeUserRoleUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (typeof id !== "string" || id.trim().length === 0) {
        return res.status(400).json({ error: "A valid user ID is required." });
      }

      const updatedUser = await this.changeUserRoleUseCase.execute({
        id,
        role,
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
        : "Unexpected error changing user role.";

      return res.status(400).json({ error: message });
    }
  }
}
