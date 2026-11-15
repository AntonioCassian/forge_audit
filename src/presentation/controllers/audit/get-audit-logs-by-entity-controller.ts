
import type { Request, Response } from "express";
import type { GetAuditLogsByEntityUseCase } from "../../../core/use-cases/audit/get-audit-logs-by-entity.js";

export class GetAuditLogsByEntityController {
  static handle: any;
  constructor(
    private getAuditLogsByEntityUseCase: GetAuditLogsByEntityUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { entityName, entityId } = req.params;
      const normalizedEntityName = Array.isArray(entityName)
        ? entityName[0]
        : entityName;
      const normalizedEntityId = Array.isArray(entityId)
        ? entityId[0]
        : entityId;

      if (!normalizedEntityName || !normalizedEntityId) {
        return res.status(400).json({
          message: "Entity name and entity ID are required",
        });
      }

      if (!["ordem_producao", "equipamento"].includes(normalizedEntityName)) {
        return res.status(400).json({
          message: "Invalid entity name",
        });
      }

      const { auditLogs } =
        await this.getAuditLogsByEntityUseCase.execute({
          entityName: normalizedEntityName as "ordem_producao" | "equipamento",
          entityId: normalizedEntityId,
        });

      return res.status(200).json({
        auditLogs,
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
