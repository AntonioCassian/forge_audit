import { Router } from 'express';
import { PostgresUserRepository } from '../../infra/database/repositories/PostgresUserRepository.js';

import { AuthenticateUser } from '../../core/use-cases/auth/authenticate_user.js';
import { AuthenticateUserController } from '../controllers/auth/AuthenticateUserController.js';
import connectPostgres from '../../infra/database/postgres/postgres.js';
import { BCryptHashProvider } from '../../infra/providers/BCryptHashProvider.js';
import { JWTTokenProvider } from '../../infra/providers/JWTTokenProvider.js';


const authRoutes = Router();

// Dependências
const userRepository = new PostgresUserRepository(connectPostgres);
const hashProvider = new BCryptHashProvider();
const tokenProvider = new JWTTokenProvider();

// Caso de uso
const authenticateUser = new AuthenticateUser(
  userRepository,
  hashProvider,
  tokenProvider
);

// Controller
const authenticateUserController = new AuthenticateUserController(
  authenticateUser
);

// Rota de login
authRoutes.post('/login', (req, res, next) =>
  authenticateUserController.handle(req, res, next)
);

export default authRoutes;