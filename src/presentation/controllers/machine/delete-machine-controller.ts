import type { Request, Response } from "express";
import type { DeleteMachineUseCase } from "../../../core/use-cases/equipment/delete-machine.js";

export class DeleteMachineController {
  static handle: any;
  constructor(
    private deleteMachineUseCase: DeleteMachineUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const machineId = req.params.id;

      if (typeof machineId !== "string" || !machineId) {
        return res.status(400).json({
          message: "Machine id is required",
        });
      }

      await this.deleteMachineUseCase.execute(machineId);

      return res.status(200).json({
        message: "Machine deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}