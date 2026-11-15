
import type { Request, Response } from "express";
import type { UpdateMachineStatusUseCase } from "../../../core/use-cases/equipment/update-machine-status-use-case.js";
import type { MachineStatus } from "../../../core/entitties/equipment.js";

const VALID_STATUSES: readonly MachineStatus[] = [
  "OPERATIONAL",
  "MAINTENANCE",
  "STOPPED_DUE_TO_FAILURE",
];

export class UpdateMachineStatusController {
  constructor(
    private updateMachineStatusUseCase: UpdateMachineStatusUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const machineId = Array.isArray(id) ? id[0] : id;
      const status: unknown = req.body?.status;

      if (!machineId) {
        return res.status(400).json({
          message: "ID da máquina inválido.",
        });
      }

      if (
        typeof status !== "string" ||
        !VALID_STATUSES.includes(status as MachineStatus)
      ) {
        return res.status(400).json({
          message: "Status de máquina inválido.",
        });
      }

      await this.updateMachineStatusUseCase.execute(
        machineId,
        status as MachineStatus
      );

      return res.status(200).json({
        message: "Machine status updated successfully",
      });
    } catch (error) {
      const message = (error as Error).message;

      return res.status(
        message === "Máquina não encontrada." ? 404 : 400
      ).json({ message });
    }
  }
}
