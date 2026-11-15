import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";

export class DeleteProductionOrderUseCase {
  constructor(
    private productionOrderRepository: ProductionOrderRepository
  ) {}

  async execute(id: string): Promise<void> {
    const productionOrder =
      await this.productionOrderRepository.findById(id);

    if (!productionOrder) {
      throw new Error("Ordem de produção não encontrada.");
    }

    if (productionOrder.status === "IN_PROGRESS") {
      throw new Error(
        "Não é possível excluir uma ordem de produção em execução."
      );
    }

    await this.productionOrderRepository.delete(id);
  }
}