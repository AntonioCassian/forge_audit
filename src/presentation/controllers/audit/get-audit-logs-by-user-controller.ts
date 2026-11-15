
import type { Request, Response } from "express";
import type { GetAuditLogsByUserUseCase } from "../../../core/use-cases/audit/get-audit-logs-by-user.js";

export class GetAuditLogsByUserController {
  static handle: any;
  constructor(
    private getAuditLogsByUserUseCase: GetAuditLogsByUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;
      const normalizedUserId = Array.isArray(userId) ? userId[0] : userId;
      const normalizedStartDate = Array.isArray(startDate)
        ? startDate[0]
        : startDate;
      const normalizedEndDate = Array.isArray(endDate) ? endDate[0] : endDate;

      if (
        !normalizedUserId ||
        !normalizedStartDate ||
        !normalizedEndDate
      ) {
        return res.status(400).json({
          message: "User ID, start date and end date are required",
        });
      }

      const start = new Date(String(normalizedStartDate));
      const end = new Date(String(normalizedEndDate));

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        start > end
      ) {
        return res.status(400).json({
          message: "Invalid date range",
        });
      }

      const { auditLogs } = await this.getAuditLogsByUserUseCase.execute({
        userId: normalizedUserId,
        startDate: start,
        endDate: end,
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
