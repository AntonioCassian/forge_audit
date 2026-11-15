import type { IAuditLogRepository } from "../../../infra/database/repositories/audit-log-repository.js";
import type { AuditLog } from "../../entitties/audit-log.js";


interface GetAuditLogsByUserUseCaseRequest {
  userId: string;
  startDate: Date;
  endDate: Date;
}

interface GetAuditLogsByUserUseCaseResponse {
  auditLogs: AuditLog[];
}

export class GetAuditLogsByUserUseCase {
  constructor(
    private auditLogRepository: IAuditLogRepository
  ) {}

  async execute({
    userId,
    startDate,
    endDate,
  }: GetAuditLogsByUserUseCaseRequest): Promise<GetAuditLogsByUserUseCaseResponse> {
    const auditLogs = await this.auditLogRepository.findByUser({
      userId,
      startDate,
      endDate,
    });

    return {
      auditLogs,
    };
  }
}
