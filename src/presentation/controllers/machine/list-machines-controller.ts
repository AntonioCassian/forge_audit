import type { Request, Response } from "express";
import type { ListMachinesUseCase } from "../../../core/use-cases/equipment/list-machines.js";

export class ListMachinesController {
  static handle: any;
  constructor(
    private listMachinesUseCase: ListMachinesUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const machines = await this.listMachinesUseCase.execute();

      return res.status(200).json(machines);
    } catch (error) {
      return res.status(500).json({
        message: (error as Error).message,
      });
    }
  }
}