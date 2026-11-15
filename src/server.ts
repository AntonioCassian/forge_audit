import 'dotenv/config';

import express from 'express';

import { connectMongoDB } from './infra/database/mongodb.js';
import connectPostgres from './infra/database/postgres/postgres.js';
import routes from './presentation/routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB();
    await connectPostgres.query('SELECT NOW()');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
};

startServer();