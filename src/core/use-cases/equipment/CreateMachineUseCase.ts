import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";
import { Machine, type MachineStatus } from "../../entitties/equipment.js";


interface CreateMachineRequest {
  name: string;
  assetCode: string;
  status: MachineStatus;
}

export class CreateMachineUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute(data: CreateMachineRequest): Promise<void> {
    const machine = new Machine({
      name: data.name,
      assetCode: data.assetCode,
      status: data.status,
    });

    await this.machineRepository.create(machine);
  }
}