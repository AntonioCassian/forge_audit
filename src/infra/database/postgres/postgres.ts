import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ override: true });

const connectPostgres = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

console.log('PostgreSQL host:', process.env.POSTGRES_HOST);
console.log('PostgreSQL port:', process.env.POSTGRES_PORT);

export default connectPostgres;