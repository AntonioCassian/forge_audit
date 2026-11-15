import type { Request, Response } from "express";
import type { CreateMachineUseCase } from "../../../core/use-cases/equipment/CreateMachineUseCase.js";

export class CreateMachineController {
  static handle: any;
  constructor(
    private createMachineUseCase: CreateMachineUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      await this.createMachineUseCase.execute(req.body);

      return res.status(201).json({
        message: "Machine created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}