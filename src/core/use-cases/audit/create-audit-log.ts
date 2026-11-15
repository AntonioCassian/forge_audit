
import type { IAuditLogRepository } from "../../../infra/database/repositories/audit-log-repository.js";
import { AuditLog, type AuditLogProps } from "../../entitties/audit-log.js";

interface CreateAuditLogUseCaseRequest {
  userId: string;
  userName: string;
  role: AuditLogProps["role"];
  sourceIp: string;
  action: string;
  affectedEntity: AuditLogProps["affectedEntity"];
  affectedRecordId: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

interface CreateAuditLogUseCaseResponse {
  auditLog: AuditLog;
}

export class CreateAuditLogUseCase {
  constructor(
    private auditLogRepository: IAuditLogRepository
  ) {}

  async execute({
    userId,
    userName,
    role,
    sourceIp,
    action,
    affectedEntity,
    affectedRecordId,
    previousData,
    newData,
  }: CreateAuditLogUseCaseRequest): Promise<CreateAuditLogUseCaseResponse> {

    const auditLog = new AuditLog({
      userId,
      userName,
      role,
      sourceIp,
      dateTime: new Date(),
      action,
      affectedEntity,
      affectedRecordId,
      ...(previousData !== undefined ? { previousData } : {}),
      ...(newData !== undefined ? { newData } : {}),
    });

    await this.auditLogRepository.create(auditLog);

    return {
      auditLog,
    };
  }
}
