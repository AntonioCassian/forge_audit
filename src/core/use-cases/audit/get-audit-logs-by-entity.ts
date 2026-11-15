import type { IAuditLogRepository } from "../../../infra/database/repositories/audit-log-repository.js";

type AuditEntity = Parameters<
  IAuditLogRepository["findByEntity"]
>[0]["entityName"];

interface GetAuditLogsByEntityUseCaseRequest {
  entityName: AuditEntity;
  entityId: string;
}

export class GetAuditLogsByEntityUseCase {
  constructor(
    private auditLogRepository: IAuditLogRepository
  ) {}

  async execute({
    entityName,
    entityId,
  }: GetAuditLogsByEntityUseCaseRequest) {
    const auditLogs =
      await this.auditLogRepository.findByEntity({
        entityName,
        entityId,
      });

    return {
      auditLogs,
    };
  }
}