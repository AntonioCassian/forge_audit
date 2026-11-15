
import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { connectMongoDB } from './infra/database/mongodb.js';
import connectPostgres from './infra/database/postgres/postgres.js';

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    // 1. Conectar MongoDB
    await connectMongoDB();

    console.log('MongoDB conectado!!!');

    // 2. Conectar PostgreSQL
    await connectPostgres.query('SELECT NOW()');

    console.log('PostgreSQL conectado!');

    // 3. Importar rotas somente depois das conexões
    const { default: routes } = await import(
      './presentation/routes/index.js'
    );

    app.use(routes);

    // 4. Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar aplicação:', error);
    process.exit(1);
  }
};

startServer();
