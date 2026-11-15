// import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";
// import { ProductionOrder, ProductionOrderStatus } from "../../entitties/ProductionOrder.js";


// interface CreateProductionOrderRequest {
//   productionCode: string;
//   machineId: string;
//   plannedQuantity: number;
// }

// export class CreateProductionOrderUseCase {
//   constructor(
//     private productionOrderRepository: ProductionOrderRepository
//   ) {}

//   async execute({
//     productionCode,
//     machineId,
//     plannedQuantity,
//   }: CreateProductionOrderRequest): Promise<void> {

//     if (!productionCode || !machineId) {
//       throw new Error("Código de produção e máquina são obrigatórios.");
//     }

//     if (plannedQuantity <= 0) {
//       throw new Error("A quantidade planejada deve ser maior que zero.");
//     }

//     const productionOrder = new ProductionOrder(
//       crypto.randomUUID(),
//       productionCode,
//       machineId,
//       plannedQuantity,
//       0,
//       ProductionOrderStatus.PLANNED
//     );

//     await this.productionOrderRepository.create(productionOrder);
//   }
// }


// export interface ProductionOrderResponse {
//   id: string;
//   productionCode: string;
//   machineId: string;
//   machineName: string;
//   plannedQuantity: number;
//   producedQuantity: number;
//   status: ProductionOrderStatus;
// }



import type { ProductionOrderRepository } from "../../../infra/repositories/ProductionOrderRepository.js";

import {
  ProductionOrder,
  ProductionOrderStatus,
} from "../../entitties/ProductionOrder.js";

interface CreateProductionOrderRequest {
  productionCode: string;
  machineId: string;
  plannedQuantity: number;
}

export class CreateProductionOrderUseCase {
  constructor(
    private productionOrderRepository: ProductionOrderRepository
  ) {}

  async execute({
    productionCode,
    machineId,
    plannedQuantity,
  }: CreateProductionOrderRequest): Promise<ProductionOrder> {

    if (!productionCode || !machineId) {
      throw new Error(
        "Código de produção e máquina são obrigatórios."
      );
    }

    if (plannedQuantity <= 0) {
      throw new Error(
        "A quantidade planejada deve ser maior que zero."
      );
    }

    const productionOrder = new ProductionOrder(
      crypto.randomUUID(),
      productionCode,
      machineId,
      plannedQuantity,
      0,
      ProductionOrderStatus.PLANNED
    );

    await this.productionOrderRepository.create(productionOrder);

    return productionOrder;
  }
}

export interface ProductionOrderResponse {
  id: string;
  productionCode: string;
  machineId: string;
  machineName: string;
  plannedQuantity: number;
  producedQuantity: number;
  status: ProductionOrderStatus;
}
