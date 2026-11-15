
import type { Request, Response } from "express";
import type { ListUsersUseCase } from "../../../core/use-cases/user/ListUsersUseCase.js";

export class ListUsersController {
  static handle: any;
  constructor(
    private listUsersUseCase: ListUsersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.listUsersUseCase.execute();

      const safeUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));

      return res.status(200).json(safeUsers);

    } catch (error: unknown) {
      return res.status(500).json({
        error: "Unexpected error listing users.",
      });
    }
  }
}
