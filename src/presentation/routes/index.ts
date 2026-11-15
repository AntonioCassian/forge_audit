import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import machineRoutes from './machine.routes.js';
import productionRoutes from './production-order.routes.js';
import { auditRoutes } from './audit.routes.js';

const routes = Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/users', userRoutes);
routes.use('/api/machines', machineRoutes);
routes.use('/api/production-orders', productionRoutes);
routes.use('/api/audit-logs', auditRoutes);

export default routes;