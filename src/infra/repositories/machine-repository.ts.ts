import type { Machine, MachineStatus } from "../../core/entitties/equipment.js";

export interface MachineRepository {
  create(machine: Machine): Promise<void>;

  findById(id: string): Promise<Machine | null>;

  findAll(): Promise<Machine[]>;

  save(machine: Machine): Promise<void>;

  updateStatus(id: string, status: MachineStatus): Promise<void>;

  delete(id: string): Promise<void>;
}