
import { Router } from "express";

// Controllers
import { CreateMachineController } from "../controllers/machine/create-machine-controller.js";
import { ListMachinesController } from "../controllers/machine/list-machines-controller.js";
import { FindMachineByIdController } from "../controllers/machine/find-machine-controller.js";
import { UpdateMachineController } from "../controllers/machine/update-machine-controller.js";
import { DeleteMachineController } from "../controllers/machine/delete-machine-controller.js";

// Middlewares
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { createAuditMiddleware } from "../middlewares/AuditMiddleware.js";

// Repository
import { PgMachineRepository } from "../../infra/database/repositories/pg-machine-repository.js";
import { MongoAuditLogRepository } from "../../infra/repositories/MongoAuditLogRepository.js";

// Database
import connectPostgres from "../../infra/database/postgres/postgres.js";

// Use Cases
import { CreateMachineUseCase } from "../../core/use-cases/equipment/CreateMachineUseCase.js";
import { ListMachinesUseCase } from "../../core/use-cases/equipment/list-machines.js";
import { FindMachineByIdUseCase } from "../../core/use-cases/equipment/find-machine-by-id.js";
import { UpdateMachineUseCase } from "../../core/use-cases/equipment/update-machine.js";
import { DeleteMachineUseCase } from "../../core/use-cases/equipment/delete-machine.js";
import { UpdateMachineStatusController } from "../controllers/machine/update-machine-status-controller.js";
import { UpdateMachineStatusUseCase } from "../../core/use-cases/equipment/update-machine-status-use-case.js";

const machineRoutes = Router();

// ========================================
// REPOSITORY
// ========================================

const machineRepository = new PgMachineRepository(connectPostgres);

// ========================================
// USE CASES
// ========================================

const createMachineUseCase = new CreateMachineUseCase(machineRepository);

const listMachinesUseCase = new ListMachinesUseCase(machineRepository);

const findMachineByIdUseCase = new FindMachineByIdUseCase(machineRepository);

const updateMachineUseCase = new UpdateMachineUseCase(machineRepository);

const updateStatusMachineUseCase = new UpdateMachineStatusUseCase(machineRepository);

const deleteMachineUseCase = new DeleteMachineUseCase(machineRepository);

// ========================================
// CONTROLLERS
// ========================================

const createMachineController = new CreateMachineController(
  createMachineUseCase
);

const listMachinesController = new ListMachinesController(
  listMachinesUseCase
);

const findMachineByIdController = new FindMachineByIdController(
  findMachineByIdUseCase
);

const updateMachineController = new UpdateMachineController(
  updateMachineUseCase
);

const updateMachineStatusController =
  new UpdateMachineStatusController(updateStatusMachineUseCase);

const deleteMachineController = new DeleteMachineController(
  deleteMachineUseCase
);

// ========================================
// AUDIT MIDDLEWARE
// ========================================

const machineAuditMiddleware = createAuditMiddleware({
  resource: "equipamento",

  getOldValues: (id) => machineRepository.findById(id),

  saveAudit: (data) => MongoAuditLogRepository.create(data),
});

// ========================================
// AUTHENTICATION
// ========================================

machineRoutes.use(AuthMiddleware);

// ========================================
// ROUTES
// ========================================

// CREATE MACHINE
machineRoutes.post(
  "/",
  machineAuditMiddleware,
  createMachineController.handle.bind(createMachineController)
);

// LIST MACHINES
machineRoutes.get(
  "/",
  listMachinesController.handle.bind(listMachinesController)
);

// FIND MACHINE BY ID
machineRoutes.get(
  "/:id",
  findMachineByIdController.handle.bind(findMachineByIdController)
);

// UPDATE MACHINE
machineRoutes.put(
  "/:id",
  machineAuditMiddleware,
  updateMachineController.handle.bind(updateMachineController)
);

machineRoutes.patch(
  "/:id/status",
  machineAuditMiddleware,
  updateMachineStatusController.handle.bind(updateMachineStatusController)
);

// DELETE MACHINE
machineRoutes.delete(
  "/:id",
  machineAuditMiddleware,
  deleteMachineController.handle.bind(deleteMachineController)
);

export default machineRoutes;
