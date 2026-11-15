import { Router } from "express";

// Middlewares
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { createAuditMiddleware } from "../middlewares/AuditMiddleware.js";

// Controllers
import { CreateUserController } from "../controllers/users/CreateUserController.js";
import { ListUsersController } from "../controllers/users/ListUsersController.js";
import { FindUserController } from "../controllers/users/FindUserController.js";
import { UpdateUserController } from "../controllers/users/UpdateUserController.js";
import { ChangeUserRoleController } from "../controllers/users/ChangeUserRoleController.js";
import { DeleteUserController } from "../controllers/users/DeleteUserController.js";

// Repositories
import { PostgresUserRepository } from "../../infra/database/repositories/PostgresUserRepository.js";
import { MongoAuditLogRepository } from "../../infra/repositories/MongoAuditLogRepository.js";

// Database connection
import connectPostgres from "../../infra/database/postgres/postgres.js";

// Use Cases
import { CreateUserUseCase } from "../../core/use-cases/user/CreateUserUseCase.js";
import { ListUsersUseCase } from "../../core/use-cases/user/ListUsersUseCase.js";
import { FindUserUseCase } from "../../core/use-cases/user/FindUserUseCase.js";
import { UpdateUserUseCase } from "../../core/use-cases/user/UpdateUserUseCase.js";
import { ChangeUserRoleUseCase } from "../../core/use-cases/user/ChangeUserRoleUseCase.js";
import { DeleteUserUseCase } from "../../core/use-cases/user/DeleteUserUseCase.js";

const userRoutes = Router();

// ========================================
// REPOSITORY
// ========================================

const userRepository = new PostgresUserRepository(connectPostgres);

// ========================================
// USE CASES
// ========================================

const createUserUseCase = new CreateUserUseCase(userRepository);

const listUsersUseCase = new ListUsersUseCase(userRepository);

const findUserUseCase = new FindUserUseCase(userRepository);

const updateUserUseCase = new UpdateUserUseCase(userRepository);

const changeUserRoleUseCase = new ChangeUserRoleUseCase(userRepository);

const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// ========================================
// CONTROLLERS
// ========================================

const createUserController = new CreateUserController(createUserUseCase);

const listUsersController = new ListUsersController(listUsersUseCase);

const findUserController = new FindUserController(findUserUseCase);

const updateUserController = new UpdateUserController(updateUserUseCase);

const changeUserRoleController = new ChangeUserRoleController(changeUserRoleUseCase);

const deleteUserController = new DeleteUserController(deleteUserUseCase);

// ========================================
// AUDIT MIDDLEWARE
// ========================================

const userAuditMiddleware = createAuditMiddleware({
  resource: "users",

  getOldValues: (id) => userRepository.findById(id),

  saveAudit: (data) => MongoAuditLogRepository.create(data),
});

// ========================================
// AUTHENTICATION
// ========================================

userRoutes.use(AuthMiddleware);

// ========================================
// ROUTES
// ========================================

// CREATE USER
userRoutes.post(
  "/",
  userAuditMiddleware,
  createUserController.handle.bind(createUserController)
);

// LIST USERS
userRoutes.get(
  "/",
  listUsersController.handle.bind(listUsersController)
);

// FIND USER
userRoutes.get(
  "/:id",
  findUserController.handle.bind(findUserController)
);

// UPDATE USER
userRoutes.put(
  "/:id",
  userAuditMiddleware,
  updateUserController.handle.bind(updateUserController)
);

// CHANGE USER ROLE
userRoutes.patch(
  "/:id/role",
  userAuditMiddleware,
  changeUserRoleController.handle.bind(changeUserRoleController)
);

// DELETE USER
userRoutes.delete(
  "/:id",
  userAuditMiddleware,
  deleteUserController.handle.bind(deleteUserController)
);

export default userRoutes;