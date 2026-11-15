import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";
import type { MachineStatus } from "../../entitties/equipment.js";

interface UpdateMachineRequest {
  id: string;
  name: string;
  assetCode: string;
  status: MachineStatus;
}

export class UpdateMachineUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute(data: UpdateMachineRequest): Promise<void> {
    const machine = await this.machineRepository.findById(data.id);

    if (!machine) {
      throw new Error("Machine not found");
    }

    machine.name = data.name;
    machine.assetCode = data.assetCode;
    machine.status = data.status;

    await this.machineRepository.save(machine);
  }
}