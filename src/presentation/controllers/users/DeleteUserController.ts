
import type { Request, Response } from "express";
import type { DeleteUserUseCase } from "../../../core/use-cases/user/DeleteUserUseCase.js";

export class DeleteUserController {
  static handle: any;
  constructor(
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (typeof id !== "string" || id.trim().length === 0) {
        return res.status(400).json({ error: "A valid user ID is required." });
      }

      await this.deleteUserUseCase.execute(id);

      return res.status(204).send();

    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "Unexpected error deleting user.";

      return res.status(400).json({ error: message });
    }
  }
}
