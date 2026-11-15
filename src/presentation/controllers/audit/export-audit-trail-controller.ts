
import type { Request, Response } from "express";
import type { ExportAuditTrailUseCase } from "../../../core/use-cases/audit/export-audit-trail.js";

export class ExportAuditTrailController {
  static handle: any;
  constructor(
    private exportAuditTrailUseCase: ExportAuditTrailUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const {
        entityName,
        entityId,
        userId,
        startDate,
        endDate,
      } = req.query;

      if (Boolean(entityName) !== Boolean(entityId)) {
        return res.status(400).json({
          message: "Entity name and entity ID must be provided together",
        });
      }

      if (Boolean(startDate) !== Boolean(endDate)) {
        return res.status(400).json({
          message: "Start date and end date must be provided together",
        });
      }

      const parsedStartDate = startDate
        ? new Date(String(startDate))
        : undefined;

      const parsedEndDate = endDate
        ? new Date(String(endDate))
        : undefined;

      if (
        (parsedStartDate && Number.isNaN(parsedStartDate.getTime())) ||
        (parsedEndDate && Number.isNaN(parsedEndDate.getTime())) ||
        (parsedStartDate &&
          parsedEndDate &&
          parsedStartDate > parsedEndDate)
      ) {
        return res.status(400).json({
          message: "Invalid date range",
        });
      }

      const exportRequest = {
        ...(entityName !== undefined
          ? {
              entityName: entityName as
                | "ordem_producao"
                | "equipamento",
            }
          : {}),
        ...(entityId !== undefined
          ? { entityId: String(entityId) }
          : {}),
        ...(userId !== undefined
          ? { userId: String(userId) }
          : {}),
        ...(parsedStartDate
          ? { startDate: parsedStartDate }
          : {}),
        ...(parsedEndDate
          ? { endDate: parsedEndDate }
          : {}),
      };

      const {
        fileName,
        content,
        contentType,
      } = await this.exportAuditTrailUseCase.execute(exportRequest);

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      return res.status(200).send(content);
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
