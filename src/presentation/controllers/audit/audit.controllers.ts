
import { MongoAuditLogRepository } from "../../../infra/repositories/MongoAuditLogRepository.js";

import { AuditLogModel } from "../../../infra/database/models/audit-log-model.js";

import { CreateAuditLogUseCase } from "../../../core/use-cases/audit/create-audit-log.js";
import { ListAuditLogsUseCase } from "../../../core/use-cases/audit/list-audit-logs.js";
import { GetAuditLogsByUserUseCase } from "../../../core/use-cases/audit/get-audit-logs-by-user.js";
import { GetAuditLogsByEntityUseCase } from "../../../core/use-cases/audit/get-audit-logs-by-entity.js";
import { ExportAuditTrailUseCase } from "../../../core/use-cases/audit/export-audit-trail.js";

import { CreateAuditLogController } from "./create-audit-log-controller.js";
import { ListAuditLogsController } from "./list-audit-logs-controller.js";
import { GetAuditLogsByUserController } from "./get-audit-logs-by-user-controller.js";
import { GetAuditLogsByEntityController } from "./get-audit-logs-by-entity-controller.js";
import { ExportAuditTrailController } from "./export-audit-trail-controller.js";

// Repository compartilhado
export const auditLogRepository = new MongoAuditLogRepository(
  AuditLogModel.collection as any
) as any;

// UseCase compartilhado
export const createAuditLogUseCase = new CreateAuditLogUseCase(
  auditLogRepository
);

// Controllers
export const createAuditLogController = new CreateAuditLogController(
  createAuditLogUseCase
);

export const listAuditLogsController = new ListAuditLogsController(
  new ListAuditLogsUseCase(auditLogRepository)
);

export const getAuditLogsByUserController = new GetAuditLogsByUserController(
  new GetAuditLogsByUserUseCase(auditLogRepository)
);

export const getAuditLogsByEntityController = new GetAuditLogsByEntityController(
  new GetAuditLogsByEntityUseCase(auditLogRepository)
);

export const exportAuditTrailController = new ExportAuditTrailController(
  new ExportAuditTrailUseCase(auditLogRepository)
);
