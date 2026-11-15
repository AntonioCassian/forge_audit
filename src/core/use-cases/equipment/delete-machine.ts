import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";

export class DeleteMachineUseCase {
  constructor(
    private machineRepository: MachineRepository
  ) {}

  async execute(id: string): Promise<void> {
    const machine = await this.machineRepository.findById(id);

    if (!machine) {
      throw new Error("Machine not found");
    }

    await this.machineRepository.delete(id);
  }
}