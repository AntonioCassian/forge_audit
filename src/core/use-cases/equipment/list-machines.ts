import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";

export class ListMachinesUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute() {
    const machines = await this.machineRepository.findAll();

    return machines;
  }
}
