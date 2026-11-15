export enum ProductionOrderStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  SUSPENDED = "SUSPENDED",
  COMPLETED = "COMPLETED",
}

export class ProductionOrder {
  id: string;
  productionCode: string;
  machineId: string;
  plannedQuantity: number;
  producedQuantity: number;
  status: ProductionOrderStatus;

  constructor(
    id: string,
    productionCode: string,
    machineId: string,
    plannedQuantity: number,
    producedQuantity: number,
    status: ProductionOrderStatus
  ) {
    this.id = id;
    this.productionCode = productionCode;
    this.machineId = machineId;
    this.plannedQuantity = plannedQuantity;
    this.producedQuantity = producedQuantity;
    this.status = status;
  }
}