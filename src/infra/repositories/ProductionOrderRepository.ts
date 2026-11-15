// import type { ProductionOrder } from "../../core/entitties/ProductionOrder.js";

// export interface ProductionOrderWithMachine extends ProductionOrder {
//   machineName: string;
// }

// export interface ProductionOrderRepository {
//   create(productionOrder: ProductionOrder): Promise<void>;

//   findById(id: string): Promise<ProductionOrder | null>;

//   findAll(): Promise<ProductionOrder[]>;

//   findAllWithMachine(): Promise<ProductionOrderWithMachine[]>;

//   update(productionOrder: ProductionOrder): Promise<void>;

//   delete(id: string): Promise<void>;
// }


import type { ProductionOrder } from "../../core/entitties/ProductionOrder.js";

export interface ProductionOrderWithMachine extends ProductionOrder {
  machineName: string;
}

export interface ProductionOrderRepository {
  create(
    productionOrder: ProductionOrder
  ): Promise<ProductionOrder>;

  findById(id: string): Promise<ProductionOrder | null>;

  findAll(): Promise<ProductionOrder[]>;

  findAllWithMachine(): Promise<ProductionOrderWithMachine[]>;

  update(productionOrder: ProductionOrder): Promise<void>;

  delete(id: string): Promise<void>;
}
