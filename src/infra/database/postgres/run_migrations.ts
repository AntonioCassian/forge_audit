
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import connectPostgres from './postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');

  const client = await connectPostgres.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    const files = await fs.readdir(migrationsDir);

    const migrations = files
      .filter((file) => /^\d+_.*\.sql$/.test(file))
      .sort();

    for (const migration of migrations) {
      const result = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [migration]
      );

      if (result.rowCount && result.rowCount > 0) {
        console.log(`Migration já executada: ${migration}`);
        continue;
      }

      const migrationPath = path.join(migrationsDir, migration);
      const sql = await fs.readFile(migrationPath, 'utf-8');

      console.log(`Executando migration: ${migration}`);

      try {
        await client.query('BEGIN');

        await client.query(sql);

        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [migration]
        );

        await client.query('COMMIT');

        console.log(`Migration concluída: ${migration}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Erro na migration: ${migration}`);
        throw error;
      }
    }

    console.log('Todas as migrations foram processadas!');
  } finally {
    client.release();
  }
}

runMigrations().catch((error) => {
  console.error('Falha ao executar migrations:', error);
  process.exitCode = 1;
});
