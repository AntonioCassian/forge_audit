import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";

export class GetAllProductionOrdersUseCase {
  constructor(
    private productionOrderRepository: ProductionOrderRepository
  ) {}

  async execute() {
    return await this.productionOrderRepository.findAllWithMachine();
  }
}