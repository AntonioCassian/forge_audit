
import { Router } from "express";

import { ProductionOrderController } from "../controllers/production-order/ProductionOrderController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

import connectPostgres from "../../infra/database/postgres/postgres.js";

import { PgProductionOrderRepository } from "../../infra/database/repositories/pg-production-order-repository.js";
import { PgMachineRepository } from "../../infra/database/repositories/pg-machine-repository.js";

import { CreateProductionOrderUseCase } from "../../core/use-cases/produto_order/CreateProductionOrderUseCase.js";
import { UpdateProductionOrderStatusUseCase } from "../../core/use-cases/produto_order/update-producto-order.js";
import { GetProductionOrderByIdUseCase } from "../../core/use-cases/produto_order/get_production_order_byid_use_case.js";
import { GetAllProductionOrdersUseCase } from "../../core/use-cases/produto_order/getall_production_orders_usecase.js";
import { DeleteProductionOrderUseCase } from "../../core/use-cases/produto_order/delete_production_order_use_case.js";
import { createAuditLogUseCase } from "../controllers/audit/audit.controllers.js";

// UseCase de auditoria compartilhado
//import { createAuditLogUseCase } from "../controllers/audit/audit-dependencies.js";

const productionOrderRoutes = Router();

// ========================================
// REPOSITORIES
// ========================================

const productionOrderRepository = new PgProductionOrderRepository(
  connectPostgres
);

const machineRepository = new PgMachineRepository(
  connectPostgres
);

// ========================================
// USE CASES
// ========================================

const createProductionOrderUseCase =
  new CreateProductionOrderUseCase(productionOrderRepository);

const updateProductionOrderStatusUseCase =
  new UpdateProductionOrderStatusUseCase(
    productionOrderRepository as any,
    machineRepository as any
  );

const getProductionOrderByIdUseCase =
  new GetProductionOrderByIdUseCase(productionOrderRepository);

const getAllProductionOrdersUseCase =
  new GetAllProductionOrdersUseCase(productionOrderRepository);

const deleteProductionOrderUseCase =
  new DeleteProductionOrderUseCase(productionOrderRepository);

// ========================================
// CONTROLLER
// ========================================

const productionOrderController = new ProductionOrderController(
  createProductionOrderUseCase,
  updateProductionOrderStatusUseCase,
  getProductionOrderByIdUseCase,
  getAllProductionOrdersUseCase,
  deleteProductionOrderUseCase,
  createAuditLogUseCase
);

// ========================================
// AUTHENTICATION
// ========================================

productionOrderRoutes.use(AuthMiddleware);

// ========================================
// ROUTES
// ========================================

productionOrderRoutes.post(
  "/",
  (req, res, next): void => {
    void productionOrderController
      .create(
        req as Parameters<typeof productionOrderController.create>[0],
        res
      )
      .catch(next);
  }
);

productionOrderRoutes.get(
  "/",
  productionOrderController.findAll.bind(productionOrderController)
);

productionOrderRoutes.get(
  "/:id",
  productionOrderController.findById.bind(productionOrderController)
);

productionOrderRoutes.patch(
  "/:id/status",
  (req, res, next): void => {
    void productionOrderController
      .updateStatus(
        req as unknown as Parameters<typeof productionOrderController.updateStatus>[0],
        res
      )
      .catch(next);
  }
);

productionOrderRoutes.delete(
  "/:id",
  (req, res, next): void => {
    void productionOrderController
      .delete(
        req as unknown as Parameters<typeof productionOrderController.delete>[0],
        res
      )
      .catch(next);
  }
);

export default productionOrderRoutes;
