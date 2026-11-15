
import type { Request, Response } from "express";
import type { FindUserUseCase } from "../../../core/use-cases/user/FindUserUseCase.js";

export class FindUserController {
  static handle: any;
  constructor(
    private findUserUseCase: FindUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || id.trim().length === 0) {
        return res.status(400).json({ error: "A valid user ID is required." });
      }

      const user = await this.findUserUseCase.execute(id);

      if (!user) {
        return res.status(404).json({
          error: "User not found.",
        });
      }

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

    } catch (error: unknown) {
      return res.status(500).json({
        error: "Unexpected error finding user.",
      });
    }
  }
}
