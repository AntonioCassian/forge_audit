
import type { Request, Response } from "express";
import type { CreateAuditLogUseCase } from "../../../core/use-cases/audit/create-audit-log.js";

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    name: string;
    role: string;
  };
};

export class CreateAuditLogController {
  static handle: any;
  constructor(
    private createAuditLogUseCase: CreateAuditLogUseCase
  ) {}

  async handle(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { auditLog } = await this.createAuditLogUseCase.execute({
        ...req.body,
        userId: req.user.id,
        userName: req.user.name,
        role: req.user.role,
        sourceIp: req.ip ?? "",
      });

      return res.status(201).json({
        message: "Audit log created successfully",
        auditLog,
      });
    } catch (error) {
      return res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
