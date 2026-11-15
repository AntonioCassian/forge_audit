import bcrypt from 'bcryptjs';
import type { IHashProvider } from '../repositories/IHashProvider.js';

export class BCryptHashProvider implements IHashProvider {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}