
import jwt from 'jsonwebtoken';
import type { ITokenProvider } from '../repositories/ITokenProvider.js';

export class JWTTokenProvider implements ITokenProvider {
  generate(payload: {
    sub: string;
    name: string;
    role: string;
  }): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado.');
    }

    return jwt.sign(payload, secret, {
      expiresIn: '1d',
    });
  }
}
