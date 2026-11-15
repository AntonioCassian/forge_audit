
import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";
import type { MachineStatus } from "../../entitties/equipment.js";

export class UpdateMachineStatusUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute(id: string, status: MachineStatus): Promise<void> {
    const machine = await this.machineRepository.findById(id);

    if (!machine) {
      throw new Error("Máquina não encontrada.");
    }

    await this.machineRepository.updateStatus(id, status);
  }
}
