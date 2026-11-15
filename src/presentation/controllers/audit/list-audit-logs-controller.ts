
import type { Request, Response } from "express";

import type { ListAuditLogsUseCase } from "../../../core/use-cases/audit/list-audit-logs.js";
import type { AuditEntity } from "../../../core/entitties/audit-log.js";

export class ListAuditLogsController {
  constructor(
    private listAuditLogsUseCase: ListAuditLogsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // ========================================
      // PAGINAÇÃO
      // ========================================

      const page = Number(req.query.page ?? 1);

      const limit = Number(
        req.query.pageSize ?? req.query.limit ?? 10
      );

      if (
        !Number.isInteger(page) ||
        !Number.isInteger(limit) ||
        page < 1 ||
        limit < 1 ||
        limit > 100
      ) {
        return res.status(400).json({
          message: "Invalid pagination parameters",
        });
      }

      // ========================================
      // FILTRO POR RECURSO
      // ========================================

      const resource = req.query.resource
        ? String(req.query.resource)
        : undefined;

      // ========================================
      // FILTROS DE DATA
      // ========================================

      const dateFromValue = req.query.dateFrom
        ? String(req.query.dateFrom)
        : undefined;

      const dateToValue = req.query.dateTo
        ? String(req.query.dateTo)
        : undefined;

      const isValidDate = (value: string): boolean => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return false;
        }

        const date = new Date(`${value}T00:00:00.000Z`);

        return (
          !Number.isNaN(date.getTime()) &&
          date.toISOString().startsWith(value)
        );
      };

      if (
        (dateFromValue && !isValidDate(dateFromValue)) ||
        (dateToValue && !isValidDate(dateToValue))
      ) {
        return res.status(400).json({
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      if (
        dateFromValue &&
        dateToValue &&
        dateFromValue > dateToValue
      ) {
        return res.status(400).json({
          message: "Start date cannot be greater than end date",
        });
      }

      // ========================================
      // CONVERTER DATAS
      // ========================================

      const dateFrom = dateFromValue
        ? new Date(`${dateFromValue}T00:00:00.000Z`)
        : undefined;

      const dateTo = dateToValue
        ? new Date(`${dateToValue}T23:59:59.999Z`)
        : undefined;

      // ========================================
      // EXECUTAR USE CASE
      // ========================================

      const result = await this.listAuditLogsUseCase.execute({
        page,
        limit,
        ...(resource !== undefined && {
          resource: resource as AuditEntity,
        }),
        ...(dateFrom !== undefined && { dateFrom }),
        ...(dateTo !== undefined && { dateTo }),
      });

      // ========================================
      // RESPOSTA
      // ========================================

      return res.status(200).json({
        auditLogs: result.auditLogs,
        total: result.total,
        page: result.page,
        pageSize: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      });

    } catch (error) {
      console.error("Error listing audit logs:", error);

      return res.status(500).json({
        message: (error as Error).message,
      });
    }
  }
}
