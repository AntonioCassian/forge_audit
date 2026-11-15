import type { IAuditLogRepository } from "../../../infra/database/repositories/audit-log-repository.js";
import type { AuditLog } from "../../entitties/audit-log.js";

interface ExportAuditTrailUseCaseRequest {
  entityName?: Parameters<IAuditLogRepository["findByEntity"]>[0]["entityName"];
  entityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

interface ExportAuditTrailUseCaseResponse {
  fileName: string;
  content: string;
  contentType: string;
}

export class ExportAuditTrailUseCase {
  constructor(
    private auditLogRepository: IAuditLogRepository
  ) {}

  async execute({
    entityName,
    entityId,
    userId,
    startDate,
    endDate,
  }: ExportAuditTrailUseCaseRequest): Promise<ExportAuditTrailUseCaseResponse> {

    let auditLogs: AuditLog[];

    if (entityName && entityId) {
      auditLogs = await this.auditLogRepository.findByEntity({
        entityName,
        entityId,
      });
    } else if (userId && startDate && endDate) {
      auditLogs = await this.auditLogRepository.findByUser({
        userId,
        startDate,
        endDate,
      });
    } else {
      auditLogs = await this.auditLogRepository.findMany({
        page: 1,
        limit: 10000,
      });
    }

    const headers = [
      "ID",
      "Usuario",
      "Cargo",
      "IP",
      "Data",
      "Acao",
      "Entidade",
      "Registro",
      "Dados Anteriores",
      "Dados Novos",
    ];

    const escapeCsv = (value: unknown): string => {
      const text = typeof value === "string"
        ? value
        : JSON.stringify(value ?? "");

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = auditLogs.map((log) => [
      log.id,
      log.userName,
      log.role,
      log.sourceIp,
      log.dateTime.toISOString(),
      log.action,
      log.affectedEntity,
      log.affectedRecordId,
      log.previousData,
      log.newData,
    ].map(escapeCsv).join(","));

    const content = [
      headers.join(","),
      ...rows,
    ].join("\n");

    return {
      fileName: "audit-trail.csv",
      content,
      contentType: "text/csv; charset=utf-8",
    };
  }
}
