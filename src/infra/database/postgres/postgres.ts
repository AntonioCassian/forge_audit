// import dotenv from 'dotenv';
// import { Pool } from 'pg';

// dotenv.config({ override: true });

// const connectPostgres = new Pool({
//   host: process.env.POSTGRES_HOST,
//   port: Number(process.env.POSTGRES_PORT),
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   connectionString: process.env.POSTGRES_URL,
//   ssl: { rejectUnauthorized: false }
// });

// export default connectPostgres;


import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL não foi configurada!');
}

const connectPostgres = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connectPostgres;
