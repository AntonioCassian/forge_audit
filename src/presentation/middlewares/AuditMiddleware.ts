
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import { AuditLog } from "../../core/entitties/audit-log.js";
import type { AuditEntity } from "../../core/entitties/audit-log.js";
import type { UserRole } from "../../core/entitties/usuarios.js";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

interface AuditMiddlewareDependencies {
  getOldValues: (id: string) => Promise<unknown>;
  saveAudit: (data: AuditLog) => Promise<void>;
  resource: AuditEntity;
}

export function createAuditMiddleware({
  getOldValues,
  saveAudit,
  resource,
}: AuditMiddlewareDependencies): RequestHandler {

  return async function auditMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return next();
    }

    try {
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        res.status(401).json({
          error: "User not authenticated.",
        });
        return;
      }

      const resourceId =
        typeof req.params.id === "string"
          ? req.params.id
          : null;

      let oldValues: unknown = null;

      if (
        ["PUT", "PATCH", "DELETE"].includes(req.method) &&
        resourceId
      ) {
        oldValues = await getOldValues(resourceId);
      }

      const originalJson = res.json.bind(res);

      let auditStarted = false;

      res.json = ((body: unknown) => {

        const response = originalJson(body);

        if (
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          !auditStarted
        ) {
          auditStarted = true;

          const auditLog = new AuditLog({
            userId: user.id,
            userName: user.email,
            role: user.role,
            sourceIp: req.ip ?? "unknown",
            dateTime: new Date(),
            action: req.method,
            affectedEntity: resource,
            affectedRecordId: resourceId ?? "unknown",
            ...(oldValues && typeof oldValues === "object"
              ? { previousData: oldValues as Record<string, unknown> }
              : {}),
            ...(body && typeof body === "object"
              ? { newData: body as Record<string, unknown> }
              : {}),
          });

          void saveAudit(auditLog).catch((error: unknown) => {
            console.error(
              "Erro ao salvar registro de auditoria:",
              error
            );
          });
        }

        return response;

      }) as Response["json"];

      return next();

    } catch (error) {
      console.error("Erro no AuditMiddleware:", error);

      if (!res.headersSent) {
        res.status(500).json({
          error: "Erro ao preparar auditoria.",
        });
      }
    }
  };
}
