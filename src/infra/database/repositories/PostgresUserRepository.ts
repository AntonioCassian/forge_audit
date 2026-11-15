import { Pool } from 'pg';
import type { IUserRepository } from '../../repositories/IUserRepository.js';
import { User, type UserRole } from '../../../core/entitties/usuarios.js';

export class PostgresUserRepository implements IUserRepository {
  static findById: any;
  constructor(private db: Pool) {}

async create(user: User): Promise<User> {
  const result = await this.db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      user.name,
      user.email,
      user.passwordHash,
      user.role
    ]
  );

  return this.mapToEntity(result.rows[0]);
}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) return null;

    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;

    return this.mapToEntity(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const result = await this.db.query('SELECT * FROM users');

    return result.rows.map((row) => this.mapToEntity(row));
  }

  async save(user: User): Promise<User> {
    const result = await this.db.query(
      `UPDATE users
       SET name = $1, email = $2, password_hash = $3, role = $4
       WHERE id = $5
       RETURNING *`,
      [user.name, user.email, user.passwordHash, user.role, user.id]
    );

    if (result.rows.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    return this.mapToEntity(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
  }

  private mapToEntity(row: any): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as UserRole,
    });
  }
}