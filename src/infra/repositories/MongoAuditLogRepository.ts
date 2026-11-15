
import type { Collection } from "mongodb";

import type {
  IAuditLogRepository,
  FindManyAuditLogsParams,
  FindAuditLogsByEntityParams,
  FindAuditLogsByUserParams,
  CountAuditLogsParams,
} from "../database/repositories/audit-log-repository.js";

import {
  AuditLog,
  type AuditEntity,
} from "../../core/entitties/audit-log.js";

import type { UserRole } from "../../core/entitties/usuarios.js";

export class MongoAuditLogRepository implements IAuditLogRepository {

  constructor(
    private collection: Collection<AuditLog>
  ) {}

  // ========================================
  // CREATE
  // ========================================

  async create(auditLog: AuditLog): Promise<void> {
    await this.collection.insertOne(auditLog);
  }

  // ========================================
  // BUILD FILTER
  // ========================================

  private buildFilter(params?: CountAuditLogsParams): Record<string, any> {
    const filter: Record<string, any> = {};

    if (params?.resource) {
      filter.affectedEntity = params.resource;
    }

    if (params?.dateFrom || params?.dateTo) {
      filter.dateTime = {};

      if (params.dateFrom) {
        filter.dateTime.$gte = params.dateFrom;
      }

      if (params.dateTo) {
        filter.dateTime.$lte = params.dateTo;
      }
    }

    return filter;
  }

  // ========================================
  // FIND MANY
  // ========================================

  async findMany({
    page,
    limit,
    resource,
    dateFrom,
    dateTo,
  }: FindManyAuditLogsParams): Promise<AuditLog[]> {

    const skip = (page - 1) * limit;

    const filter = this.buildFilter({
      ...(resource !== undefined && { resource }),
      ...(dateFrom !== undefined && { dateFrom }),
      ...(dateTo !== undefined && { dateTo }),
    });

    const rows = await this.collection
      .find(filter)
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return rows.map((row) => this.mapToEntity(row));
  }

  // ========================================
  // FIND BY ENTITY
  // ========================================

  async findByEntity({
    entityName,
    entityId,
  }: FindAuditLogsByEntityParams): Promise<AuditLog[]> {

    const rows = await this.collection
      .find({
        affectedEntity: entityName,
        affectedRecordId: entityId,
      })
      .sort({ dateTime: 1 })
      .toArray();

    return rows.map((row) => this.mapToEntity(row));
  }

  // ========================================
  // FIND BY USER
  // ========================================

  async findByUser({
    userId,
    startDate,
    endDate,
  }: FindAuditLogsByUserParams): Promise<AuditLog[]> {

    const rows = await this.collection
      .find({
        userId,
        dateTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ dateTime: -1 })
      .toArray();

    return rows.map((row) => this.mapToEntity(row));
  }

  // ========================================
  // COUNT
  // ========================================

  async count(params?: CountAuditLogsParams): Promise<number> {
    const filter = this.buildFilter(params);

    return this.collection.countDocuments(filter);
  }

  // ========================================
  // MAP TO ENTITY
  // ========================================

  private mapToEntity(row: any): AuditLog {
    return new AuditLog({
      id: row._id.toString(),
      userId: row.userId,
      userName: row.userName,
      role: row.role as UserRole,
      sourceIp: row.sourceIp,
      dateTime: row.dateTime,
      action: row.action,
      affectedEntity: row.affectedEntity as AuditEntity,
      affectedRecordId: row.affectedRecordId,
      previousData: row.previousData,
      newData: row.newData,
    });
  }
}
