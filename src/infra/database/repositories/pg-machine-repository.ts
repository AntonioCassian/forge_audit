import { Pool } from "pg";
import type { MachineRepository } from "../../repositories/machine-repository.ts.js";
import { Machine, type MachineStatus } from "../../../core/entitties/equipment.js";

export class PgMachineRepository implements MachineRepository {
  static findById: any;
  constructor(private pool: Pool) {}

  async create(machine: Machine): Promise<void> {
    await this.pool.query(
      `INSERT INTO machines (name, asset_code, status)
       VALUES ($1, $2, $3)`,
      [machine.name, machine.assetCode, machine.status]
    );
  }

  async findById(id: string): Promise<Machine | null> {
    const result = await this.pool.query(
      `SELECT * FROM machines WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    const data = result.rows[0];

    return new Machine({
      id: data.id,
      name: data.name,
      assetCode: data.asset_code,
      status: data.status,
    });
  }

  async findAll(): Promise<Machine[]> {
    const result = await this.pool.query(
      `SELECT * FROM machines`
    );

    return result.rows.map(
      (data) =>
        new Machine({
          id: data.id,
          name: data.name,
          assetCode: data.asset_code,
          status: data.status,
        })
    );
  }

  async save(machine: Machine): Promise<void> {
    await this.pool.query(
      `UPDATE machines
       SET name = $1, asset_code = $2, status = $3
       WHERE id = $4`,
      [machine.name, machine.assetCode, machine.status, machine.id]
    );
  }

  async updateStatus(id: string, status: MachineStatus): Promise<void> {
  await this.pool.query(
    `UPDATE machines
     SET status = $1
     WHERE id = $2`,
    [status, id]
  );
}

  async delete(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM machines WHERE id = $1`,
      [id]
    );
  }
}