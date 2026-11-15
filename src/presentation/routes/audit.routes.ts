
import { Router } from "express";

import {
  createAuditLogController,
  listAuditLogsController,
  getAuditLogsByUserController,
  getAuditLogsByEntityController,
  exportAuditTrailController,
} from "../controllers/audit/audit.controllers.js";

import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

const auditRoutes = Router();

// ========================================
// AUTHENTICATION
// Todas as rotas exigem autenticação JWT
// ========================================

auditRoutes.use(AuthMiddleware);

// ========================================
// CREATE AUDIT LOG
// POST /audit-logs
// Cria um registro de auditoria manualmente
// ========================================

auditRoutes.post(
  "/",
  (req, res, next) => {
    void createAuditLogController.handle(
      req as Parameters<typeof createAuditLogController.handle>[0],
      res
    ).catch(next);
  }
);

// ========================================
// LIST AUDIT LOGS
// GET /audit-logs
// Lista todos os registros de auditoria
// ========================================

auditRoutes.get(
  "/",
  listAuditLogsController.handle.bind(listAuditLogsController)
);

// ========================================
// GET AUDIT LOGS BY USER
// GET /audit-logs/user/:userId
// Busca auditorias realizadas por um usuário
// ========================================

auditRoutes.get(
  "/user/:userId",
  getAuditLogsByUserController.handle.bind(getAuditLogsByUserController)
);

// ========================================
// GET AUDIT LOGS BY ENTITY
// GET /audit-logs/entity/:entityName/:entityId
// Busca alterações de uma entidade específica
// ========================================

auditRoutes.get(
  "/entity/:entityName/:entityId",
  getAuditLogsByEntityController.handle.bind(getAuditLogsByEntityController)
);

// ========================================
// EXPORT AUDIT TRAIL
// GET /audit-logs/export
// Exporta o histórico de auditoria em CSV
// ========================================

auditRoutes.get(
  "/export",
  exportAuditTrailController.handle.bind(exportAuditTrailController)
);

export { auditRoutes };
