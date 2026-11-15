import type { Request, Response } from "express";
import type { FindMachineByIdUseCase } from "../../../core/use-cases/equipment/find-machine-by-id.js";

export class FindMachineByIdController {
    static handle: any;
    constructor(
        private findMachineByIdUseCase: FindMachineByIdUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const machineId = req.params.id;

            if (typeof machineId !== "string" || !machineId) {
                return res.status(400).json({
                    message: "Machine id is required",
                });
            }

            const machine = await this.findMachineByIdUseCase.execute(machineId);

            return res.status(200).json(machine);
        } catch (error) {
            return res.status(404).json({
                message: (error as Error).message,
            });
        }
    }
}