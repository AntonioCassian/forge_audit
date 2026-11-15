import type {
  AuditLog,
  AuditEntity,
} from "../../../core/entitties/audit-log.js";

export interface FindManyAuditLogsParams {
  page: number;
  limit: number;
  resource?: AuditEntity;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FindAuditLogsByEntityParams {
  entityName: AuditEntity;
  entityId: string;
}

export interface FindAuditLogsByUserParams {
  userId: string;
  startDate: Date;
  endDate: Date;
}

export interface CountAuditLogsParams {
  resource?: AuditEntity;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IAuditLogRepository {
  create(auditLog: AuditLog): Promise<void>;

  findMany(params: FindManyAuditLogsParams): Promise<AuditLog[]>;

  findByEntity(params: FindAuditLogsByEntityParams): Promise<AuditLog[]>;

  findByUser(params: FindAuditLogsByUserParams): Promise<AuditLog[]>;

  count(params?: CountAuditLogsParams): Promise<number>;
}