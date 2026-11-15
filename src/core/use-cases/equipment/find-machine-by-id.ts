import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";
import type { Machine } from "../../entitties/equipment.js";

export class FindMachineByIdUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute(id: string): Promise<Machine> {
    const machine = await this.machineRepository.findById(id);

    if (!machine) {
      throw new Error("Machine not found");
    }

    return machine;
  }
}