import type { MachineRepository } from "../../../infra/repositories/machine-repository.ts.js";
import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";
import { ProductionOrderStatus } from "../../entitties/ProductionOrder.js";

interface UpdateProductionOrderStatusRequest {
  productionOrderId: string;
  status: ProductionOrderStatus;
}

export class UpdateProductionOrderStatusUseCase {
  constructor(
    private productionOrderRepository: ProductionOrderRepository,
    private machineRepository: MachineRepository
  ) {}

  async execute({
    productionOrderId,
    status,
  }: UpdateProductionOrderStatusRequest): Promise<void> {
    const productionOrder =
      await this.productionOrderRepository.findById(productionOrderId);

      console.log("ID DA ORDEM:", productionOrderId);
console.log("ORDEM COMPLETA:", productionOrder);
console.log("MACHINE ID:", productionOrder?.machineId);


    if (!productionOrder) {
      throw new Error("Ordem de produção não encontrada.");
    }

    if (status === ProductionOrderStatus.IN_PROGRESS) {
      console.log("BUSCANDO MÁQUINA COM ID:", productionOrder.machineId);
      const machine = await this.machineRepository.findById(
        productionOrder.machineId
      );

      console.log("RESULTADO DA MÁQUINA:", machine);

      if (!machine) {
        throw new Error("Máquina vinculada não encontrada.");
      }

      if (machine.status === "MAINTENANCE") {
        throw new Error(
          "Não é possível iniciar a produção: a máquina está em manutenção."
        );
      }
    }

    productionOrder.status = status;

    await this.productionOrderRepository.update(productionOrder);
  }
}