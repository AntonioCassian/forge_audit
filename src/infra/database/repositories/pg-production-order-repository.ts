
import { Pool } from "pg";

import type { ProductionOrderRepository, ProductionOrderWithMachine } from "../../repositories/ProductionOrderRepository.js";
import type { ProductionOrder } from "../../../core/entitties/ProductionOrder.js";

export class PgProductionOrderRepository
  implements ProductionOrderRepository
{
  constructor(private pool: Pool) {}

  async create(productionOrder: ProductionOrder): Promise<ProductionOrder> {
    await this.pool.query(
      `INSERT INTO production_orders
      (id, production_code, machine_id, planned_quantity, produced_quantity, status)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        productionOrder.id,
        productionOrder.productionCode,
        productionOrder.machineId,
        productionOrder.plannedQuantity,
        productionOrder.producedQuantity,
        productionOrder.status,
      ]
    );

    return productionOrder;
  }

  async findById(id: string): Promise<ProductionOrder | null> {
    const result = await this.pool.query(
      `SELECT * FROM production_orders WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async findAll(): Promise<ProductionOrder[]> {
    const result = await this.pool.query(
      `SELECT * FROM production_orders ORDER BY production_code`
    );

    return result.rows.map((row) => this.mapToEntity(row));
  }

  // NOVO: busca as ordens junto com o nome da máquina
  async findAllWithMachine(): Promise<ProductionOrderWithMachine[]> {
    const result = await this.pool.query(
      `SELECT
        po.id,
        po.production_code,
        po.machine_id,
        m.name AS machine_name,
        po.planned_quantity,
        po.produced_quantity,
        po.status
      FROM production_orders po
      INNER JOIN machines m ON m.id = po.machine_id
      ORDER BY po.production_code`
    );

    return result.rows.map((row) => ({
      ...this.mapToEntity(row),
      machineName: row.machine_name,
    }));
  }

  async update(productionOrder: ProductionOrder): Promise<void> {
    await this.pool.query(
      `UPDATE production_orders
       SET production_code = $1,
           machine_id = $2,
           planned_quantity = $3,
           produced_quantity = $4,
           status = $5
       WHERE id = $6`,
      [
        productionOrder.productionCode,
        productionOrder.machineId,
        productionOrder.plannedQuantity,
        productionOrder.producedQuantity,
        productionOrder.status,
        productionOrder.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM production_orders WHERE id = $1`,
      [id]
    );
  }

  private mapToEntity(row: any): ProductionOrder {
    return {
      id: row.id,
      productionCode: row.production_code,
      machineId: row.machine_id,
      plannedQuantity: Number(row.planned_quantity),
      producedQuantity: Number(row.produced_quantity),
      status: row.status,
    } as ProductionOrder;
  }
}
