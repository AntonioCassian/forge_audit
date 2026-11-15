// Busca uma ordem pelo ID.

import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";


export class GetProductionOrderByIdUseCase {
  constructor(
    private productionOrderRepository: ProductionOrderRepository
  ) {}

  async execute(id: string) {
    const productionOrder =
      await this.productionOrderRepository.findById(id);

    if (!productionOrder) {
      throw new Error("Ordem de produção não encontrada.");
    }

    return productionOrder;
  }
}