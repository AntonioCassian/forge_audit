
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

interface AuditData {
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string | null;
  ip: string | undefined;
  timestamp: Date;
  oldValues: unknown;
  newValues: unknown;
}

interface AuditMiddlewareDependencies {
  getOldValues: (id: string) => Promise<unknown>;
  saveAudit: (data: AuditData) => Promise<void>;
  resource: string;
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

    // 1. Verifica o método HTTP
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return next();
    }

    try {
      // 2. Recupera o usuário autenticado
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        res.status(401).json({
          error: "User not authenticated.",
        });
        return;
      }

      // 3. Recupera o ID do recurso
      const resourceId =
        typeof req.params.id === "string"
          ? req.params.id
          : null;

      // 4. Captura os dados antigos
      let oldValues: unknown = null;

      if (
        ["PUT", "PATCH", "DELETE"].includes(req.method) &&
        resourceId
      ) {
        oldValues = await getOldValues(resourceId);
      }

      // 5. Guarda a função original do Express
      const originalJson = res.json.bind(res);

      let auditStarted = false;

      // 6. Intercepta a resposta JSON
      res.json = ((body: unknown) => {

        // Envia a resposta original
        const response = originalJson(body);

        // Verifica se a operação foi bem-sucedida
        if (
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          !auditStarted
        ) {
          auditStarted = true;

          const auditData: AuditData = {
            userId: user.id,
            userEmail: user.email,
            userRole: user.role,
            action: req.method,
            resource,
            resourceId,
            ip: req.ip,
            timestamp: new Date(),
            oldValues,
            newValues: body,
          };

          // 7. Grava no MongoDB sem bloquear a resposta
          void saveAudit(auditData).catch((error: unknown) => {
            console.error(
              "Erro ao salvar registro de auditoria:",
              error
            );
          });
        }

        return response;

      }) as Response["json"];

      // 8. Continua para o controller
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
