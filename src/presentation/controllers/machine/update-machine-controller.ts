import type { Request, Response } from "express";
import type { UpdateMachineUseCase } from "../../../core/use-cases/equipment/update-machine.js";

export class UpdateMachineController {
  static handle: any;
  constructor(
    private updateMachineUseCase: UpdateMachineUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      await this.updateMachineUseCase.execute({
        id: req.params.id,
        ...req.body,
      });

      return res.status(200).json({
        message: "Machine updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}