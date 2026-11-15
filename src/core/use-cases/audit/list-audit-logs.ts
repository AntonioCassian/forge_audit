
import type { IAuditLogRepository } from "../../../infra/database/repositories/audit-log-repository.js";
import type {
  AuditLog,
  AuditEntity,
} from "../../entitties/audit-log.js";

interface ListAuditLogsUseCaseRequest {
  page: number;
  limit: number;
  resource?: AuditEntity;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ListAuditLogsUseCaseResponse {
  auditLogs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export class ListAuditLogsUseCase {
  constructor(
    private auditLogRepository: IAuditLogRepository
  ) {}

  async execute({
    page,
    limit,
    resource,
    dateFrom,
    dateTo,
  }: ListAuditLogsUseCaseRequest): Promise<ListAuditLogsUseCaseResponse> {

    const filters = {
      ...(resource !== undefined && { resource }),
      ...(dateFrom !== undefined && { dateFrom }),
      ...(dateTo !== undefined && { dateTo }),
    };

    const [auditLogs, total] = await Promise.all([
      this.auditLogRepository.findMany({
        page,
        limit,
        ...filters,
      }),

      this.auditLogRepository.count(filters),
    ]);

    return {
      auditLogs,
      total,
      page,
      limit,
    };
  }
}
