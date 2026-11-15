
import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface AuthenticatedUser {
  id: string;
  name: string;
  role: 'OPERATOR' | 'SUPERVISOR' | 'AUDITOR';
}

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization token is required.',
      });
    }

    const parts = authHeader.split(' ');

    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer' ||
      !parts[1]
    ) {
      return res.status(401).json({
        error: 'Invalid authorization format.',
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }

    const decoded = jwt.verify(parts[1], secret);

    if (typeof decoded === 'string') {
      return res.status(401).json({
        error: 'Invalid token payload.',
      });
    }

    const payload = decoded as JwtPayload;

    const validRoles = [
      'OPERATOR',
      'SUPERVISOR',
      'AUDITOR',
    ];

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.name !== 'string' ||
      !validRoles.includes(payload.role)
    ) {
      return res.status(401).json({
        error: 'Invalid token payload.',
      });
    }

    const user: AuthenticatedUser = {
      id: payload.sub,
      name: payload.name,
      role: payload.role as AuthenticatedUser['role'],
    };

    (req as Request & { user: AuthenticatedUser }).user = user;

    return next();

  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.NotBeforeError
    ) {
      return res.status(401).json({
        error: 'Invalid or expired token.',
      });
    }

    console.error('Erro no AuthMiddleware:', error);

    return res.status(500).json({
      error: 'Internal authentication error.',
    });
  }
}
